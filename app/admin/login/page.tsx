"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/app/lib/authClient";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaSyringe, FaSkull } from "react-icons/fa";
import { Turnstile } from "@marsidev/react-turnstile";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileKey, setTurnstileKey] = useState("");
  const [isDevelopment, setIsDevelopment] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Ensure CSRF cookie is set before attempting sign-in
    fetch('/api/auth/csrf', { credentials: 'include' }).catch(() => {})

    const storedAttempts = localStorage.getItem("loginAttempts");
    const storedLockoutTime = localStorage.getItem("lockoutTime");
    
    if (storedAttempts) {
      setAttempts(parseInt(storedAttempts));
    }
    
    if (storedLockoutTime) {
      const lockout = parseInt(storedLockoutTime);
      if (Date.now() < lockout) {
        setIsLocked(true);
        setLockoutTime(lockout);
      } else {
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("lockoutTime");
      }
    }

    const siteKey = process.env.NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY || "";
    console.log("Turnstile site key:", siteKey ? "SET" : "MISSING");
    setTurnstileKey(siteKey);
    setIsDevelopment(process.env.NODE_ENV === 'development');
  }, []);

  useEffect(() => {
    if (isLocked) {
      const timer = setInterval(() => {
        const remaining = lockoutTime - Date.now();
        if (remaining <= 0) {
          setIsLocked(false);
          setAttempts(0);
          localStorage.removeItem("loginAttempts");
          localStorage.removeItem("lockoutTime");
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isLocked, lockoutTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      setError(`Account is locked. Please try again in ${getRemainingTime()}`);
      return;
    }
    
    if (attempts >= 5) {
      setIsLocked(true);
      setLockoutTime(Date.now() + 15 * 60 * 1000);
      localStorage.setItem("loginAttempts", attempts.toString());
      localStorage.setItem("lockoutTime", lockoutTime.toString());
      setError("Too many failed attempts. Account locked for 15 minutes.");
      return;
    }
    
    if (!isDevelopment && !turnstileToken) {
      setError("Please complete the security check");
      return;
    }
    
    setError("");
    setIsLoading(true);
    
    try {
      const { error } = await authClient.signIn.email({
        email: username,
        password,
        callbackURL: "/admin"
      });
      
      if (error) {
        setAttempts(prev => {
          const newAttempts = prev + 1;
          localStorage.setItem("loginAttempts", newAttempts.toString());
          return newAttempts;
        });
        setError("Invalid credentials");
      } else {
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("lockoutTime");
        router.push('/admin');
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRemainingTime = () => {
    const remaining = lockoutTime - Date.now();
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };

  const handleTurnstileError = () => {
    setTurnstileToken("");
  };

  const handleTurnstileExpire = () => {
    setTurnstileToken("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="relative bg-black/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-green-900/20 rounded-xl" />
        
        <div className="relative z-10 text-center mb-8">
          <motion.div 
            initial={{ scale: 0.8 }} 
            animate={{ scale: 1 }} 
            className="flex justify-center mb-4"
          >
            <div className="relative">
              <FaSyringe className="w-12 h-12 text-green-400" />
              <FaSkull className="w-6 h-6 text-purple-400 absolute -top-2 -right-2" />
            </div>
          </motion.div>
          
          <h1 className="text-3xl font-bold text-white mb-2">Admin Access</h1>
          <p className="text-gray-400 mb-4">Enter your credentials to access the control panel</p>
          
          {isDevelopment && (
            <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-300 text-sm">🔧 Development Mode - Turnstile disabled</p>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLocked || isLoading}
              autoComplete="username"
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter username"
            />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-purple-300 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLocked || isLoading}
              autoComplete="current-password"
              className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter password"
            />
          </motion.div>
          
          {!isDevelopment && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-medium text-blue-300 mb-2">
                Security Check
              </label>
              {turnstileKey ? (
                <Turnstile
                  siteKey={turnstileKey}
                  onSuccess={handleTurnstileSuccess}
                  onError={handleTurnstileError}
                  onExpire={handleTurnstileExpire}
                  className="w-full"
                />
              ) : (
                <div className="p-4 bg-red-900/30 border border-red-500/30 rounded-lg">
                  <p className="text-red-300 text-sm">⚠️ Turnstile site key not configured</p>
                </div>
              )}
            </motion.div>
          )}
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-900/30 border border-red-500/30 rounded-lg"
            >
              <p className="text-red-300 text-sm">{error}</p>
            </motion.div>
          )}
          
          <motion.button
            type="submit"
            disabled={isLoading || isLocked || (!isDevelopment && !turnstileToken)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gradient-to-r from-purple-900/80 via-purple-700/80 to-purple-900/80 hover:from-purple-800/80 hover:via-purple-600/80 hover:to-purple-800/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-lg font-bold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
