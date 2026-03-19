import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Gift, Heart, Check, ExternalLink, Search, X, Loader2, ShoppingCart, Trash2, Plus, Minus } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { PaymentBrick } from "../components/PaymentBrick";

// Import local assets for production compatibility
import cafeteiraImg from "../../assets/cafeteira.png";
import mixerImg from "../../assets/mixer.png";
import toalhasImg from "../../assets/jogodetoalhas.png";
import potesImg from "../../assets/jogodepotes.png";
import lixeiraImg from "../../assets/lixeira.png";
import pixQrImg from "../../assets/pix-qr.jpeg";
import mia1Img from "../../assets/Mia1.png";
import mia2Img from "../../assets/Mia2.png";
import praiaImg from "../../assets/praia.png";
import dateImg from "../../assets/date.png";

interface GiftItem {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
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
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [paymentTab, setPaymentTab] = useState<'pix' | 'card'>('pix');
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
    { id: "todos", label: "Todos" },
    { id: "cama", label: "Cama" },
    { id: "mesa", label: "Mesa" },
    { id: "banho", label: "Banho" },
    { id: "viagem", label: "Lua de Mel" },
  ];

  const gifts: GiftItem[] = [
    {
      id: 1,
      name: "Jogo de Panelas Premium",
      category: "mesa",
      price: 885.23,
      image: "https://images.unsplash.com/photo-1556909114-44e3e70034e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 2,
      name: "Jogo de Cama King Premium",
      category: "cama",
      price: 676.94,
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 3,
      name: "Cafeteira Espresso",
      category: "mesa",
      price: 1249.74,
      image: cafeteiraImg,
      available: true,
    },
    {
      id: 4,
      name: "Móveis Planejados",
      category: "cama",
      price: 2603.62,
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 5,
      name: "Kit de Toalhas Premium",
      category: "banho",
      price: 468.65,
      image: "https://images.unsplash.com/photo-1583845112203-29329902332e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 6,
      name: "Mixer Planetário",
      category: "mesa",
      price: 1020.62,
      image: mixerImg,
      available: true,
    },
    {
      id: 7,
      name: "Contribuição Lua de Mel - Passeios",
      category: "viagem",
      price: 2082.90,
      image: "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 8,
      name: "Jogo de Jantar Porcelana (42 peças)",
      category: "mesa",
      price: 781.09,
      image: "https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 9,
      name: "Edredom Premium King",
      category: "cama",
      price: 604.04,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 10,
      name: "Air Fryer Grande",
      category: "mesa",
      price: 708.19,
      image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 11,
      name: "Contribuição Lua de Mel - Praia",
      category: "viagem",
      price: 1562.17,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 12,
      name: "Smart TV 55\"",
      category: "cama",
      price: 1874.61,
      image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 13,
      name: "Jogo de Toalhas de Banho",
      category: "banho",
      price: 104.15,
      image: toalhasImg,
      available: true,
    },
    {
      id: 14,
      name: "Kit Xícaras de Café",
      category: "mesa",
      price: 110.39,
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 15,
      name: "Vela Aromática Premium",
      category: "banho",
      price: 124.97,
      image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 16,
      name: "Tábua de Corte Artesanal",
      category: "mesa",
      price: 156.22,
      image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 17,
      name: "Liquidificador",
      category: "mesa",
      price: 291.61,
      image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 18,
      name: "Jogo de Potes para Cozinha",
      category: "mesa",
      price: 128.09,
      image: potesImg,
      available: true,
    },
    {
      id: 19,
      name: "Lixeira para Banheiro",
      category: "banho",
      price: 115.60,
      image: lixeiraImg,
      available: true,
    },
    {
      id: 20,
      name: "Cooktop 4 Bocas",
      category: "mesa",
      price: 572.82,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 21,
      name: "Micro-ondas",
      category: "mesa",
      price: 499.91,
      image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 22,
      name: "Lua de Mel: Jantar Romântico",
      category: "viagem",
      price: 262.50,
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 23,
      name: "Lua de Mel: Almoço a Dois",
      category: "viagem",
      price: 294.00,
      image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 24,
      name: "Lua de Mel: Porçãozinha na Praia",
      category: "viagem",
      price: 187.50,
      image: praiaImg,
      available: true,
    },
    {
      id: 25,
      name: "Lua de Mel: Passeio no Mar",
      category: "viagem",
      price: 420.00,
      image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 28,
      name: "Lua de Mel: Date Surpresa",
      category: "viagem",
      price: 350.00,
      image: dateImg,
      available: true,
    },
    {
      id: 29,
      name: "Lua de Mel: Passeio na Praia",
      category: "viagem",
      price: 250.00,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80",
      available: true,
    },
    {
      id: 26,
      name: "Gata Mia: Casinha",
      category: "cama",
      price: 157.50,
      image: mia1Img,
      available: true,
    },
    {
      id: 27,
      name: "Gata Mia: Ração Premium",
      category: "mesa",
      price: 105.00,
      image: mia2Img,
      available: true,
    },

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
    const matchesSearch = gift.name.toLowerCase().includes(searchTerm.toLowerCase());
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
                  Continuar Compra
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
          className="relative z-10 text-center text-white px-4"
        >
          <Gift className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Lista de Presentes</h1>
          <p className="text-xl md:text-2xl">Escolha o presente perfeito para nós</p>
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
                      className="w-full h-full object-cover"
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
            <p className="text-lg mb-8 opacity-90">
              Escaneie o QR Code abaixo para contribuir diretamente.
            </p>

            <div className="bg-white rounded-2xl p-4 w-48 h-48 mx-auto mb-8 shadow-inner flex items-center justify-center">
              <img
                src={pixQrImg}
                alt="PIX QR Code"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback if image not found
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.parentElement!.innerHTML = '<div class="text-wedding-pink font-bold text-xs p-2">Salve o QR Code em assets/pix-qr.png</div>';
                }}
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
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200'
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
                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-4">
                      <p className="text-green-700 font-bold mb-4">Escaneie o QR Code para pagar via PIX:</p>
                      <div className="bg-white rounded-2xl p-4 w-52 h-52 mx-auto mb-4 shadow-inner">
                        <img
                          src={pixQrImg}
                          alt="PIX QR Code"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <p className="text-sm text-green-600 mb-4">Ou copie o código PIX abaixo:</p>
                      <div className="bg-white border border-green-200 rounded-xl p-3 mb-4">
                        <p className="text-xs text-gray-500 font-mono break-all select-all">11945831201</p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText("11945831201");
                          alert("Chave PIX copiada!");
                        }}
                        className="w-full px-6 py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-200 transition-all"
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

              <textarea
                value={userMessage}
                onChange={(e) => setUserMessage(e.target.value)}
                placeholder="Escreva aqui sua mensagem..."
                className="w-full h-32 p-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none resize-none mb-6 transition-all"
              />

              <div className="flex gap-3">
                <button
                  disabled={isSendingMessage}
                  onClick={() => setShowMessageModal(false)}
                  className="flex-1 px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-all"
                >
                  Agora não
                </button>
                <button
                  disabled={isSendingMessage || !userMessage.trim()}
                  onClick={() => {
                    setIsSendingMessage(true);
                    setTimeout(() => {
                      setIsSendingMessage(false);
                      setShowMessageModal(false);
                      setUserMessage("");
                      alert("Mensagem enviada com carinho! ❤️");
                    }, 1500);
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