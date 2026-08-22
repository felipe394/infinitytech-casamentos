import { useState } from "react";
import { Link } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-reset-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          email,
          origin: window.location.origin,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setError(json.error ?? "Falha ao enviar o e-mail. Tente novamente.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Erro de conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] pt-24 pb-12 px-3 sm:px-4 flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-rose-950 via-rose-900 to-pink-900 w-full">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 sm:w-96 h-80 sm:h-96 bg-rose-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 sm:w-96 h-80 sm:h-96 bg-pink-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-rose-800/20 rounded-full blur-3xl" />
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-rose-400/20 select-none"
            style={{ left: `${10 + i * 18}%`, top: `${12 + (i % 3) * 28}%`, fontSize: `${18 + i * 6}px` }}
            animate={{ y: [-10, 10, -10], rotate: [-5, 5, -5] }}
            transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
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
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-rose-400 via-pink-400 to-rose-400" />

          <div className="p-5 sm:p-8">
            <AnimatePresence mode="wait">
              {/* ── SUCCESS ── */}
              {success ? (
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
                    className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg"
                  >
                    <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-serif text-white mb-2">E-mail enviado!</h2>
                  <p className="text-rose-200/70 text-xs sm:text-sm leading-relaxed mb-1">
                    Verifique sua caixa de entrada em
                  </p>
                  <p className="text-white font-semibold text-xs sm:text-sm mb-4 break-all">{email}</p>
                  <p className="text-rose-200/50 text-xs mb-6 leading-relaxed">
                    Clique no botão do e-mail para redefinir sua senha.
                    <br />O link expira em <strong className="text-rose-200/70">1 hora</strong>.
                    <br />Não encontrou? Verifique o spam.
                  </p>
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-rose-300 hover:text-rose-100 transition-colors text-xs sm:text-sm font-medium"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Voltar para o login
                  </Link>
                </motion.div>
              ) : (
                /* ── FORM ── */
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-center mb-6 sm:mb-8">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2, stiffness: 200 }}
                      className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg shadow-rose-900/50"
                    >
                      <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                    </motion.div>
                    <h1 className="text-xl sm:text-3xl font-serif text-white mb-1">Recuperar Acesso</h1>
                    <p className="text-rose-200/70 text-xs sm:text-sm leading-relaxed">
                      Informe seu e-mail de login e enviaremos um link para redefinir sua senha
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-rose-100/80 mb-1.5 sm:mb-2">
                        E-mail de login
                      </label>
                      <div className="relative group">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-rose-300/60 group-focus-within:text-rose-300 transition-colors" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setError(""); }}
                          className="w-full pl-10 sm:pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-rose-200/40 text-xs sm:text-sm outline-none focus:border-rose-400/60 focus:bg-white/15 focus:ring-2 focus:ring-rose-400/20 transition-all duration-200"
                          placeholder="Digite seu e-mail"
                          autoComplete="email"
                          required
                        />
                      </div>
                    </div>

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

                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold rounded-xl shadow-lg shadow-rose-900/50 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-xs sm:text-base"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Enviando e-mail...
                        </>
                      ) : (
                        "Enviar link de recuperação"
                      )}
                    </motion.button>
                  </form>

                  <div className="mt-5 sm:mt-6 text-center">
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 text-rose-300/70 hover:text-rose-200 transition-colors text-xs sm:text-sm"
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

        <p className="text-center text-rose-300/40 text-xs mt-5 sm:mt-6">
          Julia &amp; Felipe · {new Date().getFullYear()}
        </p>
      </motion.div>
    </div>
  );
}

