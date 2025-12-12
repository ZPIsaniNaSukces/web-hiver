"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { BackArrow } from "@/app/(app)/company-members/components/back-arrow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { UserSelect } from "@/components/users/user-select";
import { TaskStatus, TaskType } from "@/config/enums";
import type { User } from "@/types/auth-types";
import { createTaskSchema } from "@/types/task-types";

import { useCreateTask } from "../hooks/use-create-task";
import { AssigneeSelect } from "./components/assignee-select";

type FormValues = {
  title: string;
  description: string;
  status: TaskStatus;
  type: TaskType;
  dueDate: string;
};

type FormErrors = Partial<
  Record<
    | "title"
    | "description"
    | "status"
    | "type"
    | "dueDate"
    | "reporterId"
    | "assigneeId",
    string
  >
>;

const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.TODO, label: "Do zrobienia" },
  { value: TaskStatus.DONE, label: "Zrobione" },
] as const;

const TASK_TYPE_OPTIONS = [
  { value: TaskType.FEATURE, label: "Funkcjonalność" },
  { value: TaskType.BUG, label: "Błąd" },
  { value: TaskType.IMPROVEMENT, label: "Usprawnienie" },
  { value: TaskType.DOCUMENTATION, label: "Dokumentacja" },
  { value: TaskType.MEETTING, label: "Spotkanie" },
  { value: TaskType.OTHER, label: "Inne" },
] as const;

const createInitialFormValues = (): FormValues => ({
  title: "",
  description: "",
  status: TaskStatus.TODO,
  type: TaskType.FEATURE,
  dueDate: "",
});

export default function AddTaskPage() {
  const router = useRouter();

  const [values, setValues] = useState<FormValues>(createInitialFormValues);
  const [selectedReporter, setSelectedReporter] = useState<User | null>(null);
  const [selectedAssignee, setSelectedAssignee] = useState<User | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const createTaskMutation = useCreateTask();
  const isSubmitting = createTaskMutation.isPending;

  const resetForm = () => {
    setValues(createInitialFormValues());
    setSelectedReporter(null);
    setSelectedAssignee(null);
    setErrors({});
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = values.title.trim();
    const trimmedDescription = values.description.trim();
    const dueDateValue = values.dueDate.trim();
    const reporterIdNumber = selectedReporter
      ? Number(selectedReporter.id)
      : undefined;
    const assigneeIdNumber = selectedAssignee
      ? Number(selectedAssignee.id)
      : undefined;

    if (selectedReporter && Number.isNaN(reporterIdNumber)) {
      setErrors((prev) => ({
        ...prev,
        reporterId: "Niepoprawny zgłaszający",
      }));
      toast.error("Popraw błędy w formularzu");
      return;
    }

    if (selectedAssignee && Number.isNaN(assigneeIdNumber)) {
      setErrors((prev) => ({
        ...prev,
        assigneeId: "Niepoprawny wykonawca",
      }));
      toast.error("Popraw błędy w formularzu");
      return;
    }

    const result = createTaskSchema.safeParse({
      title: trimmedTitle,
      description: trimmedDescription === "" ? undefined : trimmedDescription,
      status: values.status,
      type: values.type,
      dueDate: dueDateValue === "" ? undefined : dueDateValue,
      reporterId: reporterIdNumber,
      assigneeId: assigneeIdNumber,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        title: fieldErrors.title?.[0],
        description: fieldErrors.description?.[0],
        status: fieldErrors.status?.[0],
        type: fieldErrors.type?.[0],
        dueDate: fieldErrors.dueDate?.[0],
        reporterId: fieldErrors.reporterId?.[0],
        assigneeId: fieldErrors.assigneeId?.[0],
      });
      toast.error("Popraw błędy w formularzu");
      return;
    }

    setErrors({});

    createTaskMutation.mutate(result.data, {
      onSuccess: () => {
        toast.success("Zadanie zostało dodane");
        resetForm();
        router.push("/manage/tasks");
      },
      onError: (error) => {
        toast.error(error?.error ?? "Nie udało się dodać zadania");
      },
    });
  };

  const handleReporterChange = (reporter: User | null) => {
    setSelectedReporter(reporter);
    setErrors((prev) => ({ ...prev, reporterId: undefined }));
  };

  const handleAssigneeChange = (assignee: User | null) => {
    setSelectedAssignee(assignee);
    setErrors((prev) => ({ ...prev, assigneeId: undefined }));
  };

  return (
    <div className="mx-4 space-y-6 md:mr-8 md:ml-0">
      <BackArrow href="/manage/tasks" label="Wróć do listy zadań" />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Dodaj zadanie</h1>
        <p className="text-sm text-gray-500">
          Uzupełnij najważniejsze informacje o zadaniu. Pola oznaczone gwiazdką
          są obowiązkowe.
        </p>
      </div>

      <form
        className="overflow-hidden rounded-xl border bg-white shadow-sm"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="grid gap-6 px-6 py-6">
          <div className="flex flex-col gap-1">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Tytuł zadania*
            </label>
            <Input
              id="title"
              type="text"
              placeholder="np. Przygotować raport kwartalny"
              value={values.title}
              onChange={(event) => {
                const nextValue = event.target.value;
                setValues((prev) => ({ ...prev, title: nextValue }));
                if (errors.title) {
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }
              }}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "task-title-error" : undefined}
              disabled={isSubmitting}
            />
            {errors.title && (
              <p id="task-title-error" className="text-destructive text-sm">
                {errors.title}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700"
            >
              Opis zadania
            </label>
            <textarea
              id="description"
              placeholder="Dodaj dodatkowe szczegóły, wymagania, linki..."
              value={values.description}
              onChange={(event) => {
                const nextValue = event.target.value;
                setValues((prev) => ({ ...prev, description: nextValue }));
                if (errors.description) {
                  setErrors((prev) => ({
                    ...prev,
                    description: undefined,
                  }));
                }
              }}
              className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 focus-visible:border-primary focus-visible:ring-primary/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive min-h-[120px] w-full rounded-md bg-white px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[1px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-invalid={!!errors.description}
              aria-describedby={
                errors.description ? "task-description-error" : undefined
              }
              disabled={isSubmitting}
            />
            {errors.description && (
              <p
                id="task-description-error"
                className="text-destructive text-sm"
              >
                {errors.description}
              </p>
            )}
            <p className="text-xs text-gray-400">
              Opis pomoże zespołowi lepiej zrozumieć zakres zadania.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Status*</span>
              <Select
                value={values.status}
                onValueChange={(nextValue) => {
                  setValues((prev) => ({
                    ...prev,
                    status: nextValue as TaskStatus,
                  }));
                  if (errors.status) {
                    setErrors((prev) => ({ ...prev, status: undefined }));
                  }
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger
                  aria-invalid={!!errors.status}
                  className="w-full"
                >
                  <SelectValue placeholder="Wybierz status" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_STATUS_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-destructive text-sm">{errors.status}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">
                Typ zadania*
              </span>
              <Select
                value={values.type}
                onValueChange={(nextValue) => {
                  setValues((prev) => ({
                    ...prev,
                    type: nextValue as TaskType,
                  }));
                  if (errors.type) {
                    setErrors((prev) => ({ ...prev, type: undefined }));
                  }
                }}
                disabled={isSubmitting}
              >
                <SelectTrigger aria-invalid={!!errors.type} className="w-full">
                  <SelectValue placeholder="Wybierz typ" />
                </SelectTrigger>
                <SelectContent>
                  {TASK_TYPE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-destructive text-sm">{errors.type}</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="dueDate"
                className="text-sm font-medium text-gray-700"
              >
                Termin wykonania
              </label>
              <Input
                id="dueDate"
                type="date"
                value={values.dueDate}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setValues((prev) => ({ ...prev, dueDate: nextValue }));
                  if (errors.dueDate) {
                    setErrors((prev) => ({ ...prev, dueDate: undefined }));
                  }
                }}
                aria-invalid={!!errors.dueDate}
                aria-describedby={
                  errors.dueDate ? "task-due-date-error" : undefined
                }
                disabled={isSubmitting}
              />
              {errors.dueDate && (
                <p
                  id="task-due-date-error"
                  className="text-destructive text-sm"
                >
                  {errors.dueDate}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">
                Zgłaszający
              </span>
              <UserSelect
                value={selectedReporter}
                onChange={handleReporterChange}
                disabled={isSubmitting}
                error={errors.reporterId}
                placeholder="Wybierz zgłaszającego"
                searchPlaceholder="Szukaj po nazwisku, mailu..."
                emptyOptionLabel="Brak zgłaszającego"
              />
              <span className="text-xs text-gray-400">
                Osoba, która zgłasza zadanie i będzie otrzymywać aktualizacje.
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-gray-700">Wykonawca</span>
            <AssigneeSelect
              value={selectedAssignee}
              onChange={handleAssigneeChange}
              disabled={isSubmitting}
              error={errors.assigneeId}
            />
            <span className="text-xs text-gray-400">
              Wybierz osobę odpowiedzialną za realizację zadania.
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <Spinner className="size-4" />
                Zapisywanie...
              </span>
            ) : (
              "Dodaj zadanie"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
