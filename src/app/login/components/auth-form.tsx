import { Input } from "@/components/ui/input";

const AuthForm = () => {
  return (
    <div className="flex flex-col justify-items-start gap-6">
      <h1 className="text-3xl font-semibold">Zaloguj się</h1>
      <Input placeholder="Email" />
      <Input placeholder="Hasło" type="password" />
    </div>
  );
};

export { AuthForm };
