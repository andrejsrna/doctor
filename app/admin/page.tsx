"use client";

import { signOut, useSession } from "next-auth/react";
import InstagramMessaging from "../components/InstagramMessaging";

export default function AdminPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-8">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="px-4 py-2 font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sign Out
            </button>
          </div>
          <p className="mb-8 text-lg">
            Welcome, {session?.user?.name || "Admin"}!
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="mb-4 text-xl font-semibold">
            Instagram Message Center
          </h2>
          <InstagramMessaging />
        </div>
      </div>
    </div>
  );
}
