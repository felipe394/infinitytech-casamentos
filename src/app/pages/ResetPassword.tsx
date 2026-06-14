import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Lock, Eye, EyeOff, Mail, ArrowLeft, CheckCircle, AlertCircle, ShieldCheck } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Countdown after success
  useEffect(() => {
    if (!success) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [success, navigate]);

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return null;
    if (pwd.length < 6) return { label: "Muito curta", color: "bg-red-400", pct: 25 };
    if (pwd.length < 8) return { label: "Fraca", color: "bg-orange-400", pct: 50 };
    if (pwd.length < 12 || !/[0-9]/.test(pwd)) return { label: "Boa", color: "bg-yellow-400", pct: 75 };
    return { label: "Forte 💪", color: "bg-green-400", pct: 100 };
  };

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Link de recuperação inválido. Solicite um novo.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ token, email, newPassword: password }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Não foi possível redefinir a senha. Tente novamente.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  /* Shared background */
  const Background = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-800/20 rounded-full blur-3xl" />
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-rose-400/20 select-none"
          style={{ left: `${15 + i * 15}%`, top: `${10 + (i % 3) * 30}%`, fontSize: `${20 + i * 8}px` }}
          animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
          transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );

  /* ── NO TOKEN ── */
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-pink-900 px-4 py-12">
        <Background />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400" />
            <div className="p-8 sm:p-10 text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-300" />
              </div>
              <h2 className="text-xl font-serif text-white mb-2">Link inválido</h2>
              <p className="text-rose-200/60 text-sm mb-6">
                Este link de recuperação é inválido ou está incompleto. Solicite um novo.
              </p>
              <Link
                to="/esqueci-senha"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium rounded-xl text-sm"
              >
                Solicitar novo link
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-pink-900 px-4 py-12">
      <Background />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative"
      >
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400" />

          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">

              {/* ── SUCCESS ── */}
              {success && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <CheckCircle className="w-10 h-10 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-serif text-white mb-2">Senha redefinida! 🎉</h2>
                  <p className="text-rose-200/70 text-sm mb-6 leading-relaxed">
                    Sua senha foi atualizada com sucesso.
                    <br />Redirecionando para o login em <strong className="text-white">{countdown}s</strong>...
                  </p>
                  {/* Progress bar */}
                  <div className="w-full bg-white/10 rounded-full h-1.5 mb-6 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full"
                      initial={{ width: "100%" }}
                      animate={{ width: "0%" }}
                      transition={{ duration: 3, ease: "linear" }}
                    />
                  </div>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-rose-300 hover:text-rose-100 transition-colors text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Ir para o login agora
                  </Link>
                </motion.div>
              )}

              {/* ── FORM ── */}
              {!success && (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Header */}
                  <div className="text-center mb-7">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                      className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-rose-900/50"
                    >
                      <ShieldCheck className="w-8 h-8 text-white" />
                    </motion.div>
                    <h1 className="text-2xl sm:text-3xl font-serif text-white mb-1">Nova Senha</h1>
                    <p className="text-rose-200/70 text-sm">
                      Preencha os campos abaixo para redefinir sua senha
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email field */}
                    <div>
                      <label className="block text-sm font-medium text-rose-100/80 mb-2">
                        E-mail de login
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300/60 group-focus-within:text-rose-300 transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError(""); }}
                          className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-rose-200/40 outline-none focus:border-rose-400/60 focus:bg-white/15 focus:ring-2 focus:ring-rose-400/20 transition-all duration-200"
                          placeholder="Digite seu e-mail"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

                    {/* New password */}
                    <div>
                      <label className="block text-sm font-medium text-rose-100/80 mb-2">
                        Nova senha
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300/60 group-focus-within:text-rose-300 transition-colors" />
                        <input
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setError(""); }}
                          className="w-full pl-12 pr-12 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder-rose-200/40 outline-none focus:border-rose-400/60 focus:bg-white/15 focus:ring-2 focus:ring-rose-400/20 transition-all duration-200"
                          placeholder="Mínimo 6 caracteres"
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          tabIndex={-1}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-300/60 hover:text-rose-200 transition-colors"
                          aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                              key={showPassword ? "off" : "on"}
                              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              exit={{ opacity: 0, scale: 0.7, rotate: 10 }}
                              transition={{ duration: 0.15 }}
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </motion.div>
                          </AnimatePresence>
                        </button>
                      </div>

                      {/* Strength bar */}
                      {strength && (
                        <div className="mt-2 space-y-1">
                          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className={`h-full rounded-full ${strength.color}`}
                              initial={{ width: "0%" }}
                              animate={{ width: `${strength.pct}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <p className="text-xs text-rose-200/50">{strength.label}</p>
                        </div>
                      )}
                    </div>

                    {/* Confirm password */}
                    <div>
                      <label className="block text-sm font-medium text-rose-100/80 mb-2">
                        Confirmar nova senha
                      </label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300/60 group-focus-within:text-rose-300 transition-colors" />
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                          className={`w-full pl-12 pr-12 py-3.5 bg-white/10 border rounded-xl text-white placeholder-rose-200/40 outline-none focus:bg-white/15 focus:ring-2 transition-all duration-200 ${confirmPassword && confirmPassword !== password
                              ? "border-red-400/50 focus:border-red-400/60 focus:ring-red-400/20"
                              : confirmPassword && confirmPassword === password
                                ? "border-green-400/50 focus:border-green-400/60 focus:ring-green-400/20"
                                : "border-white/20 focus:border-rose-400/60 focus:ring-rose-400/20"
                            }`}
                          placeholder="Repita a nova senha"
                          autoComplete="new-password"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-rose-300/60 hover:text-rose-200 transition-colors"
                          aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                          <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                              key={showConfirmPassword ? "off2" : "on2"}
                              initial={{ opacity: 0, scale: 0.7, rotate: -10 }}
                              animate={{ opacity: 1, scale: 1, rotate: 0 }}
                              exit={{ opacity: 0, scale: 0.7, rotate: 10 }}
                              transition={{ duration: 0.15 }}
                            >
                              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </motion.div>
                          </AnimatePresence>
                        </button>
                      </div>
                      {confirmPassword && confirmPassword !== password && (
                        <p className="text-xs text-red-300/80 mt-1">As senhas não coincidem</p>
                      )}
                      {confirmPassword && confirmPassword === password && (
                        <p className="text-xs text-green-300/80 mt-1">✓ Senhas conferem</p>
                      )}
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "auto" }}
                          exit={{ opacity: 0, y: -8, height: 0 }}
                          className="flex items-start gap-2.5 px-4 py-3 bg-red-500/15 border border-red-400/30 rounded-xl text-red-300 text-sm"
                        >
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-semibold rounded-xl shadow-lg shadow-rose-900/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Redefinindo senha...
                        </>
                      ) : (
                        "Redefinir senha"
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-6 text-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 text-rose-300/70 hover:text-rose-200 transition-colors text-sm"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Voltar para o login
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <p className="text-center text-rose-300/40 text-xs mt-6">
          Julia &amp; Felipe · {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}
