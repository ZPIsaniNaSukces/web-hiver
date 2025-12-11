import SideDock from "@/components/navigation/side-navbar/side-navbar";
import { TopNavbar } from "@/components/navigation/top-navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen pt-21">
      <TopNavbar />
      <SideDock />
      <main className="mx-6 md:mr-10 md:ml-44 lg:mr-16 xl:mr-24 2xl:mr-32">
        {children}
      </main>
    </div>
  );
}
