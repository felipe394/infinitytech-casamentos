import { useState, useRef } from "react";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import { X, QrCode, Download, Copy, Check, Printer, ExternalLink, Heart, Sparkles } from "lucide-react";
import logo from "../../assets/logo.png";

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
  const [copied, setCopied] = useState(false);
  const [qrColor, setQrColor] = useState("#1e293b");
  const [titleText, setTitleText] = useState(initialTitle);
  const [targetUrl, setTargetUrl] = useState(initialUrl);
  const canvasRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100">
        {/* Header background decoration */}
        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            title="Fechar"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex justify-center mb-2">
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
              <QrCode className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h2 className="text-2xl font-serif font-bold text-white mb-1">
            Julia & Felipe
          </h2>
          <p className="text-rose-100 text-sm font-medium tracking-wide">
            {titleText}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 flex flex-col items-center">
          <p className="text-gray-600 text-sm text-center mb-6 leading-relaxed">
            Escaneie o QR Code abaixo com a câmera do seu celular para ser direcionado ao nosso site:
          </p>

          {/* QR Code Container */}
          <div 
            ref={canvasRef}
            className="relative p-5 bg-white rounded-2xl border-2 border-rose-100 shadow-xl flex flex-col items-center group hover:border-rose-300 transition-all"
          >
            <QRCodeCanvas
              value={targetUrl}
              size={220}
              level="H"
              fgColor={qrColor}
              bgColor="#ffffff"
              includeMargin={true}
            />
            {/* Displaying SVG secretly for vector backup */}
            <div className="hidden">
              <QRCodeSVG
                value={targetUrl}
                size={220}
                level="H"
                fgColor={qrColor}
                bgColor="#ffffff"
                includeMargin={true}
              />
            </div>
            
            <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-600 font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Aponte a câmera e acesse</span>
            </div>
          </div>

          {/* Target URL */}
          <div className="mt-4 w-full bg-rose-50/80 rounded-xl p-3 flex items-center justify-between border border-rose-100">
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
          <div className="mt-4 flex items-center gap-2">
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
                className={`w-6 h-6 rounded-full border-2 transition-transform ${
                  qrColor === c.color ? "scale-125 border-rose-500 shadow-sm" : "border-transparent opacity-80 hover:opacity-100"
                }`}
                style={{ backgroundColor: c.color }}
                title={c.label}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-medium text-sm transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span className="text-emerald-600">Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar Link</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPNG}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-medium text-sm transition-colors shadow-md hover:shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>Baixar PNG</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-medium text-sm transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Julia & Felipe 2026
          </span>
          <a
            href="https://www.infinitytechservices.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-rose-600 hover:underline transition-colors font-medium"
          >
            InfinityTech Services
          </a>
        </div>
      </div>
    </div>
  );
}
