import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Check, AlertCircle, Search, ArrowRight, User, Users, Loader2 } from "lucide-react";
import { useNavigate } from "react-router";
import { guestService, Guest } from "../services/guestService";

export function RSVP() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Guest[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null);
  const [confirmedCount, setConfirmedCount] = useState(1);
  const [guestNames, setGuestNames] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState<'confirmed' | 'declined' | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isSubmitted) {
      const timer = setTimeout(() => {
        navigate("/");
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [isSubmitted, navigate]);

  const executeSearch = async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) {
      setSearchResults([]);
      setError("");
      return;
    }

    const results = await guestService.searchGuests(trimmed);
    setSearchResults(results);
    if (results.length === 0) {
      setError("Não encontramos convite para este nome. Por favor, verifique a grafia ou tente o nome da família.");
    } else {
      setError("");
    }
  };

  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setError("");
      return;
    }

    const timer = setTimeout(() => {
      executeSearch(searchQuery);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch(searchQuery);
  };

  const handleSelect = (guest: Guest) => {
    setSelectedGuest(guest);
    const initialCount = guest.confirmedCount > 0 ? guest.confirmedCount : guest.totalGuests;
    setConfirmedCount(initialCount);

    // Initialize names
    let initialNames: string[] = [];
    if (guest.confirmedGuests && guest.confirmedGuests.length > 0) {
      initialNames = [...guest.confirmedGuests];
    } else {
      initialNames = [guest.name];
    }

    while (initialNames.length < initialCount) {
      initialNames.push("");
    }

    setGuestNames(initialNames.slice(0, initialCount));
    setFormErrors(new Array(initialCount).fill(""));
    setSearchResults([]);
    setError("");
  };

  const handleCountChange = (newCount: number) => {
    if (!selectedGuest) return;
    const clampedCount = Math.max(1, Math.min(selectedGuest.totalGuests, newCount));
    setConfirmedCount(clampedCount);

    setGuestNames(prev => {
      const updated = [...prev];
      if (clampedCount > updated.length) {
        while (updated.length < clampedCount) {
          updated.push("");
        }
      } else {
        return updated.slice(0, clampedCount);
      }
      return updated;
    });

    setFormErrors(prev => {
      const updated = [...prev];
      if (clampedCount > updated.length) {
        while (updated.length < clampedCount) {
          updated.push("");
        }
      } else {
        return updated.slice(0, clampedCount);
      }
      return updated;
    });
  };

  const handleNameChange = (index: number, value: string) => {
    setGuestNames(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });

    if (formErrors[index]) {
      setFormErrors(prev => {
        const updated = [...prev];
        updated[index] = "";
        return updated;
      });
    }
  };

  const validateNames = (): boolean => {
    const errors: string[] = [];
    let hasError = false;

    for (let i = 0; i < confirmedCount; i++) {
      const name = (guestNames[i] || "").trim();
      if (!name) {
        errors[i] = "Por favor, preencha o nome e sobrenome.";
        hasError = true;
      } else {
        const words = name.split(/\s+/).filter(Boolean);
        if (words.length < 2) {
          errors[i] = "Informe nome e sobrenome (ex: Maria Silva).";
          hasError = true;
        } else {
          errors[i] = "";
        }
      }
    }

    setFormErrors(errors);
    return !hasError;
  };

  const handleConfirm = async (status: 'confirmed' | 'declined') => {
    if (!selectedGuest || isSubmitting) return;

    if (status === 'confirmed') {
      const isValid = validateNames();
      if (!isValid) return;
    }

    setIsSubmitting(true);
    try {
      const finalNames = status === 'confirmed'
        ? guestNames.slice(0, confirmedCount).map(n => n.trim())
        : [];

      await guestService.updateGuestStatus(
        selectedGuest.id,
        status,
        status === 'confirmed' ? confirmedCount : 0,
        finalNames
      );

      setRsvpStatus(status);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Error updating RSVP:', err);
      setError("Ocorreu um erro ao salvar sua confirmação. Por favor, tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const confirmedList = guestNames.slice(0, confirmedCount).map(n => n.trim()).filter(Boolean);

    return (
      <div className="min-h-screen pt-32 pb-20 px-4 flex items-center justify-center bg-rose-50/30">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-rose-100"
        >
          {rsvpStatus === 'confirmed' ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-serif mb-2 text-gray-900">Presença Confirmada!</h2>
              <p className="text-gray-600 mb-6">
                Ficamos imensamente felizes em saber que você celebrará conosco esse dia inesquecível.
              </p>

              {confirmedList.length > 0 && (
                <div className="bg-rose-50/60 border border-rose-100/80 rounded-2xl p-4 mb-6 text-left">
                  <p className="text-xs font-semibold text-wedding-pink uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    {confirmedList.length} pessoa{confirmedList.length > 1 ? 's confirmadas' : ' confirmada'}:
                  </p>
                  <ul className="space-y-1.5">
                    {confirmedList.map((name, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-gray-800 font-medium">
                        <span className="w-2 h-2 rounded-full bg-wedding-pink" />
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => navigate("/")}
                className="w-full py-3 bg-wedding-pink hover:bg-wedding-pink/90 text-white rounded-xl font-medium transition-all shadow-md mb-4"
              >
                Voltar para a Página Inicial
              </button>
              <Heart className="w-6 h-6 text-wedding-pink mx-auto" />
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <AlertCircle className="w-10 h-10 text-amber-600" />
              </div>
              <h2 className="text-3xl font-serif mb-3 text-gray-900">Mensagem Recebida</h2>
              <p className="text-gray-600 mb-8">
                Poxa, que pena que você não poderá ir! Agradecemos muito pelo carinho e por nos avisar.
              </p>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all mb-4"
              >
                Voltar para a Página Inicial
              </button>
              <Heart className="w-6 h-6 text-wedding-pink mx-auto" />
            </>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-rose-50/30">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <Heart className="w-12 h-12 text-wedding-pink mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-3">Confirmar Presença</h1>
          <p className="text-lg md:text-xl text-gray-600">Por favor, confirme sua presença até o dia 08 de Outubro de 2026</p>
        </div>

        {!selectedGuest ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-8 border border-gray-100"
          >
            <h2 className="text-2xl font-serif mb-6 text-center text-gray-900">Busque seu convite</h2>
            <form onSubmit={handleSearch} className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-32 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-wedding-pink transition-all text-base md:text-lg"
                placeholder="Seu nome ou nome da família..."
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bottom-2 px-6 bg-wedding-pink hover:bg-wedding-pink/90 text-white rounded-xl transition-colors font-medium shadow-sm"
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
                  className="space-y-3 pt-2"
                >
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Escolha seu convite:</p>
                  {searchResults.map((guest) => (
                    <button
                      key={guest.id}
                      onClick={() => handleSelect(guest)}
                      className="w-full flex items-center justify-between p-5 bg-gray-50 hover:bg-rose-50/70 border border-gray-100 hover:border-rose-200 rounded-2xl transition-all group text-left"
                    >
                      <div>
                        <p className="font-serif text-lg md:text-xl text-gray-900 mb-0.5 group-hover:text-wedding-pink transition-colors">{guest.name}</p>
                        <p className="text-sm text-gray-500">{guest.family} • Convite para até {guest.totalGuests} pessoa{guest.totalGuests !== 1 ? 's' : ''}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-wedding-pink transition-colors shrink-0 ml-4" />
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl mt-4">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-600" />
                <p className="text-sm">{error}</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-gray-100"
          >
            <div className="text-center mb-8">
              <span className="text-wedding-pink font-medium text-lg mb-1 block">Olá, {selectedGuest.name}!</span>
              <h2 className="text-3xl font-serif text-gray-900 mb-2">Confirmação de Presença</h2>
              {selectedGuest.family && selectedGuest.family !== selectedGuest.name && (
                <span className="inline-block bg-rose-50 text-wedding-pink text-xs px-3 py-1 rounded-full font-medium mt-1 border border-rose-100">
                  {selectedGuest.family}
                </span>
              )}
            </div>

            <div className="space-y-8">
              {/* Step 1: Count selector */}
              <div className="text-center bg-gray-50/70 p-6 rounded-2xl border border-gray-100">
                <label className="block text-gray-700 mb-3 font-medium">Quantas pessoas virão no total?</label>
                <div className="flex items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={() => handleCountChange(confirmedCount - 1)}
                    disabled={confirmedCount <= 1}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl hover:bg-white bg-white text-gray-700 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Diminuir quantidade"
                  >
                    -
                  </button>
                  <span className="text-4xl font-serif min-w-[56px] text-center text-gray-900">{confirmedCount}</span>
                  <button
                    type="button"
                    onClick={() => handleCountChange(confirmedCount + 1)}
                    disabled={confirmedCount >= selectedGuest.totalGuests}
                    className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-2xl hover:bg-white bg-white text-gray-700 shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Aumentar quantidade"
                  >
                    +
                  </button>
                </div>
                <p className="mt-3 text-xs md:text-sm text-gray-500 font-medium">
                  Limite máximo de <span className="font-bold text-gray-700">{selectedGuest.totalGuests}</span> pessoa{selectedGuest.totalGuests !== 1 ? 's' : ''} para este convite
                </p>
              </div>

              {/* Step 2: Names of Attendees */}
              <div className="bg-rose-50/40 border border-rose-100 rounded-3xl p-5 md:p-7">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-5 h-5 text-wedding-pink shrink-0" />
                  <h3 className="font-serif text-xl text-gray-900">
                    {confirmedCount > 1 ? "Nome e Sobrenome dos Convidados" : "Nome e Sobrenome do Convidado"}
                  </h3>
                </div>
                <p className="text-xs md:text-sm text-gray-600 mb-5">
                  {confirmedCount > 1
                    ? `Como você confirmou ${confirmedCount} pessoas, por favor preencha o nome e sobrenome de cada um que irá comparecer:`
                    : "Por favor, confirme seu nome e sobrenome completo para a lista de recepção:"}
                </p>

                <div className="space-y-4">
                  {Array.from({ length: confirmedCount }).map((_, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-1.5"
                    >
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                        {index === 0
                          ? (confirmedCount > 1 ? "1. Nome do Titular (Nome e Sobrenome)" : "Nome Completo (Nome e Sobrenome)")
                          : `${index + 1}. Acompanhante ${index} (Nome e Sobrenome)`}
                      </label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={guestNames[index] || ""}
                          onChange={(e) => handleNameChange(index, e.target.value)}
                          placeholder={index === 0 ? "Ex: Maria Silva Santos" : "Ex: João Silva Santos"}
                          className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl outline-none text-sm md:text-base text-gray-800 transition-all ${
                            formErrors[index]
                              ? "border-red-400 focus:ring-2 focus:ring-red-400"
                              : "border-gray-200 focus:ring-2 focus:ring-wedding-pink focus:border-wedding-pink"
                          }`}
                        />
                      </div>
                      {formErrors[index] && (
                        <p className="text-xs text-red-600 flex items-center gap-1 font-medium pl-1">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          {formErrors[index]}
                        </p>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 text-red-700 rounded-2xl">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Step 3: Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleConfirm('confirmed')}
                  className="flex-1 py-4 bg-wedding-pink hover:bg-wedding-pink/90 text-white rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Confirmando...
                    </>
                  ) : (
                    "Sim, vou comparecer!"
                  )}
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleConfirm('declined')}
                  className="flex-1 py-4 bg-white border border-gray-200 text-gray-600 rounded-2xl font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
                >
                  Não poderei ir
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedGuest(null);
                  setFormErrors([]);
                  setError("");
                }}
                className="w-full text-center text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
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