import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, MapPin, Clock, Church, Music, Utensils, Info, Navigation, X } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import wazeIcon from "../../assets/waze.png";

export function Event() {
  const [isNavModalOpen, setIsNavModalOpen] = useState(false);

  const VENUE_NAME = "La Corcelle";
  const VENUE_ADDRESS = "R. Paracambi, 41 - Água Rasa, São Paulo";
  const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_ADDRESS)}`;
  const WAZE_URL = `https://waze.com/ul?q=${encodeURIComponent(VENUE_ADDRESS)}&navigate=yes`;

  const schedule = [
    {
      time: "10:00",
      title: "Cerimônia Religiosa",
      description: "Nossa união será celebrada com muito amor no próprio espaço La Corcelle.",
      icon: Church,
      location: VENUE_NAME,
    },
    {
      time: "11:30",
      title: "Boas-vindas",
      description: "Momento de acolhida e celebração com nossos queridos convidados.",
      icon: Music,
      location: VENUE_NAME,
    },
    {
      time: "13:00",
      title: "Almoço",
      description: "Uma tarde de muita alegria, gastronomia e celebração!",
      icon: Utensils,
      location: VENUE_NAME,
    },
  ];

  const dresscode = [
    {
      title: "Traje Esporte Fino",
      description: "Homens podem escolher traje social completo ou camisa com calça social, enquanto mulheres podem apostar em vestidos midi ou longos.",
    },
    {
      title: "Cores a Evitar",
      description: "Por favor, evitem o branco 🤍 (reservado para a noiva), o rosa 🩷 e o verde 💚.",
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1772127822525-7eda37383b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwdmVudWUlMjBkZWNvcmF0aW9ufGVufDF8fHx8MTc3MzM2OTk4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Local do Evento"
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
          <Calendar className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-serif mb-4">O Evento</h1>
          <p className="text-xl md:text-2xl">Detalhes da nossa celebração</p>
        </motion.div>
      </section>

      {/* Main Info Card */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-gradient-to-br from-wedding-pink to-wedding-pink text-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-serif mb-6">08 de Novembro de 2026</h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-6 text-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  <span>10:00</span>
                </div>
                <div className="hidden md:block w-2 h-2 bg-white rounded-full"></div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  <span>São Paulo, SP</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center max-w-lg w-full">
                <MapPin className="w-12 h-12 mb-4 mx-auto" />
                <h3 className="text-3xl mb-3">{VENUE_NAME}</h3>
                <p className="text-xl mb-6 opacity-90 leading-relaxed">
                  {VENUE_ADDRESS}
                </p>
                <button
                  onClick={() => setIsNavModalOpen(true)}
                  className="inline-flex items-center gap-2 px-10 py-5 bg-white text-wedding-pink rounded-2xl font-bold shadow-xl hover:bg-rose-50 transition-all transform hover:scale-105 active:scale-95 text-lg"
                >
                  <Navigation className="w-6 h-6" />
                  Como Chegar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Programação do Dia</h2>
            <p className="text-gray-600">O que esperar em cada momento</p>
          </motion.div>

          <div className="space-y-8">
            {schedule.map((item, index) => (
              <motion.div
                key={item.time}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="flex flex-col md:flex-row gap-6 items-start md:items-center bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex-shrink-0 w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center">
                  <item.icon className="w-10 h-10 text-wedding-pink" />
                </div>

                <div className="flex-grow">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                    <span className="text-3xl font-serif text-wedding-pink">{item.time}</span>
                    <h3 className="text-2xl">{item.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-2">{item.description}</p>
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{item.location}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dress Code */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Dress Code</h2>
            <p className="text-gray-600">Sugestões de traje para nossos convidados</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dresscode.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-rose-50/50 rounded-2xl shadow-sm border border-rose-100 p-8 text-center"
              >
                <Info className="w-12 h-12 text-wedding-pink mx-auto mb-4" />
                <h3 className="text-2xl mb-3 font-serif">{item.title}</h3>
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notes */}
      <section className="py-20 bg-rose-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-3xl shadow-xl border border-rose-100 p-8 md:p-12"
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-8 text-center text-wedding-pink">Informações Importantes</h2>
            <div className="space-y-6 text-lg">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Info className="w-5 h-5 text-wedding-pink" />
                </div>
                <p className="text-gray-700">O local não oferece serviço de vallet.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Info className="w-5 h-5 text-wedding-pink" />
                </div>
                <p className="text-gray-700">Confirme sua presença até 08 de Outubro de 2026.</p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <Info className="w-5 h-5 text-wedding-pink" />
                </div>
                <p className="text-gray-700">Sua presença é nosso maior presente!</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Navigation Modal */}
      <AnimatePresence>
        {isNavModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNavModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-serif">Como chegar?</h3>
                  <button
                    onClick={() => setIsNavModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-4">
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 bg-gray-50 hover:bg-rose-50 border border-gray-100 hover:border-rose-200 rounded-2xl transition-all group"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform p-2">
                      <img src="https://www.google.com/images/branding/product/2x/maps_96dp.png" alt="Google Maps" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Google Maps</p>
                      <p className="text-sm text-gray-500 text-left">Ver no mapa ou navegar</p>
                    </div>
                  </a>

                  <a
                    href={WAZE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-5 bg-gray-50 hover:bg-rose-50 border border-gray-100 hover:border-rose-200 rounded-2xl transition-all group"
                  >
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform p-2">
                      <img src={wazeIcon} alt="Waze" className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Waze</p>
                      <p className="text-sm text-gray-500 text-left">Melhor rota em tempo real</p>
                    </div>
                  </a>
                </div>

                <p className="mt-8 text-center text-xs text-gray-400">
                  Endereço: {VENUE_ADDRESS}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
