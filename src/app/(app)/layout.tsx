import SideDock from "@/components/navigation/side-navbar/side-navbar";
import { SiteFooter } from "@/components/navigation/site-footer";
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
      <div className="flex min-h-screen flex-col md:ml-36">
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </div>
  );
}
