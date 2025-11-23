import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../utils/authService";
import { useAuthStore } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { motion } from "framer-motion";
import { LogIn, Sparkles, Sun, Moon } from "lucide-react";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [theme, setTheme] = useState("light");

  // Load theme from sessionStorage
  useEffect(() => {
    const savedTheme = sessionStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, []);

  // Theme toggle
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    sessionStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ⭐ EMAIL DOMAIN VALIDATION (NEW — NO OTHER CODE TOUCHED)
    if (!email.endsWith("@priaccinnovations.ai")) {
      setLoading(false);
      setError("Only @priaccinnovations.ai email is allowed.");
      toast.error("Only @priaccinnovations.ai email is allowed.");
      return;
    }

    try {
      const user = await authService.login(email, password);

      if (user && user.id) {
        sessionStorage.setItem("userId", String(user.id));

        setUser({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          empid: user.empid,
          role: user.role,
          photoUrl: user.photoUrl || "",
        });

        toast.success(`Welcome ${user.fullName || ""} `);

        if (user.role?.toLowerCase() === "admin") navigate("/admin");
        else if (user.role?.toLowerCase() === "hr") navigate("/hr");
        else navigate("/employee");
      } else {
        setError("Invalid credentials.");
        toast.error("Invalid credentials ");
      }
    } catch (err) {
      setError("Invalid credentials or backend error.");
      toast.error("Login failed  Try again");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-black dark:via-neutral-900 dark:to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* BACKGROUND GLOW SHAPES */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* LEFT GLOW */}
        <motion.div
          className={`absolute top-20 left-10 w-72 h-72 rounded-full filter blur-[100px]
            ${theme === "light" ? "bg-blue-300 opacity-40" : "bg-indigo-700 opacity-35"}
          `}
          animate={{ scale: [1, 1.2, 1], x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* RIGHT GLOW */}
        <motion.div
          className={`absolute bottom-20 right-10 w-96 h-96 rounded-full filter blur-[120px]
            ${theme === "light" ? "bg-cyan-300 opacity-40" : "bg-purple-700 opacity-30"}
          `}
          animate={{ scale: [1, 1.3, 1], x: [0, -30, 0], y: [0, -50, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* LOGIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        <motion.div
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-gray-200/50 dark:border-gray-700/50 relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {/* THEME TOGGLE - now inside the login card */}
          <button
            onClick={toggleTheme}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/70 dark:bg-gray-700 shadow-md hover:scale-105 transition"
          >
            {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
          </button>

          {/* LOGO */}
          <div className="text-center mb-8">
            <motion.div
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Sparkles className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
              MAMA
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
              Modern Attendance Management Application
            </p>
            {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Your Smart HR & Attendance Companion Powered by AI
            </p> */}
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            <Input label="Email" type="email" placeholder="Enter your email"
              value={email} onChange={(e) => setEmail(e.target.value)} required />

            <Input label="Password" type="password" placeholder="Enter your password"
              value={password} onChange={(e) => setPassword(e.target.value)} required />

            {error && (
              <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-500 text-center">{error}</motion.p>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <LogIn className="w-5 h-5" />
                  </motion.div>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Sign In
                </span>
              )}
            </Button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
