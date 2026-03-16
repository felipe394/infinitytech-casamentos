import { Link } from "react-router";
import { motion } from "motion/react";
import { Heart, Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <Heart className="w-24 h-24 text-rose-400 mx-auto mb-8" />
        </motion.div>
        
        <h1 className="text-8xl md:text-9xl font-serif text-rose-500 mb-4">404</h1>
        <h2 className="text-3xl md:text-4xl mb-6">Página Não Encontrada</h2>
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Ops! Parece que você se perdeu no caminho para o altar.
          Vamos te levar de volta ao início.
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-all transform hover:scale-105 shadow-lg"
        >
          <Home className="w-5 h-5" />
          Voltar ao Início
        </Link>
      </motion.div>
    </div>
  );
}
