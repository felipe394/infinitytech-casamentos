import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Heart, Check, ExternalLink, Search, X, Loader2, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { PaymentBrick } from "../components/PaymentBrick";
import { messageService } from "../services/messageService";
import { normalizeText } from "../services/guestService";

// Import local assets for production compatibility
import cafeteiraImg from "../../assets/cafeteira.png";
import mixerImg from "../../assets/mixer.png";
import toalhasImg from "../../assets/jogodetoalhas.png";
import potesImg from "../../assets/jogodepotes.png";
import lixeiraImg from "../../assets/lixeira.png";
import pixQrImg from "../../assets/pix-qr.jpeg";
import pixLinkQrImg from "../../assets/pix-link-qr.png";
import mia1Img from "../../assets/Mia1.png";
import mia2Img from "../../assets/mia2.png";
import praiaImg from "../../assets/praia.png";
import dateImg from "../../assets/date.png";
import passeiosImg from "../../assets/passeios.png";
import jogoPorcelanaImg from "../../assets/jogo_porcelana.png";
import toalhasPremiumImg from "../../assets/toalhas_premium.png";
import airfryerImg from "../../assets/airfryer.png";
import corteImg from "../../assets/corte.png";
import sanduicheiraImg from "../../assets/sanduicheira.png";
import img1 from "../../assets/1.jpg";
import img2 from "../../assets/2.jpg";
import img3 from "../../assets/3.jpg";
import img4 from "../../assets/4.jpg";
import img5 from "../../assets/5.jpg";
import img6 from "../../assets/6.jpg";
import img7 from "../../assets/7.jpg";
import img8 from "../../assets/8.jpg";
import img9 from "../../assets/9.jpg";
import img10 from "../../assets/10.jpg";
import img11 from "../../assets/11.jpg";
import img12 from "../../assets/12.jpg";
import img13 from "../../assets/13.jpg";
import img14 from "../../assets/14.jpg";
import img15 from "../../assets/15.jpg";
import img16 from "../../assets/16.jpg";
import img17 from "../../assets/17.jpg";
import img18 from "../../assets/18.jpg";
import img19 from "../../assets/19.jpg";
import img20 from "../../assets/20.jpg";
import img21 from "../../assets/21.jpg";
import img22 from "../../assets/22.jpg";
import img23 from "../../assets/23.jpg";
import img24 from "../../assets/24.jpg";
import img25 from "../../assets/25.jpg";
import img26 from "../../assets/26.jpg";
import img27 from "../../assets/27.jpg";
import img28 from "../../assets/28.jpg";
import img29 from "../../assets/29.jpg";
import img30 from "../../assets/30.jpg";
import img31 from "../../assets/31.jpg";
import img32 from "../../assets/32.jpg";
import img33 from "../../assets/33.jpg";
import img34 from "../../assets/34.jpg";
import img35 from "../../assets/35.jpg";
import img36 from "../../assets/36.jpg";
import img37 from "../../assets/37.jpg";
import img38 from "../../assets/38.jpg";
import img39 from "../../assets/39.jpg";
import img40 from "../../assets/40.jpg";
import img41 from "../../assets/41.jpg";
import img42 from "../../assets/42.jpg";
import img43 from "../../assets/43.jpg";
import miaImg1 from "../../assets/Mia1.jpeg";
import miaImg2 from "../../assets/Mia2.jpeg";
import miaImg3 from "../../assets/Mia3.jpeg";
import miaImg4 from "../../assets/Mia4.jpeg";
import miaImg5 from "../../assets/Mia5.jpeg";
import miaImg6 from "../../assets/Mia6.jpeg";
import miaImg7 from "../../assets/Mia7.jpeg";
import miaImg8 from "../../assets/Mia8.jpeg";
import miaImg9 from "../../assets/Mia9.jpeg";



interface GiftItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
  imageClass?: string;
}

interface CartItem extends GiftItem {
  quantity: number;
}

export function GiftList() {
  const [selectedCategory, setSelectedCategory] = useState("todos");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGift, setSelectedGift] = useState<any>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [senderName, setSenderName] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [paymentTab, setPaymentTab] = useState<'pix' | 'card'>('pix');
  const [pixQrType, setPixQrType] = useState<'camera' | 'bank'>('camera');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const status = params.get('status');
    if (status) {
      setPaymentStatus(status);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const categories = [
    { id: "casa_decoracao", label: "Casa & Decoração" },
    { id: "cozinha", label: "Cozinha" },
    { id: "eletrodomesticos", label: "Eletrodomésticos" },
    { id: "moveis", label: "Móveis" },
    { id: "viagem", label: "Lua de Mel" },
    { id: "mia", label: "Ajude a Mia!" },
    { id: "todos", label: "Todos" },
  ];

  const gifts: GiftItem[] = [
    
    {
      id: 30,
      name: "Kit Banheiro",
      category: "casa_decoracao",
      price: 114.71,
      image: img1,
      available: true,
    },
    {
      id: 31,
      name: "Kit Toalhas Premium",
      category: "casa_decoracao",
      price: 198.91,
      image: img2,
      available: true,
    },
    {
      id: 32,
      name: "Jogo de Lençóis",
      category: "casa_decoracao",
      price: 241.00,
      image: img3,
      available: true,
    },
    {
      id: 33,
      name: "Cobre- Leito Premium",
      category: "casa_decoracao",
      price: 304.15,
      image: img4,
      available: true,
    },
    {
      id: 34,
      name: "Travesseiros",
      category: "casa_decoracao",
      price: 346.24,
      image: img5,
      available: true,
    },
    {
      id: 35,
      name: "Almofadas e Mantas",
      category: "casa_decoracao",
      price: 493.58,
      image: img6,
      available: true,
    },
    {
      id: 36,
      name: "Tapete",
      category: "casa_decoracao",
      price: 577.77,
      image: img7,
      available: true,
    },
    {
      id: 37,
      name: "Kit Mesa Posta",
      category: "casa_decoracao",
      price: 725.11,
      image: img8,
      available: true,
    },
    {
      id: 38,
      name: "Cobre Leito- Premium",
      category: "casa_decoracao",
      price: 946.12,
      image: img9,
      available: true,
    },
    {
      id: 39,
      name: "Enxoval Completo",
      category: "casa_decoracao",
      price: 1788.04,
      image: img10,
      available: true,
    },
    

    
    
    
    

    
    

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    


    { id: 40, name: "Utensílios de Silicone", category: "cozinha", price: 156.81, image: img11, available: true },
    { id: 41, name: "Conjunto de Potes Herméticos", category: "cozinha", price: 283.10, image: img12, available: true },
    { id: 42, name: "Jogo de Facas", category: "cozinha", price: 377.82, image: img13, available: true },
    { id: 43, name: "Refratários", category: "cozinha", price: 451.48, image: img14, available: true },
    { id: 44, name: "Kit Churrasco", category: "cozinha", price: 598.82, image: img15, available: true },
    { id: 45, name: "Conjunto de Taças", category: "cozinha", price: 683.01, image: img16, available: true },
    { id: 46, name: "Conjunto de Talheres", category: "cozinha", price: 819.83, image: img17, available: true },
    { id: 47, name: "Aparelho de Jantar", category: "cozinha", price: 872.45, image: img18, available: true },
    { id: 48, name: "Conjunto de Panelas Antiaderentes", category: "cozinha", price: 1356.56, image: img19, available: true },
    { id: 49, name: "Cozinha Completa", category: "cozinha", price: 2103.77, image: img20, available: true },
    { id: 50, name: "Liquidificador", category: "eletrodomesticos", price: 209.43, image: img21, available: true },
    { id: 51, name: "Chaleira Eletrica", category: "eletrodomesticos", price: 272.57, image: img22, available: true },
    { id: 52, name: "Torradeira", category: "eletrodomesticos", price: 335.72, image: img23, available: true },
    { id: 53, name: "Cafeteira", category: "eletrodomesticos", price: 514.63, image: img24, available: true },
    { id: 54, name: "Panela de Pressão Eletrica", category: "eletrodomesticos", price: 556.73, image: img25, available: true },
    { id: 55, name: "Robô Aspirador", category: "eletrodomesticos", price: 672.49, image: img26, available: true },
    { id: 56, name: "Depurador", category: "eletrodomesticos", price: 788.26, image: img27, available: true },
    { id: 57, name: "Churrasqueira Eletrica", category: "eletrodomesticos", price: 882.97, image: img28, available: true },
    { id: 58, name: "Batedeira", category: "eletrodomesticos", price: 1314.46, image: img29, available: true },
    { id: 59, name: "Televisão", category: "eletrodomesticos", price: 2103.77, image: img30, available: true },

    { id: 60, name: "Sapateira", category: "moveis", price: 377.82, image: img31, available: true },
    { id: 61, name: "Aparador", category: "moveis", price: 472.53, image: img32, available: true },
    { id: 62, name: "Penteadeira", category: "moveis", price: 609.35, image: img33, available: true },
    { id: 63, name: "Poltrona", category: "moveis", price: 725.11, image: img34, available: true },
    { id: 64, name: "Mesa de Jantar", category: "moveis", price: 1303.94, image: img35, available: true },
    { id: 65, name: "Sofá", category: "moveis", price: 1461.80, image: img36, available: true },
    { id: 66, name: "Cama", category: "moveis", price: 1766.99, image: img37, available: true },

    { id: 67, name: "Porção na Praia", category: "viagem", price: 167.33, image: img38, available: true },
    { id: 68, name: "Almoço Especial", category: "viagem", price: 272.57, image: img39, available: true },
    { id: 69, name: "Jantar Romantico", category: "viagem", price: 493.58, image: img40, available: true },
    { id: 70, name: "Passeio Diferente", category: "viagem", price: 556.73, image: img41, available: true },
    { id: 71, name: "Date Surpresa", category: "viagem", price: 714.59, image: img42, available: true },
    { id: 72, name: "Contribuição Especial", category: "viagem", price: 882.97, image: img43, available: true },

    { id: 73, name: "Taças de Luxo para tomar agua da torneira", category: "mia", price: 104.19, image: miaImg1, available: true },
    { id: 74, name: "Ração para a coitada não passar fome", category: "mia", price: 177.86, image: miaImg2, available: true },
    { id: 75, name: "Dose de Paciência para aguentar os inquilinos", category: "mia", price: 83.14, image: miaImg3, available: true },
    { id: 76, name: "Contribuição para o Home Office", category: "mia", price: 219.95, image: miaImg4, available: true, imageClass: "object-bottom" },
    { id: 77, name: "Transporte para visitar o Luke", category: "mia", price: 146.29, image: miaImg5, available: true },
    { id: 78, name: "Contribuição para a decoração de fim de ano", category: "mia", price: 125.24, image: miaImg6, available: true },
    { id: 79, name: "Cobertinha para o sono merecido", category: "mia", price: 114.71, image: miaImg7, available: true },
    { id: 80, name: "Lookinho para ir na casa da vovó", category: "mia", price: 230.48, image: miaImg8, available: true },
    { id: 81, name: "Uma noite sem os inquilinos", category: "mia", price: 251.53, image: miaImg9, available: true, imageClass: "object-top" },
  ];

  const addToCart = (gift: GiftItem) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === gift.id);
      if (existing) {
        return prev.map(item =>
          item.id === gift.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...gift, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setIsCartOpen(false);
    setSelectedGift({
      name: cart.length === 1 ? cart[0].name : `${cart.length} itens no carrinho`,
      price: cartTotal,
      items: cart
    });
  };

  const filteredGifts = gifts.filter((gift) => {
    const matchesCategory = selectedCategory === "todos" || gift.category === selectedCategory;
    const matchesSearch = normalizeText(gift.name).includes(normalizeText(searchTerm));
    return matchesCategory && matchesSearch;
  }).sort((a, b) => a.price - b.price);

  const handlePaymentSuccess = () => {
    setPaymentStatus('success');
    setSelectedGift(null);
    setCart([]);
    setTimeout(() => {
      setShowMessageModal(true);
    }, 500);
  };

  const handlePaymentFailure = () => {
    setPaymentStatus('failure');
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Floating Cart Button */}
      <AnimatePresence>
        {cart.length > 0 && !isCartOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 50 }}
            onClick={() => setIsCartOpen(true)}
            className="fixed bottom-8 right-8 z-[90] bg-wedding-pink text-white p-4 rounded-full shadow-2xl hover:bg-wedding-pink transition-all group active:scale-95"
          >
            <div className="relative">
              <ShoppingCart className="w-8 h-8" />
              <span className="absolute -top-2 -right-2 bg-white text-wedding-pink text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[120] flex flex-col"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-wedding-pink" />
                  <h3 className="text-xl font-serif">Seu Carrinho</h3>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 space-y-4">
                    <Gift className="w-16 h-16 opacity-20" />
                    <p>Seu carrinho está vazio</p>
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="text-wedding-pink font-bold hover:underline"
                    >
                      Ver presentes
                    </button>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shadow-sm flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                        <p className="text-wedding-pink font-bold mb-2">
                          R$ {item.price.toLocaleString('pt-BR')}
                        </p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-200 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 hover:bg-gray-50 text-gray-500"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 hover:bg-gray-50 text-gray-500"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-wedding-pink transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>R$ {cartTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full py-4 bg-wedding-pink hover:bg-wedding-pink disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  Encerrar Compra
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-2 text-gray-500 text-sm font-medium hover:text-wedding-pink transition-colors"
                >
                  Adicionar mais itens
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1610377507996-dcd4f0cfc125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZ2lmdCUyMHByZXNlbnQlMjBib3h8ZW58MXx8fHwxNzczMzY5OTg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Presentes"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-4 max-w-4xl"
        >
          <Gift className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Lista de Presentes</h1>
          <p className="text-xl md:text-2xl">Preparamos esta lista com muito carinho para quem deseja contribuir com o início da nossa nova jornada.</p>
        </motion.div>
      </section>

      {/* Payment Feedback */}
      <AnimatePresence>
        {paymentStatus && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`w-full py-4 text-center text-white ${paymentStatus === 'success' ? 'bg-green-500' : 'bg-wedding-pink'
              }`}
          >
            <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-2">
              {paymentStatus === 'success' ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Pagamento realizado com sucesso! Muito obrigado pelo carinho.</span>
                </>
              ) : (
                <>
                  <X className="w-5 h-5" />
                  <span>O pagamento não foi concluído. Por favor, tente novamente se desejar.</span>
                </>
              )}
              <button onClick={() => setPaymentStatus(null)} className="ml-4 p-1 hover:bg-black/10 rounded">
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-12 h-12 text-wedding-pink mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Sua presença é o melhor presente!</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Mas se você deseja nos presentear, preparamos uma lista com carinho pensando
              em começar nossa vida juntos. Você também pode contribuir através do Mercado Pago
              diretamente aqui na plataforma via PIX ou Cartão de Crédito. ❤️
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="py-12 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {/* Search */}
            <div className="mb-8 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar presente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-wedding-pink focus:border-transparent"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-6 py-3 rounded-full transition-all transform hover:scale-105 ${selectedCategory === category.id
                    ? "bg-wedding-pink text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow"
                    }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gifts Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredGifts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-500">Nenhum presente encontrado</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredGifts.map((gift, index) => (
                <motion.div
                  key={gift.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  className={`bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 ${!gift.available ? "opacity-60" : ""
                    }`}
                >
                  <div className="relative h-72">
                    <ImageWithFallback
                      src={gift.image}
                      alt={gift.name}
                      className={`w-full h-full object-cover ${gift.imageClass || ""}`}
                    />
                    {!gift.available && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <div className="text-white text-center">
                          <Check className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-lg">Já Comprado</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-8">
                    <h3 className="text-2xl font-serif mb-2 line-clamp-2 text-gray-900">{gift.name}</h3>
                    <p className="text-3xl text-wedding-pink font-medium mb-6">
                      R$ {gift.price.toLocaleString("pt-BR")}
                    </p>

                    {gift.available ? (
                      <button
                        onClick={() => addToCart(gift)}
                        className="w-full px-8 py-4 bg-wedding-pink hover:bg-wedding-pink text-white rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-3 transform active:scale-95"
                      >
                        <ShoppingCart className="w-6 h-6" />
                        Adicionar
                      </button>
                    ) : (
                      <button disabled className="w-full px-8 py-4 bg-gray-100 text-gray-400 rounded-2xl cursor-not-allowed flex items-center justify-center gap-3 font-bold">
                        <Check className="w-6 h-6" />
                        Indisponível
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* PIX Section */}
      <section className="py-20 bg-rose-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-wedding-pink text-white rounded-3xl p-8 md:p-12 text-center shadow-2xl"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Prefere nos ajudar através do PIX? 💰</h2>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <button
                onClick={() => setPixQrType('camera')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${pixQrType === 'camera'
                    ? 'bg-white text-wedding-pink shadow-md scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                📲 Câmera do Celular (Abre Bancos)
              </button>
              <button
                onClick={() => setPixQrType('bank')}
                className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${pixQrType === 'bank'
                    ? 'bg-white text-wedding-pink shadow-md scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
              >
                🏦 Leitura no App do Banco
              </button>
            </div>

            <p className="text-sm md:text-base mb-6 opacity-90 font-medium max-w-lg mx-auto">
              {pixQrType === 'camera'
                ? "Aponte a câmera do celular para o QR Code abaixo para abrir a página do PIX, copiar a chave e abrir seu aplicativo de banco!"
                : "Abra a opção PIX no aplicativo do seu banco e escaneie o QR Code abaixo."}
            </p>

            <div className="bg-white rounded-2xl p-4 w-52 h-52 mx-auto mb-8 shadow-inner flex items-center justify-center">
              <img
                src={pixQrType === 'camera' ? pixLinkQrImg : pixQrImg}
                alt="PIX QR Code"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 max-w-md mx-auto">
              <p className="text-sm mb-2 uppercase tracking-widest opacity-80">Ou copie a Chave PIX:</p>
              <p className="text-3xl font-serif mb-6 tracking-tight">11 94583-1201</p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText("11945831201");
                    alert("Chave PIX copiada!");
                  }}
                  className="w-full px-8 py-4 bg-white text-wedding-pink hover:bg-rose-50 rounded-2xl font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg"
                >
                  Copiar Chave
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gift Confirmation Modal / Payment Brick */}
      <AnimatePresence>
        {selectedGift && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isPaymentLoading && setSelectedGift(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col"
            >
              {/* Fixed Close Button */}
              {!isPaymentLoading && (
                <button
                  onClick={() => setSelectedGift(null)}
                  className="absolute top-6 right-6 z-[110] p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors shadow-sm"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              )}

              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-6 pr-12">
                  <h3 className="text-2xl font-serif text-gray-900">
                    {selectedGift.items ? 'Finalizar Presentes' : 'Finalizar Presente'}
                  </h3>
                </div>

                <div className="mb-8 pb-8 border-b border-gray-100">
                  {selectedGift.items ? (
                    <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {selectedGift.items.map((item: any) => (
                        <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl">
                          <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover shadow-sm" />
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm line-clamp-1">{item.name}</p>
                            <p className="text-wedding-pink text-xs font-bold">
                              {item.quantity}x R$ {item.price.toLocaleString('pt-BR')}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col md:flex-row gap-8">
                      <div className="w-32 h-32 flex-shrink-0 rounded-2xl overflow-hidden shadow-md">
                        <img src={selectedGift.image} alt={selectedGift.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="text-xl font-serif mb-2">{selectedGift.name}</h4>
                        <p className="text-3xl text-wedding-pink font-medium">R$ {selectedGift.price.toLocaleString('pt-BR')}</p>
                      </div>
                    </div>
                  )}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Total a pagar:</span>
                    <span className="text-3xl text-wedding-pink font-bold">R$ {selectedGift.price.toLocaleString('pt-BR')}</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">Escolha a forma de pagamento abaixo.</p>
                </div>

                {/* Payment Method Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setPaymentTab('pix')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${paymentTab === 'pix'
                      ? 'bg-wedding-pink text-white shadow-lg shadow-rose-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    PIX
                  </button>
                  <button
                    onClick={() => setPaymentTab('card')}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all ${paymentTab === 'card'
                      ? 'bg-wedding-pink text-white shadow-lg shadow-rose-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                  >
                    Cartão de Crédito
                  </button>
                </div>

                {/* PIX Tab */}
                {paymentTab === 'pix' && (
                  <div className="text-center">
                    <div className="bg-rose-50/60 border border-rose-200 rounded-2xl p-6 mb-4">
                      <div className="flex justify-center gap-2 mb-4">
                        <button
                          onClick={() => setPixQrType('camera')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${pixQrType === 'camera'
                              ? 'bg-wedding-pink text-white shadow-sm'
                              : 'bg-rose-100/60 text-wedding-pink hover:bg-rose-100'
                            }`}
                        >
                          📲 Câmera (Abre Bancos)
                        </button>
                        <button
                          onClick={() => setPixQrType('bank')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${pixQrType === 'bank'
                              ? 'bg-wedding-pink text-white shadow-sm'
                              : 'bg-rose-100/60 text-wedding-pink hover:bg-rose-100'
                            }`}
                        >
                          🏦 App do Banco
                        </button>
                      </div>

                      <p className="text-wedding-pink font-bold text-sm mb-4">
                        {pixQrType === 'camera'
                          ? "Escaneie com a câmera do celular para copiar a chave e escolher seu banco:"
                          : "Abra o aplicativo do seu banco e escaneie o QR Code para pagar via PIX:"}
                      </p>
                      <div className="bg-white rounded-2xl p-4 w-52 h-52 mx-auto mb-4 shadow-inner">
                        <img
                          src={pixQrType === 'camera' ? pixLinkQrImg : pixQrImg}
                          alt="PIX QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-sm text-wedding-pink font-medium mb-4">Ou copie o código PIX abaixo:</p>
                      <div className="bg-white border border-rose-200 rounded-xl p-3 mb-4">
                        <p className="text-xs text-gray-600 font-mono break-all select-all">11945831201</p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("11945831201");
                          alert("Chave PIX copiada!");
                        }}
                        className="w-full px-6 py-4 bg-wedding-pink hover:bg-wedding-pink/90 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all"
                      >
                        Copiar Chave PIX
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        handlePaymentSuccess();
                      }}
                      className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-all mt-2 text-sm"
                    >
                      Já fiz o PIX ✓
                    </button>
                  </div>
                )}

                {/* Card Tab (Mercado Pago) */}
                {paymentTab === 'card' && (
                  <div className="min-h-[400px]">
                    <PaymentBrick
                      amount={selectedGift.price}
                      description={selectedGift.name}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Success Message Modal */}
      <AnimatePresence>
        {showMessageModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSendingMessage && setShowMessageModal(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden p-8 text-center"
            >
              <div className="mb-6">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-10 h-10 text-wedding-pink fill-wedding-pink" />
                </div>
                <h3 className="text-3xl font-serif text-gray-900 mb-2">Muito Obrigado!</h3>
                <p className="text-gray-600">
                  Seu presente foi confirmado. Quer nos deixar uma mensagem carinhosa?
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                    De:
                  </label>
                  <input
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Ex: Manoel & Família"
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-left text-sm font-medium text-gray-700 mb-1">
                    Para o casal:
                  </label>
                  <textarea
                    value={userMessage}
                    onChange={(e) => setUserMessage(e.target.value)}
                    placeholder="Escreva aqui sua mensagem..."
                    className="w-full h-32 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  disabled={isSendingMessage}
                  onClick={() => {
                    setShowMessageModal(false);
                    setSenderName("");
                    setUserMessage("");
                  }}
                  className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-all"
                >
                  Agora não
                </button>
                <button
                  disabled={isSendingMessage || !userMessage.trim() || !senderName.trim()}
                  onClick={async () => {
                    setIsSendingMessage(true);
                    try {
                      await messageService.saveMessage(senderName, userMessage);
                      setIsSendingMessage(false);
                      setShowMessageModal(false);
                      setUserMessage("");
                      setSenderName("");
                      alert("Mensagem enviada com carinho! ❤️");
                    } catch (error) {
                      setIsSendingMessage(false);
                      alert("Ocorreu um erro ao enviar sua mensagem. Por favor, tente novamente.");
                    }
                  }}
                  className="flex-1 px-6 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2"
                >
                  {isSendingMessage ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Enviar Mensagem"
                  )}
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}