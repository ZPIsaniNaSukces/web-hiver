"use client";

export default function DashboardPage() {
  return (
    <div className="flex h-full flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">
        Witaj w panelu głównym aplikacji HiveR.
      </p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-card text-card-foreground rounded-xl border p-6 shadow">
          <div className="flex flex-col space-y-1.5">
            <h3 className="leading-none font-semibold tracking-tight">
              Zadania
            </h3>
            <p className="text-muted-foreground text-sm">
              Twoje aktywne zadania
            </p>
          </div>
          <div className="pt-4">
            <div className="text-2xl font-bold">0</div>
          </div>
        </div>
        <div className="bg-card text-card-foreground rounded-xl border p-6 shadow">
          <div className="flex flex-col space-y-1.5">
            <h3 className="leading-none font-semibold tracking-tight">
              Wnioski
            </h3>
            <p className="text-muted-foreground text-sm">Oczekujące wnioski</p>
          </div>
          <div className="pt-4">
            <div className="text-2xl font-bold">0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
