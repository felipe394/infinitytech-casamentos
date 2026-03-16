import { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, Heart } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import logo from "../../assets/logo.png";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location]);

  const menuItems = [
    { path: "/", label: "Início" },
    { path: "/evento", label: "O Evento" },
    { path: "/lista-presentes", label: "Presentes" },
    { path: "/galeria", label: "Galeria" },
    { path: "/confirmar-presenca", label: "Confirmar Presença" },
    { path: "/admin", label: "Área Administrativa" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || location.pathname !== "/"
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
          }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src={logo}
                alt="Logo"
                className={`w-14 h-14 md:w-16 md:h-16 object-contain logo-img ${isScrolled || location.pathname !== "/" ? "logo-black" : "logo-white"
                  }`}
              />
              <span className={`text-2xl md:text-3xl font-serif transition-colors ${isScrolled || location.pathname !== "/" ? "text-gray-900" : "text-white"
                } group-hover:text-wedding-pink`}>
                Julia & Felipe
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`transition-colors hover:text-wedding-pink ${isScrolled || location.pathname !== "/" ? "text-gray-700" : "text-white"
                    } ${location.pathname === item.path ? "text-wedding-pink" : ""}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled || location.pathname !== "/" ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
                }`}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-4 py-4 space-y-3">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 rounded-lg transition-colors hover:bg-rose-50 ${location.pathname === item.path ? "bg-rose-50 text-wedding-pink" : "text-gray-700"
                      }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-wedding-pink text-wedding-pink-foreground py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-6 h-6 text-white fill-white" />
              <span className="text-2xl font-serif">Julia & Felipe</span>
            </div>
            <p className="opacity-90 mb-4 font-serif">08 de Novembro de 2026</p>
            <p className="opacity-80 text-sm mb-6">
              Feito com amor para celebrar nosso grande dia 🩷
            </p>
            <Link to="/login" className="opacity-60 hover:opacity-100 text-xs transition-colors underline-offset-4 hover:underline">
              Área Administrativa
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
