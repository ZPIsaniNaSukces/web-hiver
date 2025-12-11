import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthForm } from "@/app/login/components/auth-form";
import { renderWithProviders } from "@/test/utils";

const pushMock = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
  }),
  useSearchParams: () => ({
    get: () => null,
  }),
}));

describe("AuthForm", () => {
  it("renders login form correctly", () => {
    renderWithProviders(<AuthForm />);

    expect(
      screen.getByRole("heading", { name: /zaloguj się/i }),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/hasło/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /zaloguj się/i }),
    ).toBeInTheDocument();
  });

  it("shows validation errors for empty fields", async () => {
    renderWithProviders(<AuthForm />);

    const submitButton = screen.getByRole("button", { name: /zaloguj się/i });
    await userEvent.click(submitButton);

    expect(
      await screen.findByText(/podaj poprawny adres e-mail/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/hasło jest wymagane/i)).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    renderWithProviders(<AuthForm />);

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/hasło/i);
    const submitButton = screen.getByRole("button", { name: /zaloguj się/i });

    await userEvent.type(emailInput, "test@example.com");
    await userEvent.type(passwordInput, "password123");
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/");
    });
  });
});
