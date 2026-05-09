import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import AdminHeaderClient from "./components/AdminHeaderClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs }).catch(() => null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="border-b border-purple-500/20 bg-black/50 pt-4 shadow-2xl backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <AdminHeaderClient name={session?.user?.name || "Admin"} />
        </div>
      </div>
      <div className="mx-auto max-w-7xl py-8">{children}</div>
    </div>
  );
}
