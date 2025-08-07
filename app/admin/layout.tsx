"use client";

import { authClient } from "@/app/lib/authClient";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FaSyringe, 
  FaSkull, 
  FaSignOutAlt, 
  FaShieldAlt,
  FaArrowLeft
} from "react-icons/fa";

const LoadingScreen = ({ message, color = "purple" }: { message: string; color?: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className={`w-12 h-12 border-2 border-${color}-500 border-t-transparent rounded-full mx-auto`}
      />
      <p className={`mt-4 text-${color}-300`}>{message}</p>
    </div>
  </div>
);

const RedirectScreen = ({ message }: { message: string }) => (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
    <p className="mt-4 text-purple-300">{message}</p>
  </div>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  useEffect(() => {
    if (isPending) return;
    const isAuthed = !!session?.user;
    if (!isAuthed) return;

    const INACTIVITY_TIMEOUT = 60 * 60 * 1000;
    const WARNING_TIMEOUT = 50 * 60 * 1000;

    const updateActivity = () => {
      setLastActivity(Date.now());
      setShowTimeoutWarning(false);
    };

    const checkInactivity = () => {
      const now = Date.now();
      const timeSinceActivity = now - lastActivity;

      if (timeSinceActivity >= INACTIVITY_TIMEOUT) {
        authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/admin/login") } });
      } else if (timeSinceActivity >= WARNING_TIMEOUT) {
        setShowTimeoutWarning(true);
      }
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach(event => document.addEventListener(event, updateActivity, true));
    const interval = setInterval(checkInactivity, 60000);

    return () => {
      events.forEach(event => document.removeEventListener(event, updateActivity, true));
      clearInterval(interval);
    };
  }, [isPending, session, lastActivity, router]);

  const handleSignOut = async () => {
    await authClient.signOut({ fetchOptions: { onSuccess: () => router.push("/") } });
  };

  if (isPending || !isClient) {
    return <LoadingScreen message="Loading Session..." />;
  }

  if (pathname === "/admin/login") {
    if (session?.user) {
      return <RedirectScreen message="Redirecting to dashboard..." />;
    }
    return <>{children}</>;
  }
  
  // For non-login pages, rely on middleware to redirect unauthenticated users

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

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black/50 backdrop-blur-sm border-b pt-32 container mx-auto border-purple-500/20 shadow-2xl"
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
                Session expires in 1 hour
              </div>
              {pathname !== "/admin" && (
                <button
                  onClick={() => router.push("/admin")}
                  className="px-4 py-2 font-bold text-white bg-gradient-to-r from-purple-900/80 via-purple-700/80 to-purple-900/80 hover:from-purple-800/80 hover:via-purple-600/80 hover:to-purple-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-lg transition-all duration-200 flex items-center gap-2"
                >
                  <FaArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
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

      <div className="container mx-auto py-8">
        {children}
      </div>
    </div>
  );
}