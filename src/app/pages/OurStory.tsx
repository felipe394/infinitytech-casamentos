import { motion } from "motion/react";
import { Heart, Calendar, MapPin, Sparkles } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function OurStory() {
  const timeline = [
    {
      year: "2019",
      title: "Primeiro Encontro",
      description: "Nos conhecemos em uma festa de amigos em comum. Foi amor à primeira vista! A química foi instantânea e passamos a noite inteira conversando.",
      image: "https://images.unsplash.com/photo-1765185206392-c89961e4eff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdhZ2VtZW50JTIwcHJvcG9zYWwlMjByb21hbnRpYyUyMG1vbWVudHxlbnwxfHx8fDE3NzMzNjk5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: Sparkles,
    },
    {
      year: "2020",
      title: "Primeiro Ano Juntos",
      description: "Apesar dos desafios da pandemia, nosso amor só cresceu. Descobrimos que podíamos enfrentar qualquer coisa juntos.",
      image: "https://images.unsplash.com/photo-1749224240449-2728bac89c60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGVuZ2FnZW1lbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMzMDI2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: Heart,
    },
    {
      year: "2023",
      title: "Morando Juntos",
      description: "Demos o próximo passo na nossa relação e começamos a construir nosso lar. Cada dia é uma nova aventura ao lado da pessoa amada.",
      image: "https://images.unsplash.com/photo-1621797005674-48e0150206da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBiZWFjaCUyMHN1bnNldCUyMHJvbWFudGljfGVufDF8fHx8MTc3MzM2OTk4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: MapPin,
    },
    {
      year: "2025",
      title: "O Pedido",
      description: "Em uma viagem especial para a praia ao pôr do sol, Felipe se ajoelhou e fez a pergunta mais importante. Julia disse sim sem hesitar!",
      image: "https://images.unsplash.com/photo-1738694242379-ef21044985bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmluZ3MlMjBnb2xkJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzMzNjk5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: Calendar,
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1749224240449-2728bac89c60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGVuZ2FnZW1lbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMzMDI2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Julia e Felipe"
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
          <Heart className="w-16 h-16 mx-auto mb-6 text-wedding-pink/60" />
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Nossa História</h1>
          <p className="text-xl md:text-2xl">Uma jornada de amor, cumplicidade e sonhos</p>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
              Cada grande amor tem uma história única. A nossa começou com um olhar,
              cresceu com cada momento compartilhado, e floresceu no amor que nos une hoje.
              Convidamos você a conhecer nossa jornada até este momento especial.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gradient-to-b from-wedding-pink to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Nossa Linha do Tempo</h2>
            <p className="text-gray-600">Os momentos que marcaram nossa história de amor</p>
          </motion.div>

          <div className="space-y-20">
            {timeline.map((event, index) => (
              <motion.div
                key={event.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${
                  index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                } gap-8 items-center`}
              >
                {/* Image */}
                <div className="w-full md:w-1/2">
                  <div className="relative overflow-hidden rounded-2xl shadow-2xl group">
                    <ImageWithFallback
                      src={event.image}
                      alt={event.title}
                      className="w-full h-96 object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="w-full md:w-1/2">
                  <div className="bg-white p-8 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center">
                        <event.icon className="w-6 h-6 text-wedding-pink" />
                      </div>
                      <span className="text-3xl font-serif text-wedding-pink">{event.year}</span>
                    </div>
                    <h3 className="text-3xl mb-4">{event.title}</h3>
                    <p className="text-gray-700 text-lg leading-relaxed">{event.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif mb-4">Conheça o Casal</h2>
            <p className="text-gray-600">Um pouco sobre nós</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Ana */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <div className="relative w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1749224240449-2728bac89c60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGVuZ2FnZW1lbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMzMDI2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Ana"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-3xl font-serif mb-4">Julia Silva</h3>
              <p className="text-gray-700 leading-relaxed">
                Arquiteta apaixonada por design e arte. Adora viajar, fotografar e descobrir
                novos lugares. Conhecida por seu sorriso contagiante e coração generoso.
              </p>
            </motion.div>

            {/* João */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center"
            >
              <div className="relative w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1765185206392-c89961e4eff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdhZ2VtZW50JTIwcHJvcG9zYWwlMjByb21hbnRpYyUyMG1vbWVudHxlbnwxfHx8fDE3NzMzNjk5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="João"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-3xl font-serif mb-4">Felipe Sousa</h3>
              <p className="text-gray-700 leading-relaxed">
                Engenheiro de software que ama tecnologia e inovação. Nas horas vagas, toca
                violão e adora cozinhar. Sempre com uma piada na ponta da língua.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-20 bg-wedding-pink text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Heart className="w-12 h-12 mx-auto mb-6 text-white fill-white" />
            <blockquote className="text-2xl md:text-3xl font-serif italic mb-6">
              "Eu te amo não apenas pelo que você é, mas pelo que eu sou quando estou com você"
            </blockquote>
            <p className="opacity-80">- Roy Croft</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
