import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppNav } from "@/components/app/nav";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      <AppNav role={user.role} name={user.name} />
      <main className="container-page py-8">{children}</main>
    </div>
  );
}
