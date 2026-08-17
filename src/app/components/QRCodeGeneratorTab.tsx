import { useState, useRef } from "react";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import {
  QrCode,
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  ExternalLink,
  Share2,
  Image as ImageIcon,
  Palette,
  Layout,
  FileText,
  Heart,
  Smartphone
} from "lucide-react";

export function QRCodeGeneratorTab() {
  const [targetUrl, setTargetUrl] = useState("https://casamento.infinitytechservices.com.br");
  const [cardTitle, setCardTitle] = useState("Conheça Nosso Site");
  const [cardSubtitle, setCardSubtitle] = useState("Escaneie o QR Code abaixo com a câmera do seu celular para ver fotos, lista de presentes e confirmar sua presença!");
  const [qrColor, setQrColor] = useState("#1e293b");
  const [bgStyle, setBgStyle] = useState<"clean" | "romantic" | "gold" | "dark">("romantic");
  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const presets = [
    {
      label: "Home / Site Principal",
      url: "https://casamento.infinitytechservices.com.br",
      title: "Conheça Nosso Site",
      subtitle: "Escaneie o QR Code para acessar o site oficial do nosso casamento!",
    },
    {
      label: "Lista de Presentes",
      url: "https://casamento.infinitytechservices.com.br/lista-presentes",
      title: "Lista de Presentes",
      subtitle: "Acesse nossa lista virtual de presentes e ajude os noivos nesta nova jornada!",
    },
    {
      label: "Confirmar Presença (RSVP)",
      url: "https://casamento.infinitytechservices.com.br/confirmar-presenca",
      title: "Confirme Sua Presença",
      subtitle: "Por favor, confirme sua presença até o dia 10/10/2026 escaneando o QR Code.",
    },
    {
      label: "O Evento & Local",
      url: "https://casamento.infinitytechservices.com.br/evento",
      title: "Informações do Evento",
      subtitle: "Veja o endereço da cerimônia, recepção, horário e código de vestimenta.",
    },
  ];

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
      a.download = `qrcode-${cardTitle.toLowerCase().replace(/\s+/g, "-")}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleDownloadSVG = () => {
    const svgElement = canvasRef.current?.querySelector("svg");
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = `qrcode-${cardTitle.toLowerCase().replace(/\s+/g, "-")}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  const handlePrintCard = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const qrImageData = canvasRef.current?.querySelector("canvas")?.toDataURL() || "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Placa de Mesa / Convite - ${cardTitle}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');
            * { box-sizing: border-box; }
            body {
              font-family: 'Montserrat', sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
              margin: 0;
              background-color: #f8fafc;
            }
            .card {
              width: 420px;
              padding: 48px 36px;
              background: #ffffff;
              border: 3px double #f43f5e;
              border-radius: 28px;
              text-align: center;
              box-shadow: 0 25px 50px -12px rgba(244,63,94,0.15);
              position: relative;
            }
            .noivos {
              font-family: 'Playfair Display', serif;
              font-size: 32px;
              font-weight: 700;
              color: #881337;
              margin: 0 0 4px 0;
            }
            .tagline {
              font-size: 11px;
              letter-spacing: 3px;
              text-transform: uppercase;
              color: #be123c;
              font-weight: 600;
              margin-bottom: 24px;
            }
            .title {
              font-family: 'Playfair Display', serif;
              font-size: 22px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 12px;
            }
            .subtitle {
              font-size: 13px;
              color: #64748b;
              line-height: 1.5;
              margin-bottom: 28px;
            }
            .qr-wrapper {
              background: #ffffff;
              padding: 24px;
              border-radius: 20px;
              display: inline-block;
              border: 1px solid #ffe4e6;
              box-shadow: 0 10px 25px -5px rgba(0,0,0,0.08);
            }
            .footer-date {
              font-family: 'Playfair Display', serif;
              font-size: 16px;
              color: #9f1239;
              margin-top: 28px;
              font-weight: 600;
            }
            .url-text {
              font-size: 11px;
              color: #94a3b8;
              margin-top: 6px;
              font-mono: monospace;
            }
            @media print {
              body { background: white; }
              .card { box-shadow: none; border-color: #cbd5e1; page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1 class="noivos">Julia & Felipe</h1>
            <div class="tagline">08 DE NOVEMBRO DE 2026</div>
            <div class="title">${cardTitle}</div>
            <div class="subtitle">${cardSubtitle}</div>
            <div class="qr-wrapper">
              <img src="${qrImageData}" width="220" height="220" />
            </div>
            <div class="footer-date">Acesse pelo celular</div>
            <div class="url-text">${targetUrl}</div>
          </div>
          <script>
            setTimeout(() => {
              window.print();
              window.close();
            }, 600);
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const colorOptions = [
    { label: "Grafite Clássico", color: "#1e293b" },
    { label: "Rosa Elegante", color: "#be123c" },
    { label: "Dourado Nobre", color: "#b45309" },
    { label: "Azul Marinho", color: "#0f172a" },
    { label: "Vinho Real", color: "#701a75" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Banner Top */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold tracking-wider uppercase text-rose-100 border border-white/20">
            <Sparkles className="w-3.5 h-3.5" /> Divulgação & QR Codes
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">
            Gerador de QR Code do Sistema
          </h2>
          <p className="text-rose-100 text-sm max-w-xl">
            Gere QR Codes personalizados e cartões de mesa para que seus convidados escaneiem com a câmera do celular e naveguem no site do casamento.
          </p>
        </div>

        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-5 py-3 bg-white text-rose-700 hover:bg-rose-50 font-bold rounded-2xl text-sm transition-all shadow-md hover:scale-105 active:scale-95"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Link Copiado!" : "Copiar URL do Site"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Control Panel & Live Card Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls & Customization (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Preset Buttons */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-4">
            <h3 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2">
              <Layout className="w-5 h-5 text-rose-500" /> Presets Rápidos
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.url}
                  onClick={() => {
                    setTargetUrl(preset.url);
                    setCardTitle(preset.title);
                    setCardSubtitle(preset.subtitle);
                  }}
                  className={`p-3.5 text-left rounded-2xl border transition-all text-xs font-medium ${
                    targetUrl === preset.url
                      ? "border-rose-500 bg-rose-50/70 text-rose-900 shadow-sm"
                      : "border-gray-200 hover:border-rose-200 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <div className="font-bold text-sm mb-0.5">{preset.label}</div>
                  <div className="text-gray-500 truncate">{preset.url}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Settings */}
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md space-y-5">
            <h3 className="text-base font-serif font-bold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-500" /> Configurações do QR Code
            </h3>

            {/* Target URL */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Link de Destino (URL)
              </label>
              <div className="relative">
                <input
                  type="url"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm font-mono focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all pr-10"
                  placeholder="https://casamento.infinitytechservices.com.br"
                />
                <a
                  href={targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-rose-600"
                  title="Abrir URL"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Card Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Título do Cartão
              </label>
              <input
                type="text"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all font-serif"
                placeholder="Conheça Nosso Site"
              />
            </div>

            {/* Subtitle / Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                Instrução / Legenda
              </label>
              <textarea
                value={cardSubtitle}
                onChange={(e) => setCardSubtitle(e.target.value)}
                rows={2}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:bg-white focus:border-rose-500 focus:ring-2 focus:ring-rose-200 outline-none transition-all"
                placeholder="Escaneie o QR Code..."
              />
            </div>

            {/* Colors */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-rose-500" /> Cor do QR Code
              </label>
              <div className="flex flex-wrap items-center gap-3">
                {colorOptions.map((opt) => (
                  <button
                    key={opt.color}
                    onClick={() => setQrColor(opt.color)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                      qrColor === opt.color
                        ? "border-rose-500 bg-rose-50 font-bold text-rose-900 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border shadow-inner"
                      style={{ backgroundColor: opt.color }}
                    />
                    <span>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Card Background style */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
                Estilo do Cartão de Apresentação
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "romantic", label: "Romântico Rose" },
                  { id: "clean", label: "Clean Minimalista" },
                  { id: "gold", label: "Dourado Chic" },
                  { id: "dark", label: "Dark Elegante" },
                ].map((st) => (
                  <button
                    key={st.id}
                    onClick={() => setBgStyle(st.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      bgStyle === st.id
                        ? "border-rose-500 bg-rose-600 text-white shadow-md"
                        : "border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Printable Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="sticky top-28 bg-white p-6 rounded-3xl border border-gray-100 shadow-lg space-y-6 flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Smartphone className="w-4 h-4 text-rose-500" /> Pré-visualização do Cartão
              </span>
              <span className="text-xs bg-rose-100 text-rose-700 px-2.5 py-1 rounded-full font-semibold">
                Pronto para uso
              </span>
            </div>

            {/* Rendered Preview Card */}
            <div
              ref={cardRef}
              className={`w-full max-w-sm p-8 rounded-3xl border-2 transition-all duration-300 text-center shadow-xl flex flex-col items-center relative overflow-hidden ${
                bgStyle === "romantic"
                  ? "bg-gradient-to-b from-rose-50 via-white to-pink-50 border-rose-200 text-gray-800"
                  : bgStyle === "gold"
                  ? "bg-gradient-to-b from-amber-50 via-white to-yellow-50 border-amber-200 text-amber-950"
                  : bgStyle === "dark"
                  ? "bg-gray-900 border-gray-800 text-white"
                  : "bg-white border-gray-200 text-gray-800"
              }`}
            >
              <div className="flex justify-center mb-2">
                <Heart
                  className={`w-6 h-6 ${
                    bgStyle === "dark" ? "text-rose-400 fill-rose-400" : "text-rose-500 fill-rose-500"
                  }`}
                />
              </div>

              <h3 className="font-serif text-2xl font-bold tracking-tight">
                Julia & Felipe
              </h3>
              <p
                className={`text-[10px] tracking-[0.25em] font-semibold uppercase mt-1 mb-4 ${
                  bgStyle === "dark" ? "text-rose-300" : "text-rose-600"
                }`}
              >
                08 de Novembro de 2026
              </p>

              <div className="w-12 h-0.5 bg-rose-300/40 mb-4 rounded-full" />

              <h4 className="font-serif text-lg font-bold mb-2">
                {cardTitle}
              </h4>
              <p className="text-xs leading-relaxed opacity-80 mb-6 max-w-xs">
                {cardSubtitle}
              </p>

              {/* QR Code Canvas */}
              <div
                ref={canvasRef}
                className="p-4 bg-white rounded-2xl shadow-md border border-rose-100/50 flex flex-col items-center"
              >
                <QRCodeCanvas
                  value={targetUrl}
                  size={190}
                  level="H"
                  fgColor={qrColor}
                  bgColor="#ffffff"
                  includeMargin={true}
                />
                <div className="hidden">
                  <QRCodeSVG
                    value={targetUrl}
                    size={190}
                    level="H"
                    fgColor={qrColor}
                    bgColor="#ffffff"
                    includeMargin={true}
                  />
                </div>
              </div>

              <p className="text-[11px] font-mono opacity-60 mt-4 truncate max-w-full px-2">
                {targetUrl}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPNG}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-xs transition-all shadow-md hover:shadow-lg"
              >
                <Download className="w-4 h-4" />
                <span>Baixar PNG (HD)</span>
              </button>

              <button
                onClick={handleDownloadSVG}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold text-xs transition-all shadow-md hover:shadow-lg"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Baixar SVG (Vetor)</span>
              </button>

              <button
                onClick={handlePrintCard}
                className="col-span-1 sm:col-span-2 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl font-bold text-xs transition-all shadow-md"
              >
                <Printer className="w-4 h-4 text-rose-400" />
                <span>Imprimir Placa de Mesa / Convite</span>
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
