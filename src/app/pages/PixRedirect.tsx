import { useEffect, useState } from "react";
import { Heart, Check, Copy, ExternalLink, ShieldCheck, ArrowLeft } from "lucide-react";
import { Link } from "react-router";

interface BankOption {
  name: string;
  color: string;
  textColor: string;
  scheme: string;
  androidPkg?: string;
}

const BANKS: BankOption[] = [
  { name: "Nubank", color: "bg-[#820AD1]", textColor: "text-white", scheme: "nubank://" },
  { name: "Banco Inter", color: "bg-[#FF7A00]", textColor: "text-white", scheme: "bancinter://" },
  { name: "Itaú", color: "bg-[#EC7000]", textColor: "text-white", scheme: "itaucode://" },
  { name: "Bradesco", color: "bg-[#CC092F]", textColor: "text-white", scheme: "bradesco://" },
  { name: "Santander", color: "bg-[#EC0000]", textColor: "text-white", scheme: "santander://" },
  { name: "C6 Bank", color: "bg-[#181818]", textColor: "text-white", scheme: "c6bank://" },
  { name: "Banco do Brasil", color: "bg-[#FCDB00]", textColor: "text-blue-900", scheme: "bancodobrasil://" },
  { name: "Caixa", color: "bg-[#005CA9]", textColor: "text-white", scheme: "caixaef://" },
  { name: "PicPay", color: "bg-[#11C76F]", textColor: "text-white", scheme: "picpay://" },
  { name: "Mercado Pago", color: "bg-[#009EE3]", textColor: "text-white", scheme: "mercadopago://" },
];

export function PixRedirect() {
  const pixKey = "11945831201";
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch (err) {
      console.error("Erro ao copiar chave:", err);
    }
  };

  useEffect(() => {
    // Tenta copiar automaticamente ao abrir a página
    handleCopy();
  }, []);

  const openBank = (scheme: string) => {
    // Copia novamente por garantia antes de redirecionar
    handleCopy();
    window.location.href = scheme;
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
          <p className="text-xs text-gray-500 mt-1">Henrique & Luiza</p>
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
              Agora basta abrir o seu banco e usar a opção <strong>PIX Copia e Cola</strong> ou <strong>Chave Telefone</strong>.
            </p>
          </div>
        </div>

        {/* Action Button: Copy Manual */}
        <button
          onClick={handleCopy}
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

        {/* Bank Shortcuts Header */}
        <div className="text-left mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Toque para abrir seu Banco:</p>
        </div>

        {/* Bank Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-8">
          {BANKS.map((bank) => (
            <button
              key={bank.name}
              onClick={() => openBank(bank.scheme)}
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
