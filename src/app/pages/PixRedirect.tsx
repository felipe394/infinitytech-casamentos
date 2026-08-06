import { useEffect, useState } from "react";
import { Heart, Check, Copy, ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

export function PixRedirect() {
  const pixKey = "11945831201";
  const [copied, setCopied] = useState(false);

  const handleCopy = (showFeedback = true) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(pixKey).then(() => {
        if (showFeedback) {
          setCopied(true);
          setTimeout(() => setCopied(false), 4000);
        }
      }).catch(() => {
        // Fallback for older webview
        copyFallback(pixKey);
      });
    } else {
      copyFallback(pixKey);
    }
  };

  const copyFallback = (text: string) => {
    const input = document.createElement("input");
    input.value = text;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };

  useEffect(() => {
    // Tenta copiar automaticamente assim que a página carregar
    handleCopy(false);
  }, []);

  return (
    <div className="min-h-screen bg-rose-50/40 pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 text-center border border-rose-100 relative overflow-hidden">
        {/* Header */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Heart className="w-8 h-8 text-wedding-pink fill-wedding-pink" />
          </div>
          <h1 className="text-2xl font-serif text-gray-900">Presente via PIX</h1>
        </div>

        {/* Copy Status Badge */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 text-left flex items-start gap-3 shadow-sm">
          <div className="p-2 bg-emerald-500 text-white rounded-xl flex-shrink-0 mt-0.5">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Chave PIX Copiada!</p>
            <p className="text-sm font-semibold text-emerald-900 mt-0.5 font-mono">{pixKey}</p>
            <p className="text-xs text-emerald-700 mt-1">
              Basta colar a chave no campo <strong>PIX Copia e Cola</strong> ou <strong>Chave Telefone</strong> no seu banco.
            </p>
          </div>
        </div>

        {/* Action Button: Copy Manual */}
        <button
          onClick={() => handleCopy(true)}
          className="w-full py-3.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-wedding-pink font-bold rounded-2xl transition-all flex items-center justify-center gap-2 mb-6 active:scale-98"
        >
          {copied ? (
            <>
              <Check className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-700">Chave copiada com sucesso!</span>
            </>
          ) : (
            <>
              <Copy className="w-5 h-5" />
              <span>Copiar Chave PIX Novamente</span>
            </>
          )}
        </button>

        {/* Instruction */}
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl p-3.5 mb-6 text-left">
          <p>
            Abra o aplicativo do seu banco, vá até a opção <strong>PIX</strong> e cole a chave copiada no campo <strong>Pix Copia e Cola</strong> ou <strong>Chave Telefone</strong>.
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
          <Link to="/lista-presentes" className="flex items-center gap-1 hover:text-wedding-pink transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Voltar ao site
          </Link>
          <div className="flex items-center gap-1 text-emerald-600 font-medium">
            <ShieldCheck className="w-4 h-4" />
            Pagamento Seguro
          </div>
        </div>
      </div>
    </div>
  );
}
