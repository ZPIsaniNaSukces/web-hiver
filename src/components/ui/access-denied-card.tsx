type AccessDeniedCardProps = {
  title?: string;
  description: string;
};

export function AccessDeniedCard({
  title = "Brak uprawnien",
  description,
}: AccessDeniedCardProps) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-rose-50/80 px-6 py-5 text-sm text-rose-900 shadow-sm">
      <p className="text-base font-semibold text-rose-900">{title}</p>
      <p className="mt-2 text-sm text-rose-800">{description}</p>
    </div>
  );
}
