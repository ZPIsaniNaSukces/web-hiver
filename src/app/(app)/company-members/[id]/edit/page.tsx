"use client";

import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { BackArrow } from "@/app/(app)/company-members/components/back-arrow";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DataStateWrapper } from "@/components/ui/data-state-wrapper";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { UserSelect } from "@/components/users/user-select";
import { Role } from "@/config/enums";
import { cn } from "@/lib/utils";
import type { User } from "@/types/auth-types";
import { UpdateUserSchema, type UpdateUserType } from "@/types/user-list-types";

import { useUpdateUser } from "../../hooks/use-update-user";
import { useUserDetails } from "../../hooks/use-user-details";
import { formatRole } from "../../utils";

const ROLE_OPTIONS = Object.values(Role);

function normalizeDateInput(date: string | null | undefined) {
  if (!date) {
    return "";
  }

  return date.split("T")[0] ?? "";
}

type FormValues = {
  email: string;
  name: string;
  surname: string;
  phone: string;
  title: string;
  dateOfBirth: string;
  role: Role | "";
};

type FormErrors = Partial<
  Record<
    "name" | "surname" | "bossId" | "phone" | "title" | "dateOfBirth" | "role",
    string
  >
>;

export default function EditUserPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const userId = params?.id;

  const { data, isLoading, isError, error } = useUserDetails(userId);
  const user = data?.data;

  const [values, setValues] = useState<FormValues>({
    email: "",
    name: "",
    surname: "",
    phone: "",
    title: "",
    dateOfBirth: "",
    role: "",
  });
  const [selectedBoss, setSelectedBoss] = useState<User | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      return;
    }

    setValues({
      email: user.email ?? "",
      name: user.name ?? "",
      surname: user.surname ?? "",
      phone: user.phone ?? "",
      title: user.title ?? "",
      dateOfBirth: normalizeDateInput(user.dateOfBirth),
      role: user.role ?? "",
    });
    setSelectedBoss(user.boss ?? null);
  }, [user]);

  const updateUserMutation = useUpdateUser();
  const isSubmitting = updateUserMutation.isPending;
  const parsedDate = values.dateOfBirth
    ? parseISO(values.dateOfBirth)
    : undefined;
  const selectedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : undefined;
  const today = new Date();

  const handleBossChange = (boss: User | null) => {
    setSelectedBoss(boss);
    setErrors((prev) => ({ ...prev, bossId: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!userId) {
      toast.error("Brak identyfikatora użytkownika");
      return;
    }

    if (!user) {
      toast.error("Brak danych użytkownika");
      return;
    }

    const bossIdValue = selectedBoss ? Number(selectedBoss.id) : null;

    if (selectedBoss && Number.isNaN(bossIdValue)) {
      setErrors((prev) => ({ ...prev, bossId: "Niepoprawny przełożony" }));
      toast.error("Popraw błędy w formularzu");
      return;
    }

    const trimmedName = values.name.trim();
    const trimmedSurname = values.surname.trim();
    const trimmedPhone = values.phone.trim();
    const trimmedTitle = values.title.trim();
    const resolvedRole = values.role === "" ? user.role : values.role;

    if (!resolvedRole) {
      setErrors((prev) => ({ ...prev, role: "Wybierz rolę użytkownika" }));
      toast.error("Wybierz rolę użytkownika");
      return;
    }

    const nextPhone = trimmedPhone === "" ? null : trimmedPhone;
    const nextTitle = trimmedTitle === "" ? null : trimmedTitle;
    const nextDateOfBirth = values.dateOfBirth ? values.dateOfBirth : null;

    const currentBossIdNumber = user.boss?.id ? Number(user.boss.id) : null;
    const currentPhone = user.phone ? user.phone.trim() : null;
    const currentTitle = user.title ? user.title.trim() : null;
    const currentDateOfBirthValue = user.dateOfBirth
      ? normalizeDateInput(user.dateOfBirth)
      : "";
    const currentDateOfBirth = currentDateOfBirthValue
      ? currentDateOfBirthValue
      : null;

    const currentPayload: UpdateUserType = {
      email: user.email ?? values.email,
      name: (user.name ?? "").trim(),
      surname: (user.surname ?? "").trim(),
      bossId: currentBossIdNumber,
      phone: currentPhone,
      title: currentTitle,
      dateOfBirth: currentDateOfBirth,
      role: user.role,
    };

    const nextPayload: UpdateUserType = {
      email: values.email || user.email,
      name: trimmedName,
      surname: trimmedSurname,
      bossId: bossIdValue,
      phone: nextPhone,
      title: nextTitle,
      dateOfBirth: nextDateOfBirth,
      role: resolvedRole as Role,
    };

    const hasChanges = (
      Object.keys(nextPayload) as Array<keyof UpdateUserType>
    ).some((key) => nextPayload[key] !== currentPayload[key]);

    if (!hasChanges) {
      toast.info("Brak zmian do zapisania");
      return;
    }

    const result = UpdateUserSchema.safeParse(nextPayload);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        name: fieldErrors.name?.[0],
        surname: fieldErrors.surname?.[0],
        bossId: fieldErrors.bossId?.[0],
        phone: fieldErrors.phone?.[0],
        title: fieldErrors.title?.[0],
        dateOfBirth: fieldErrors.dateOfBirth?.[0],
        role: fieldErrors.role?.[0],
      });
      toast.error("Popraw błędy w formularzu");
      return;
    }

    setErrors({});

    updateUserMutation.mutate(
      { userId, data: result.data },
      {
        onSuccess: (response) => {
          toast.success("Dane użytkownika zostały zaktualizowane");
          router.push(`/users/${response?.data?.id ?? userId}`);
        },
        onError: (mutationError) => {
          toast.error(
            mutationError?.error ?? "Nie udało się zaktualizować użytkownika",
          );
        },
      },
    );
  };

  return (
    <div className="mx-4 space-y-6 md:mr-8 md:ml-0">
      <BackArrow
        href={`/users/${userId ?? ""}`}
        label="Wróć do szczegółów pracownika"
      />
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Edytuj pracownika</h1>
        <p className="text-sm text-gray-500">
          Zaktualizuj dane pracownika lub zmień przypisanego przełożonego.
        </p>
      </div>

      <DataStateWrapper
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.error}
        hasData={Boolean(user)}
        emptyFallback={<span>Nie znaleziono danych użytkownika.</span>}
      >
        <form
          className="overflow-hidden rounded-xl border bg-white shadow-sm"
          onSubmit={handleSubmit}
          noValidate
        >
          <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
            <div className="flex flex-col gap-1 md:col-span-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Adres e-mail
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={values.email}
                readOnly
                disabled
              />
              <span className="text-xs text-gray-400">
                Adres e-mail jest stały i nie podlega edycji.
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-sm font-medium text-gray-700"
              >
                Imię*
              </label>
              <Input
                id="name"
                type="text"
                autoComplete="given-name"
                placeholder="np. Jan"
                value={values.name}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setValues((prev) => ({ ...prev, name: nextValue }));
                  if (errors.name) {
                    setErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "user-name-error" : undefined}
                disabled={isSubmitting || !user}
              />
              {errors.name && (
                <p id="user-name-error" className="text-destructive text-sm">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="surname"
                className="text-sm font-medium text-gray-700"
              >
                Nazwisko*
              </label>
              <Input
                id="surname"
                type="text"
                autoComplete="family-name"
                placeholder="np. Kowalski"
                value={values.surname}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setValues((prev) => ({ ...prev, surname: nextValue }));
                  if (errors.surname) {
                    setErrors((prev) => ({ ...prev, surname: undefined }));
                  }
                }}
                aria-invalid={!!errors.surname}
                aria-describedby={
                  errors.surname ? "user-surname-error" : undefined
                }
                disabled={isSubmitting || !user}
              />
              {errors.surname && (
                <p id="user-surname-error" className="text-destructive text-sm">
                  {errors.surname}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Stanowisko
              </label>
              <Input
                id="title"
                type="text"
                placeholder="np. Starszy specjalista"
                value={values.title}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setValues((prev) => ({ ...prev, title: nextValue }));
                  if (errors.title) {
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }
                }}
                aria-invalid={!!errors.title}
                aria-describedby={errors.title ? "user-title-error" : undefined}
                disabled={isSubmitting || !user}
              />
              <span className="text-xs text-gray-400">
                Uzupełnij nazwę stanowiska lub pozostaw puste.
              </span>
              {errors.title && (
                <p id="user-title-error" className="text-destructive text-sm">
                  {errors.title}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium text-gray-700">Rola</span>
              <Select
                value={values.role || undefined}
                onValueChange={(nextValue) => {
                  setValues((prev) => ({ ...prev, role: nextValue as Role }));
                  if (errors.role) {
                    setErrors((prev) => ({ ...prev, role: undefined }));
                  }
                }}
                disabled={isSubmitting || !user}
              >
                <SelectTrigger aria-invalid={!!errors.role} className="w-full">
                  <SelectValue placeholder="Wybierz rolę" />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {formatRole(option)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-xs text-gray-400">
                Zmień rolę użytkownika, aby zaktualizować jego uprawnienia.
              </span>
              {errors.role && (
                <p className="text-destructive text-sm">{errors.role}</p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <span
                id="user-date-of-birth-label"
                className="text-sm font-medium text-gray-700"
              >
                Data urodzenia
              </span>
              <Popover
                open={isDatePickerOpen}
                onOpenChange={setIsDatePickerOpen}
              >
                <PopoverTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      "w-full",
                      !selectedDate && "text-muted-foreground",
                    )}
                    aria-labelledby="user-date-of-birth-label"
                    aria-describedby={
                      errors.dateOfBirth ? "user-dob-error" : undefined
                    }
                    aria-invalid={!!errors.dateOfBirth}
                    disabled={isSubmitting || !user}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {selectedDate
                      ? format(selectedDate, "dd.MM.yyyy")
                      : "Wybierz datę"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      const nextValue = date ? format(date, "yyyy-MM-dd") : "";
                      setValues((prev) => ({
                        ...prev,
                        dateOfBirth: nextValue,
                      }));
                      if (errors.dateOfBirth) {
                        setErrors((prev) => ({
                          ...prev,
                          dateOfBirth: undefined,
                        }));
                      }
                      setIsDatePickerOpen(false);
                    }}
                    disabled={{ after: today }}
                    captionLayout="dropdown"
                    initialFocus
                  />
                  <div className="flex justify-end border-t px-3 py-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setValues((prev) => ({ ...prev, dateOfBirth: "" }));
                        if (errors.dateOfBirth) {
                          setErrors((prev) => ({
                            ...prev,
                            dateOfBirth: undefined,
                          }));
                        }
                        setIsDatePickerOpen(false);
                      }}
                    >
                      Wyczyść
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <span className="text-xs text-gray-400">
                Wybierz datę urodzenia lub użyj opcji „Wyczyść”, aby usunąć
                wartość.
              </span>
              {errors.dateOfBirth && (
                <p id="user-dob-error" className="text-destructive text-sm">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Numer telefonu
              </label>
              <Input
                id="phone"
                type="tel"
                autoComplete="tel"
                placeholder="np. +48 123 456 789"
                value={values.phone}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setValues((prev) => ({ ...prev, phone: nextValue }));
                  if (errors.phone) {
                    setErrors((prev) => ({ ...prev, phone: undefined }));
                  }
                }}
                aria-invalid={!!errors.phone}
                aria-describedby={errors.phone ? "user-phone-error" : undefined}
                disabled={isSubmitting || !user}
              />
              <span className="text-xs text-gray-400">
                Podaj pełny numer telefonu lub pozostaw puste, aby usunąć.
              </span>
              {errors.phone && (
                <p id="user-phone-error" className="text-destructive text-sm">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <span className="text-sm font-medium text-gray-700">
                Przełożony
              </span>
              <UserSelect
                value={selectedBoss}
                onChange={handleBossChange}
                disabled={isSubmitting || !user}
                error={errors.bossId}
                placeholder="Wybierz przełożonego"
                searchPlaceholder="Szukaj po nazwisku, mailu..."
                emptyOptionLabel="Brak przełożonego"
              />
              <span className="text-xs text-gray-400">
                Wybierz przełożonego z listy lub usuń, jeśli pracownik nie ma
                przełożonego.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4">
            <Button type="submit" disabled={isSubmitting || !user}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Spinner className="size-4" />
                  Zapisywanie...
                </span>
              ) : (
                "Zapisz zmiany"
              )}
            </Button>
          </div>
        </form>
      </DataStateWrapper>
    </div>
  );
}
