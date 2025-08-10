"use client"

import { usePathname, useRouter } from "next/navigation"
import { FaArrowLeft } from "react-icons/fa"
import SignOutButton from "@/app/admin/components/SignOutButton"

export default function AdminHeaderClient({ name }: { name: string }) {
  const pathname = usePathname()
  const router = useRouter()
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-sm text-gray-400">Welcome, {name || "Admin"}</p>
      </div>
      <div className="flex items-center gap-3">
        {pathname !== "/admin" && (
          <button
            onClick={() => router.push("/admin")}
            className="px-4 py-2 font-bold text-white bg-gradient-to-r from-purple-900/80 via-purple-700/80 to-purple-900/80 hover:from-purple-800/80 hover:via-purple-600/80 hover:to-purple-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-lg transition-all duration-200 flex items-center gap-2"
          >
            <FaArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <SignOutButton />
      </div>
    </div>
  )
}


