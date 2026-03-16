import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const photos = [
    {
      id: 1,
      src: "https://images.unsplash.com/photo-1749224240449-2728bac89c60?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMGVuZ2FnZW1lbnQlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NzMzMDI2MTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Foto do casal 1",
      category: "casal",
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1765185206392-c89961e4eff6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbmdhZ2VtZW50JTIwcHJvcG9zYWwlMjByb21hbnRpYyUyMG1vbWVudHxlbnwxfHx8fDE3NzMzNjk5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Foto do casal 2",
      category: "casal",
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1621797005674-48e0150206da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBiZWFjaCUyMHN1bnNldCUyMHJvbWFudGljfGVufDF8fHx8MTc3MzM2OTk4Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Foto do casal 3",
      category: "casal",
    },
    {
      id: 4,
      src: "https://images.unsplash.com/photo-1738694242379-ef21044985bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmluZ3MlMjBnb2xkJTIwZWxlZ2FudHxlbnwxfHx8fDE3NzMzNjk5ODR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Alianças",
      category: "detalhes",
    },
    {
      id: 5,
      src: "https://images.unsplash.com/photo-1700142611715-8a023c5eb8c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZmxvd2VycyUyMGJvdXF1ZXQlMjB3aGl0ZXxlbnwxfHx8fDE3NzMzNjk5ODV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Buquê",
      category: "detalhes",
    },
    {
      id: 6,
      src: "https://images.unsplash.com/photo-1714972383570-44ddc9738355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBkYW5jaW5nJTIwd2VkZGluZyUyMHBhcnR5fGVufDF8fHx8MTc3MzM2OTk4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Dançando",
      category: "casal",
    },
    {
      id: 7,
      src: "https://images.unsplash.com/photo-1581745069539-1e60d7f965f4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2FrZSUyMGVsZWdhbnQlMjBkZWNvcmF0aW9ufGVufDF8fHx8MTc3MzM2OTk4Nnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Bolo",
      category: "detalhes",
    },
    {
      id: 8,
      src: "https://images.unsplash.com/photo-1772127822525-7eda37383b9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjB3ZWRkaW5nJTIwdmVudUUlMjBkZWNvcmF0aW9ufGVufDF8fHx8MTc3MzM2OTk4MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Decoração",
      category: "local",
    },
    {
      id: 9,
      src: "https://images.unsplash.com/photo-1769230357956-bc52ceda8c34?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwY2VyZW1vbnklMjBjaHVyY2glMjBhbHRhcnxlbnwxfHx8fDE3NzMzNjk5ODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Igreja",
      category: "local",
    },
    {
      id: 10,
      src: "https://images.unsplash.com/photo-1719223852076-6981754ebf76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwcmVjZXB0aW9uJTIwZGlubmVyJTIwdGFibGV8ZW58MXx8fHwxNzczMzAyNDg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Mesa de jantar",
      category: "local",
    },
    {
      id: 11,
      src: "https://images.unsplash.com/photo-1768900044120-650653953a6a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwd2VkZGluZyUyMGNvdXBsZSUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc3MzI1MjYxN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Celebração",
      category: "casal",
    },
    {
      id: 12,
      src: "https://images.unsplash.com/photo-1610377507996-dcd4f0cfc125?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3ZWRkaW5nJTIwZ2lmdCUyMHByZXNlbnQlMjBib3h8ZW58MXx8fHwxNzczMzY5OTg2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      alt: "Presentes",
      category: "detalhes",
    },
  ];

  const handlePrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null && selectedImage < photos.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setSelectedImage(null);
    } else if (e.key === "ArrowLeft") {
      handlePrevious();
    } else if (e.key === "ArrowRight") {
      handleNext();
    }
  };

  useEffect(() => {
    if (selectedImage !== null) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [selectedImage]);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1714972383570-44ddc9738355?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBkYW5jaW5nJTIwd2VkZGluZyUyMHBhcnR5fGVufDF8fHx8MTc3MzM2OTk4NXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Galeria"
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
          <Camera className="w-16 h-16 mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Nossa Galeria</h1>
          <p className="text-xl md:text-2xl">Momentos especiais capturados para sempre</p>
        </motion.div>
      </section>

      {/* Introduction */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl text-gray-700 leading-relaxed">
              Uma coleção de momentos especiais que marcaram nossa jornada até aqui.
              Cada foto conta uma parte da nossa história de amor.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery - Masonry Grid */}
      <section className="py-20 bg-gradient-to-b from-wedding-pink to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="break-inside-avoid"
              >
                <div
                  onClick={() => setSelectedImage(index)}
                  className="relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group"
                >
                  <ImageWithFallback
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-auto transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <Camera className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous Button */}
            {selectedImage > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Next Button */}
            {selectedImage < photos.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            )}

            {/* Image Counter */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white">
              {selectedImage + 1} / {photos.length}
            </div>

            {/* Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-7xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFallback
                src={photos[selectedImage].src}
                alt={photos[selectedImage].alt}
                className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-wedding-pink text-white rounded-3xl p-12 shadow-xl"
          >
            <Camera className="w-12 h-12 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-serif mb-6">Compartilhe Conosco</h2>
            <p className="text-lg mb-8 opacity-90">
              Tire fotos no nosso casamento e compartilhe conosco usando a hashtag
            </p>
            <div className="inline-block bg-white/20 backdrop-blur-sm rounded-full px-8 py-4 border border-white/30">
              <span className="text-2xl md:text-3xl font-serif">#Julia&Felipe2026</span>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}