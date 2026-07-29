import { useEffect, useState } from "react";
import { Heart, Check, Copy, ExternalLink, ShieldCheck, ArrowLeft, Smartphone } from "lucide-react";
import { Link } from "react-router";

interface BankOption {
  name: string;
  color: string;
  textColor: string;
  scheme: string;
  fallbackScheme?: string;
}

const BANKS: BankOption[] = [
  { name: "Nubank", color: "bg-[#820AD1]", textColor: "text-white", scheme: "nubank://", fallbackScheme: "com.nu.production://" },
  { name: "Banco Inter", color: "bg-[#FF7A00]", textColor: "text-white", scheme: "bancointer://" },
  { name: "Itaú", color: "bg-[#EC7000]", textColor: "text-white", scheme: "itaucode://", fallbackScheme: "itau://" },
  { name: "Bradesco", color: "bg-[#CC092F]", textColor: "text-white", scheme: "bradesco://" },
  { name: "Santander", color: "bg-[#EC0000]", textColor: "text-white", scheme: "santander://", fallbackScheme: "santanderway://" },
  { name: "C6 Bank", color: "bg-[#181818]", textColor: "text-white", scheme: "c6bank://" },
  { name: "Banco do Brasil", color: "bg-[#FCDB00]", textColor: "text-blue-900", scheme: "bancodobrasil://", fallbackScheme: "bb://" },
  { name: "Caixa", color: "bg-[#005CA9]", textColor: "text-white", scheme: "caixa://", fallbackScheme: "caixaef://" },
  { name: "PicPay", color: "bg-[#11C76F]", textColor: "text-white", scheme: "picpay://" },
  { name: "Mercado Pago", color: "bg-[#009EE3]", textColor: "text-white", scheme: "mercadopago://" },
];

export function PixRedirect() {
  const pixKey = "11945831201";
  const [copied, setCopied] = useState(false);
  const [activeBankAlert, setActiveBankAlert] = useState<string | null>(null);

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

  const openBank = (bank: BankOption) => {
    // 1. Copia a chave no exato momento do clique (síncrono)
    handleCopy(true);

    setActiveBankAlert(bank.name);

    // 2. Aciona o esquema nativo do app sem delay de promise
    const link = document.createElement("a");
    link.href = bank.scheme;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 3. Fallback para esquema secundário se existir (ex: com.nu.production ou caixaef)
    if (bank.fallbackScheme) {
      setTimeout(() => {
        window.location.href = bank.fallbackScheme!;
      }, 400);
    }

    setTimeout(() => {
      setActiveBankAlert(null);
    }, 6000);
  };

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

        {/* Dynamic Alert Banner when Bank clicked */}
        {activeBankAlert && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-2xl p-3.5 mb-6 text-left flex items-center gap-2.5 animate-pulse">
            <Smartphone className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <p>
              Abrindo <strong>{activeBankAlert}</strong>... Se o aplicativo não abrir automaticamente, abra-o manualmente no seu celular e cole a chave copiada.
            </p>
          </div>
        )}

        {/* Bank Shortcuts Header */}
        <div className="text-left mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Toque para abrir seu Banco:</p>
        </div>

        {/* Bank Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-8">
          {BANKS.map((bank) => (
            <button
              key={bank.name}
              onClick={() => openBank(bank)}
              className={`${bank.color} ${bank.textColor} p-3 rounded-2xl font-bold text-xs flex items-center justify-between shadow-md hover:opacity-90 active:scale-95 transition-all text-left`}
            >
              <span>{bank.name}</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80" />
            </button>
          ))}
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
