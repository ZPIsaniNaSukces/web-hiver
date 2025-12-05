import { LocalNavbar } from "./components/local-navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col justify-start gap-y-2 md:flex-row md:items-center md:gap-y-0">
        <h1 className="ml-4 text-2xl font-semibold md:ml-0">Wnioski</h1>
        <LocalNavbar
          hrefs={[
            { href: "/requests", label: "Dostępność" },
            { href: "/requests/general", label: "Ogólne" },
          ]}
        />
      </div>
      {children}
    </>
  );
}
