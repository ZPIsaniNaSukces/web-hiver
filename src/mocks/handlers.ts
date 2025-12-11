import { HttpResponse, http } from "msw";

import { TaskStatus } from "@/config/enums";

export const handlers = [
  http.get("*/api/tasks/status/:status", ({ params }) => {
    const { status } = params;

    return HttpResponse.json({
      data: [
        {
          id: 1,
          title: "Test Task 1",
          description: "Description for task 1",
          status: status as TaskStatus,
          priority: "HIGH",
          dueDate: "2023-12-31",
          assignee: {
            id: 1,
            name: "John",
            surname: "Doe",
            email: "john@example.com",
          },
        },
        {
          id: 2,
          title: "Test Task 2",
          description: "Description for task 2",
          status: status as TaskStatus,
          priority: "MEDIUM",
          dueDate: "2024-01-15",
          assignee: {
            id: 2,
            name: "Jane",
            surname: "Smith",
            email: "jane@example.com",
          },
        },
      ],
      meta: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    });
  }),

  http.post("*/api/auth/session", () => {
    return HttpResponse.json({
      data: {
        user: {
          id: 1,
          email: "test@example.com",
          name: "Test",
          surname: "User",
          role: "USER",
        },
        accessToken: "fake-token",
        expires: Date.now() + 3600000,
      },
    });
  }),
];
