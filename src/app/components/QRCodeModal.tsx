import { useState, useRef, useEffect } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { X, ArrowLeft, QrCode, Download, Copy, Check, Printer, ExternalLink, Heart, Sparkles, DollarSign, Wallet } from "lucide-react";
import pixQrImg from "../../assets/pix-qr.jpeg";

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl?: string;
  initialTitle?: string;
}

export function QRCodeModal({
  isOpen,
  onClose,
  initialUrl = "https://casamento.infinitytechservices.com.br",
  initialTitle = "Conheça nosso site",
}: QRCodeModalProps) {
  const [activeTab, setActiveTab] = useState<"pix" | "site">("pix");
  const [copiedSiteUrl, setCopiedSiteUrl] = useState(false);
  const [copiedPixKey, setCopiedPixKey] = useState(false);
  const [qrColor, setQrColor] = useState("#1e293b");
  const [titleText] = useState(initialTitle);
  const [targetUrl] = useState(initialUrl);
  const canvasRef = useRef<HTMLDivElement>(null);

  const pixKey = "11945831201";
  const formattedPixKey = "11 94583-1201";

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopiedSiteUrl(true);
    setTimeout(() => setCopiedSiteUrl(false), 2500);
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setCopiedPixKey(true);
    setTimeout(() => setCopiedPixKey(false), 2500);
  };

  const handleDownloadPNG = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `qrcode-casamento-julia-e-felipe.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>QR Code - Julia & Felipe</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
            body {
              font-family: 'Montserrat', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background-color: #fdf8f6;
            }
            .card {
              width: 380px;
              padding: 40px 30px;
              background: #ffffff;
              border: 2px solid #f43f5e;
              border-radius: 24px;
              text-align: center;
              box-shadow: 0 20px 40px rgba(244,63,94,0.08);
            }
            .title {
              font-family: 'Playfair Display', serif;
              font-size: 28px;
              color: #881337;
              margin: 0 0 8px 0;
            }
            .subtitle {
              font-size: 14px;
              color: #e11d48;
              font-weight: 500;
              letter-spacing: 2px;
              text-transform: uppercase;
              margin-bottom: 24px;
            }
            .qr-container {
              background: #ffffff;
              padding: 20px;
              border-radius: 16px;
              display: inline-block;
              border: 1px solid #ffe4e6;
              box-shadow: 0 4px 12px rgba(0,0,0,0.05);
            }
            .date {
              font-family: 'Playfair Display', serif;
              font-size: 16px;
              color: #9f1239;
              margin-top: 24px;
            }
            .url {
              font-size: 12px;
              color: #64748b;
              margin-top: 8px;
              word-break: break-all;
            }
            @media print {
              body { background: white; }
              .card { box-shadow: none; border-color: #e2e8f0; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1 class="title">Julia & Felipe</h1>
            <div class="subtitle">${titleText}</div>
            <div class="qr-container">
              <img src="${canvasRef.current?.querySelector("canvas")?.toDataURL()}" width="220" height="220" />
            </div>
            <div class="date">08 de Novembro de 2026</div>
            <div class="url">${targetUrl}</div>
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 500);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-md animate-fade-in overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-md sm:max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100 max-h-[92dvh] flex flex-col my-auto transition-all">
        {/* Header background decoration with Navigation/Close actions */}
        <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 p-4 sm:p-5 text-white text-center relative shrink-0">
          {/* Back setinha button (Left) */}
          <button
            onClick={onClose}
            className="absolute top-3.5 left-3.5 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors active:scale-95 shadow-sm"
            title="Voltar / Sair"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Close X button (Right) */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white flex items-center justify-center transition-colors active:scale-95 shadow-sm"
            title="Fechar"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              {activeTab === "pix" ? (
                <Wallet className="w-6 h-6 text-white" />
              ) : (
                <QrCode className="w-6 h-6 text-white" />
              )}
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-0.5">
            Julia & Felipe
          </h2>
          <p className="text-rose-100 text-xs sm:text-sm font-medium tracking-wide">
            {activeTab === "pix" ? "Contribuição via PIX" : "Acesse nosso site"}
          </p>
        </div>

        {/* Tab Switcher (PIX first, Site second) */}
        <div className="bg-gray-50/80 p-1.5 mx-4 sm:mx-6 mt-4 rounded-2xl border border-rose-100/80 flex gap-1.5 shrink-0">
          <button
            onClick={() => setActiveTab("pix")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === "pix"
              ? "bg-rose-600 text-white shadow-md"
              : "text-gray-600 hover:text-rose-600 hover:bg-white/60"
              }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>PIX</span>
          </button>

          <button
            onClick={() => setActiveTab("site")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${activeTab === "site"
              ? "bg-rose-600 text-white shadow-md"
              : "text-gray-600 hover:text-rose-600 hover:bg-white/60"
              }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code Site</span>
          </button>
        </div>

        {/* Modal Body Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar flex flex-col items-center">
          {activeTab === "pix" ? (
            /* TAB 1: PIX DIRETO */
            <div className="w-full flex flex-col items-center">
              <p className="text-gray-600 text-xs sm:text-sm text-center mb-4 leading-relaxed">
                Quer nos abençoar diretamente com um PIX? Escaneie o QR Code com o aplicativo do seu banco ou copie a chave abaixo:
              </p>

              {/* PIX QR Image */}
              <div className="p-3 bg-white rounded-2xl border-2 border-rose-100 shadow-md flex flex-col items-center max-w-[200px] sm:max-w-none">
                <img
                  src={pixQrImg}
                  alt="QR Code PIX - Julia & Felipe"
                  className="w-40 h-40 sm:w-48 sm:h-48 object-contain rounded-lg"
                />
                <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Abra o app do banco e pague</span>
                </div>
              </div>

              {/* PIX Key Box */}
              <div className="mt-4 w-full bg-gradient-to-r from-rose-50 to-pink-50 rounded-2xl p-4 border border-rose-200 text-center flex flex-col items-center shadow-sm">
                <span className="text-xs uppercase tracking-wider text-rose-700 font-bold mb-1">
                  Chave PIX (Telefone)
                </span>
                <span className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-3 tracking-tight">
                  {formattedPixKey}
                </span>

                <button
                  onClick={handleCopyPixKey}
                  className={`w-full max-w-xs flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 ${copiedPixKey
                    ? "bg-emerald-600 text-white"
                    : "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-200"
                    }`}
                >
                  {copiedPixKey ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Chave PIX Copiada! ✨</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Chave PIX</span>
                    </>
                  )}
                </button>
              </div>

              <div className="mt-3 text-center">
                <p className="text-[11px] text-gray-500">
                  <strong className="text-gray-700">Julia & Felipe</strong>
                </p>
              </div>
            </div>
          ) : (
            /* TAB 2: SITE QR CODE */
            <div className="w-full flex flex-col items-center">
              <p className="text-gray-600 text-xs sm:text-sm text-center mb-4 leading-relaxed">
                Escaneie o QR Code abaixo com a câmera do seu celular para ser direcionado ao nosso site:
              </p>

              {/* QR Code Container */}
              <div
                ref={canvasRef}
                className="relative p-3.5 sm:p-4 bg-white rounded-2xl border-2 border-rose-100 shadow-md flex flex-col items-center group hover:border-rose-300 transition-all max-w-[220px] sm:max-w-none"
              >
                <QRCodeCanvas
                  value={targetUrl}
                  size={170}
                  level="H"
                  fgColor={qrColor}
                  bgColor="#ffffff"
                  includeMargin={true}
                />
                {/* Displaying SVG secretly for vector backup */}
                <div className="hidden">
                  <QRCodeSVG
                    value={targetUrl}
                    size={170}
                    level="H"
                    fgColor={qrColor}
                    bgColor="#ffffff"
                    includeMargin={true}
                  />
                </div>

                <div className="mt-2 flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Aponte a câmera e acesse</span>
                </div>
              </div>

              {/* Target URL */}
              <div className="mt-3.5 w-full bg-rose-50/80 rounded-xl p-2.5 flex items-center justify-between border border-rose-100">
                <span className="text-xs text-gray-700 font-mono truncate mr-2">
                  {targetUrl}
                </span>
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-600 hover:text-rose-700 p-1.5 rounded-lg hover:bg-rose-100 transition-colors flex-shrink-0"
                  title="Abrir site em nova aba"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              {/* Color theme selectors */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">Cor do QR:</span>
                {[
                  { label: "Grafite", color: "#1e293b" },
                  { label: "Rosa Nobre", color: "#be123c" },
                  { label: "Dourado", color: "#b45309" },
                  { label: "Azul Marinho", color: "#1e3a8a" },
                ].map((c) => (
                  <button
                    key={c.color}
                    onClick={() => setQrColor(c.color)}
                    className={`w-5 h-5 rounded-full border-2 transition-transform ${qrColor === c.color
                      ? "scale-125 border-rose-500 shadow-sm"
                      : "border-transparent opacity-80 hover:opacity-100"
                      }`}
                    style={{ backgroundColor: c.color }}
                    title={c.label}
                  />
                ))}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full">
                <button
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium text-xs sm:text-sm transition-colors active:scale-95"
                >
                  {copiedSiteUrl ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-600 font-bold">Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-gray-600" />
                      <span>Copiar Link</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleDownloadPNG}
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-xs sm:text-sm transition-colors shadow-sm hover:shadow active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar PNG</span>
                </button>

                <button
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-medium text-xs sm:text-sm transition-colors active:scale-95"
                >
                  <Printer className="w-4 h-4" />
                  <span>Imprimir</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 sm:px-6 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 shrink-0">
          <span className="flex items-center gap-1 font-medium">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Julia & Felipe 2026
          </span>
          <button
            onClick={onClose}
            className="text-rose-600 font-semibold hover:underline"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}


