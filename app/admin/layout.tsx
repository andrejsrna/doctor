import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import AdminHeaderClient from "./components/AdminHeaderClient";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const hdrs = await headers();
  const session = await auth.api.getSession({ headers: hdrs }).catch(() => null);
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <div className="bg-black/50 backdrop-blur-sm border-b pt-32 container mx-auto border-purple-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <AdminHeaderClient name={session?.user?.name || "Admin"} />
        </div>
      </div>
      <div className="container mx-auto py-8">{children}</div>
    </div>
  );
}