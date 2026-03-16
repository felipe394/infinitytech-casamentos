import { Link } from "react-router";
import { motion } from "motion/react";
import { Calendar, MapPin, Heart, Gift, Camera, Users } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useState, useEffect } from "react";
import casalImage from "../../assets/casal.jpg";

export function Home() {
  const features = [
    {
      icon: Calendar,
      title: "O Evento",
      description: "Data, horário e local",
      link: "/evento",
      color: "rose",
    },
    {
      icon: Gift,
      title: "Lista de Presentes",
      description: "Escolha seu presente",
      link: "/lista-presentes",
      color: "purple",
    },
    {
      icon: Camera,
      title: "Galeria",
      description: "Nossas fotos especiais",
      link: "/galeria",
      color: "amber",
    },
    {
      icon: Users,
      title: "Confirmar Presença",
      description: "Nos avise se virá",
      link: "/confirmar-presenca",
      color: "green",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <ImageWithFallback
            src={casalImage}
            alt="Julia e Felipe"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 text-center text-white px-4"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="text-lg md:text-xl mb-4 tracking-wide"
          >
            Celebre conosco
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif mb-6"
          >
            Julia & Felipe
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="flex items-center justify-center gap-4 text-xl md:text-2xl mb-8"
          >
            <Heart className="w-6 h-6 text-wedding-white/60" />
            <span>08.11.2026</span>
            <Heart className="w-6 h-6 text-wedding-white/60" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="space-y-4"
          >
            <p className="text-lg md:text-xl mb-8 flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5" />
              La Corcelle, São Paulo
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/confirmar-presenca"
                className="px-8 py-4 bg-wedding-pink hover:bg-wedding-pink text-white rounded-full transition-all transform hover:scale-105 shadow-lg"
              >
                Confirmar Presença
              </Link>
              <Link
                to="/evento"
                className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white rounded-full transition-all transform hover:scale-105"
              >
                Ver Detalhes
              </Link>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2"
          >
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Contagem Regressiva</h2>
            <p className="text-gray-600">Faltam apenas alguns dias para o grande momento!</p>
          </motion.div>

          <CountdownTimer targetDate="2026-11-08T10:00:00-03:00" />
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-gradient-to-b from-rose-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Explore Nosso Site</h2>
            <p className="text-gray-600">Descubra todos os detalhes do nosso casamento</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const colorClasses: Record<string, string> = {
                rose: "bg-rose-100 text-wedding-pink",
                purple: "bg-purple-100 text-purple-600",
                amber: "bg-amber-100 text-amber-600",
                green: "bg-green-100 text-green-600",
              };
              const colorClass = colorClasses[feature.color] || "bg-gray-100 text-gray-600";
              const [bgColor, textColor] = colorClass.split(" ");

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link
                    to={feature.link}
                    className="block p-8 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 group"
                  >
                    <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-8 h-8 ${textColor}`} />
                    </div>
                    <h3 className="text-2xl mb-3">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-wedding-pink text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-12 h-12 text-white fill-white mx-auto mb-6" />
            <blockquote className="text-2xl md:text-3xl font-serif italic mb-6">
              "Melhor é serem dois do que um... O cordão de três dobras não se quebra facilmente".
            </blockquote>
            <p className="text-xl md:text-2xl"> - Eclesiastes 4:12</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const calculateTimeLeft = () => {
    const difference = new Date(targetDate).getTime() - new Date().getTime();
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: "Dias", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Minutos", value: timeLeft.minutes },
    { label: "Segundos", value: timeLeft.seconds },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {timeUnits.map((unit, index) => (
        <motion.div
          key={unit.label}
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="bg-gradient-to-br from-wedding-pink to-wedding-pink rounded-2xl p-8 text-white text-center shadow-xl"
        >
          <div className="text-5xl md:text-6xl mb-2">{unit.value}</div>
          <div className="text-sm md:text-base uppercase tracking-wider opacity-90">{unit.label}</div>
        </motion.div>
      ))}
    </div>
  );
}