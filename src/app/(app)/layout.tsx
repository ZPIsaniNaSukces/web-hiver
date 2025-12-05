import SideDock from "@/components/navigation/side-navbar/side-navbar";
import { TopNavbar } from "@/components/navigation/top-navbar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mt-28">
      <TopNavbar />
      <SideDock />
      <main className="md:ml-36">{children}</main>
    </div>
  );
}
