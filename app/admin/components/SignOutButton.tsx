"use client"

import { authClient } from "@/app/lib/authClient"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { FaSignOutAlt } from "react-icons/fa"

export default function SignOutButton() {
  const router = useRouter()
  const handleSignOut = async () => {
    await authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/") } })
  }
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleSignOut}
      className="px-4 py-2 font-bold text-white bg-gradient-to-r from-red-900/80 via-red-700/80 to-red-900/80 hover:from-red-800/80 hover:via-red-600/80 hover:to-red-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-lg transition-all duration-200 flex items-center gap-2"
    >
      <FaSignOutAlt className="w-4 h-4" />
      Sign Out
    </motion.button>
  )
}


