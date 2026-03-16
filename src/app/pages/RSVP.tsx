import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Check, AlertCircle, Search, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";
import { guestService, Guest } from "../services/guestService";

export function RSVP() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [confirmedCount, setConfirmedCount] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<'confirmed' | 'declined' | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const results = await guestService.searchGuests(searchQuery);
    setSearchResults(results);
    if (results.length === 0) {
      setError("Não encontramos convite para este nome. Por favor, verifique a grafia ou tente o nome da família.");
    } else {
      setError("");
    }
  };

  const handleSelect = (guest: Guest) => {
    setSelectedGuest(guest);
    setConfirmedCount(guest.totalGuests);
    setSearchResults([]);
  };

  const handleConfirm = async (status: 'confirmed' | 'declined') => {
    if (!selectedGuest) return;
    await guestService.updateGuestStatus(selectedGuest.id, status, status === 'confirmed' ? confirmedCount : 0);
    setRsvpStatus(status);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-rose-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center"
        >
          {rsvpStatus === 'confirmed' ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-serif mb-4">Presença Confirmada!</h2>
              <p className="text-gray-600 mb-8">
                Ficamos muito felizes em saber que você celebrará conosco esse dia tão especial.
              </p>
              <Heart className="w-8 h-8 text-wedding-pink mx-auto" />
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-3xl font-serif mb-4">Mensagem Recebida</h2>
              <p className="text-gray-600 mb-8">
                Poxa, que pena que você não poderá ir! Agradecemos muito por nos avisar.
              </p>
              <Heart className="w-8 h-8 text-wedding-pink mx-auto" />
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-rose-50/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Heart className="w-12 h-12 text-wedding-pink mx-auto mb-4" />
          <h1 className="text-5xl font-serif text-gray-900 mb-4">Confirmar Presença</h1>
          <p className="text-xl text-gray-600">Por favor, confirme sua presença até o dia 30 de Outubro de 2026</p>
        </div>

        {!selectedGuest ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 mb-8"
          >
            <h2 className="text-2xl font-serif mb-6 text-center">Busque seu convite</h2>
            <form onSubmit={handleSearch} className="relative mb-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-32 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-wedding-pink transition-all text-lg"
                placeholder="Seu nome ou nome da família..."
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-wedding-pink hover:bg-wedding-pink text-white rounded-xl transition-colors font-medium"
              >
                Buscar
              </button>
            </form>

            <AnimatePresence>
              {searchResults.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">Escolha seu convite:</p>
                  {searchResults.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => handleSelect(guest)}
                      className="w-full flex items-center justify-between p-6 bg-gray-50 hover:bg-rose-50 border border-gray-100 rounded-2xl transition-all group"
                    >
                      <div className="text-left">
                        <p className="font-serif text-xl text-gray-900 mb-1">{guest.name}</p>
                        <p className="text-gray-500">{guest.family}</p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-gray-300 group-hover:text-wedding-pink transition-colors" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 text-amber-700 rounded-2xl">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 md:p-12"
          >
            <div className="text-center mb-8">
              <span className="text-wedding-pink font-medium mb-2 block">Olá, {selectedGuest.name}!</span>
              <h2 className="text-3xl font-serif text-gray-900">Confirmar para {selectedGuest.family}?</h2>
            </div>

            <div className="space-y-8">
              <div className="text-center">
                <label className="block text-gray-600 mb-4">Quantas pessoas virão no total?</label>
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => setConfirmedCount(Math.max(1, confirmedCount - 1))}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl hover:bg-gray-50 bg-white"
                  >
                    -
                  </button>
                  <span className="text-4xl font-serif w-12">{confirmedCount}</span>
                  <button
                    onClick={() => setConfirmedCount(Math.min(selectedGuest.totalGuests, confirmedCount + 1))}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl hover:bg-gray-50 bg-white"
                  >
                    +
                  </button>
                </div>
                <p className="mt-4 text-sm text-gray-400">Limite de {selectedGuest.totalGuests} pessoas para este convite</p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={() => handleConfirm('confirmed')}
                  className="flex-1 py-4 bg-wedding-pink hover:bg-wedding-pink text-white rounded-2xl font-medium shadow-lg transition-all transform hover:scale-[1.02]"
                >
                  Sim, vou comparecer!
                </button>
                <button
                  onClick={() => handleConfirm('declined')}
                  className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-medium hover:bg-gray-50 transition-all"
                >
                  Não poderei ir
                </button>
              </div>

              <button
                onClick={() => setSelectedGuest(null)}
                className="w-full text-center text-gray-400 hover:text-gray-600 text-sm"
              >
                ← Voltar para a busca
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}