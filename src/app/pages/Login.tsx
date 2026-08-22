import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Lock, User, Eye, EyeOff, Heart, AlertCircle } from "lucide-react";
import { supabase } from "../services/supabase";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("login")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

      if (data && !error) {
        sessionStorage.setItem("admin_auth", "true");
        navigate("/admin");
      } else {
        setError("E-mail ou senha incorretos. Verifique seus dados.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] pt-24 pb-12 px-3 sm:px-4 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-pink-900 w-full">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 sm:w-96 h-80 sm:h-96 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 sm:w-96 h-80 sm:h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-rose-800/20 rounded-full blur-3xl" />
        {/* Floating hearts */}
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-400/20 select-none"
            style={{
              left: `${10 + i * 18}%`,
              top: `${12 + (i % 3) * 28}%`,
              fontSize: `${18 + i * 6}px`,
            }}
            animate={{
              y: [-10, 10, -10],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          >
            ♥
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm sm:max-w-md relative mx-auto"
      >
        {/* Glass card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400" />

          <div className="p-5 sm:p-8">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-rose-900/50"
              >
                <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white" />
              </motion.div>
              <h1 className="text-xl sm:text-3xl font-serif text-white mb-1">
                Área Administrativa
              </h1>
              <p className="text-rose-200/70 text-xs sm:text-sm">
                Acesso restrito — credenciais necessárias
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
              {/* Username field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-rose-100/80 mb-1.5 sm:mb-2">
                  E-mail de login
                </label>
                <div className="relative group">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-rose-300/60 group-focus-within:text-rose-300 transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-rose-200/40 text-xs sm:text-sm outline-none focus:border-rose-400/60 focus:bg-white/15 focus:ring-2 focus:ring-rose-400/20 transition-all duration-200"
                    placeholder="Digite seu e-mail"
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-rose-100/80 mb-1.5 sm:mb-2">
                  Senha
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-rose-300/60 group-focus-within:text-rose-300 transition-colors" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-rose-200/40 text-xs sm:text-sm outline-none focus:border-rose-400/60 focus:bg-white/15 focus:ring-2 focus:ring-rose-400/20 transition-all duration-200"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rose-300/60 hover:text-rose-200 transition-colors p-0.5"
                    tabIndex={-1}
                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  >
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={showPassword ? "eye-off" : "eye"}
                        initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.7, rotate: 10 }}
                        transition={{ duration: 0.15 }}
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                        ) : (
                          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </button>
                </div>
              </div>

              {/* Forgot password link */}
              <div className="flex justify-center mt-1">
                <Link
                  to="/esqueci-senha"
                  className="text-xs sm:text-sm text-rose-300/70 hover:text-rose-200 transition-colors underline-offset-2 hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="flex items-center gap-2 px-3.5 py-2.5 bg-red-500/15 border border-red-400/30 rounded-xl text-red-300 text-xs sm:text-sm"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold rounded-xl shadow-lg shadow-rose-900/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 text-xs sm:text-base"
              >
                {isLoading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-rose-300/40 text-xs mt-5 sm:mt-6">
          Julia &amp; Felipe · {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}
