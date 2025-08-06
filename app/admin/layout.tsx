"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FaSyringe, 
  FaSkull, 
  FaSignOutAlt, 
  FaShieldAlt
} from "react-icons/fa";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/admin/login");
      return;
    }

    if (status === "loading") return;

    const INACTIVITY_TIMEOUT = 30 * 60 * 1000;
    const WARNING_TIMEOUT = 25 * 60 * 1000;

    const updateActivity = () => {
      setLastActivity(Date.now());
      setShowTimeoutWarning(false);
    };

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;

      if (timeSinceActivity >= INACTIVITY_TIMEOUT) {
        signOut({ callbackUrl: "/admin/login" });
      } else if (timeSinceActivity >= WARNING_TIMEOUT) {
        setShowTimeoutWarning(true);
      }
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });

    const interval = setInterval(checkInactivity, 60000);

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(interval);
    };
  }, [status, router, lastActivity]);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };



  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-2 border-purple-500 border-t-transparent rounded-full mx-auto"
          />
          <p className="mt-4 text-purple-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      {showTimeoutWarning && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 bg-yellow-900/90 border border-yellow-500/50 text-yellow-200 p-4 rounded-lg shadow-2xl z-50 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2">
            <FaShieldAlt className="w-4 h-4" />
            <p>Session will expire soon. Click anywhere to extend.</p>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-sm border-b border-purple-500/20 shadow-2xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <FaSyringe className="w-8 h-8 text-green-400" />
                <FaSkull className="w-4 h-4 text-purple-400 absolute -top-1 -right-1" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-gray-400">Welcome, {session?.user?.name || "Admin"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-400">
                Session expires in 30 minutes
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSignOut}
                className="px-4 py-2 font-bold text-white bg-gradient-to-r from-red-900/80 via-red-700/80 to-red-900/80 hover:from-red-800/80 hover:via-red-600/80 hover:to-red-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-lg transition-all duration-200 flex items-center gap-2"
              >
                <FaSignOutAlt className="w-4 h-4" />
                Sign Out
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {children}
      </div>
    </div>
  );
} 