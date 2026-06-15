import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import gallery1 from "../../assets/gallery_1.jpg";
import gallery2 from "../../assets/gallery_2.jpg";
import gallery3 from "../../assets/gallery_3.jpg";
import gallery4 from "../../assets/gallery_4.jpg";
import gallery5 from "../../assets/gallery_5.jpg";
import gallery6 from "../../assets/gallery_6.jpg";
import gallery7 from "../../assets/gallery_7.jpg";
import gallery8 from "../../assets/gallery_8.jpg";
import gallery9 from "../../assets/gallery_9.jpg";
import gallery10 from "../../assets/gallery_10.jpg";
import gallery11 from "../../assets/gallery_11.jpg";
import gallery12 from "../../assets/gallery_12.jpg";

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const photos = [
    {
      id: 1,
      src: gallery1,
      alt: "Foto do casal 1",
      category: "casal",
    },
    {
      id: 2,
      src: gallery2,
      alt: "Foto do casal 2",
      category: "casal",
    },
    {
      id: 3,
      src: gallery3,
      alt: "Foto do casal 3",
      category: "casal",
    },
    {
      id: 4,
      src: gallery4,
      alt: "Foto do casal 4",
      category: "casal",
    },
    {
      id: 5,
      src: gallery5,
      alt: "Foto do casal 5",
      category: "casal",
    },
    {
      id: 6,
      src: gallery6,
      alt: "Foto do casal 6",
      category: "casal",
    },
    {
      id: 7,
      src: gallery7,
      alt: "Foto do casal 7",
      category: "casal",
    },
    {
      id: 8,
      src: gallery8,
      alt: "Foto do casal 8",
      category: "casal",
    },
    {
      id: 9,
      src: gallery9,
      alt: "Foto do casal 9",
      category: "casal",
    },
    {
      id: 10,
      src: gallery10,
      alt: "Foto do casal 10",
      category: "casal",
    },
    {
      id: 11,
      src: gallery11,
      alt: "Foto do casal 11",
      category: "casal",
    },
    {
      id: 12,
      src: gallery12,
      alt: "Foto do casal 12",
      category: "casal",
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
            src={gallery1}
            alt="Galeria"
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 50%" }}
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
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Veja um pouquinho do nosso pré-wedding 💍✨</h1>
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
              Preparamos esse momento com muito carinho para registrar o amor, a leveza e a alegria que fazem parte da nossa história. Cada foto guarda um sentimento especial e traduz em imagens tudo o que estamos vivendo.
            </p>
            <p className="text-xl text-gray-700 leading-relaxed mt-4">
              Esperamos que, ao ver essas imagens, você sinta um pouco do que vivemos juntos até aqui. 💛
            </p>
          </motion.div>
        </div>
      </section>

      {/* Photo Gallery - Masonry Grid */}
      <section className="py-20 bg-gradient-to-b from-white via-neutral-50 to-white">
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
                  className="relative overflow-hidden rounded-2xl bg-white p-3 border border-neutral-100 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.15)] cursor-pointer group transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="overflow-hidden rounded-xl">
                    <ImageWithFallback
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-auto transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-3 rounded-xl bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <Camera className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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