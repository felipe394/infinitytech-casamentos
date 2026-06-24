import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Users, Plus, Trash2, CheckCircle, XCircle, Search, LogOut, FileUp, Pencil, CreditCard, DollarSign, TrendingUp, MessageCircle, ExternalLink, Heart } from "lucide-react";
import { guestService, Guest, normalizeText } from "../services/guestService";
import { messageService, WeddingMessage } from "../services/messageService";
import { supabase } from "../services/supabase";
import * as XLSX from "xlsx";

interface Payment {
  id: string;
  mercado_pago_id: string;
  status: string;
  amount: number;
  guest_email: string;
  gift_name: string;
  payment_method: string;
  created_at: string;
}

export function Admin() {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null);
  const [guestForm, setGuestForm] = useState({ name: "", family: "", totalGuests: 1, phone: "" });
  const [isImporting, setIsImporting] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'guests' | 'payments' | 'messages' | 'whatsapp'>('guests');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [messages, setMessages] = useState<WeddingMessage[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isQueueActive, setIsQueueActive] = useState(false);
  const [queueIndex, setQueueIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const handleTabChange = (tab: 'guests' | 'payments' | 'messages' | 'whatsapp') => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const fetchGuests = async () => {
    setIsLoading(true);
    try {
      const data = await guestService.getGuests();
      setGuests(data);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayments = async () => {
    setIsLoadingPayments(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        setPayments(data);
      }
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    try {
      const data = await messageService.getMessages();
      setMessages(data);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_auth");
    if (!isAuth) {
      navigate("/login");
      return;
    }
    fetchGuests();
    fetchPayments();
    fetchMessages();
  }, [navigate]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    await guestService.addGuest({
      ...guestForm,
      status: 'pending',
      confirmedCount: 0,
    });
    setGuestForm({ name: "", family: "", totalGuests: 1, phone: "" });
    setIsAdding(false);
    await fetchGuests();
  };

  const handleEditClick = (guest: Guest) => {
    setEditingGuest(guest);
    setGuestForm({
      name: guest.name,
      family: guest.family,
      totalGuests: guest.totalGuests,
      phone: guest.phone || ""
    });
    setIsEditing(true);
  };

  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;

    await guestService.updateGuest(editingGuest.id, {
      ...guestForm
    });
    setGuestForm({ name: "", family: "", totalGuests: 1, phone: "" });
    setEditingGuest(null);
    setIsEditing(false);
    await fetchGuests();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Deseja realmente excluir este convidado?")) {
      await guestService.deleteGuest(id);
      await fetchGuests();
    }
  };

  const handleDeleteMessage = async (id: string) => {
    if (confirm("Deseja realmente excluir esta mensagem?")) {
      await messageService.deleteMessage(id);
      await fetchMessages();
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    navigate("/login");
  };

  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        for (const row of (data as any[])) {
          const name = row.Nome || row.Name || row.nome || row.name;
          const family = row.Família || row.Familia || row.Family || row.família || row.familia || row.family || name;
          const total = parseInt(row.Total || row.Quantidade || row.Qtd || 1);

          const phone = row.Telefone || row.Phone || row.Celular || row.telefone || row.phone || row.celular || "";
          if (name) {
            await guestService.addGuest({
              name,
              family,
              totalGuests: isNaN(total) ? 1 : total,
              status: 'pending',
              confirmedCount: 0,
              phone: String(phone).replace(/\D/g, '')
            });
          }
        }

        await fetchGuests();
        alert("Lista importada com sucesso!");
      } catch (error) {
        console.error("Error importing excel:", error);
        alert("Erro ao importar planilha. Verifique se o formato está correto.");
      } finally {
        setIsImporting(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    };
    reader.readAsBinaryString(file);
  };

  const filteredGuests = guests.filter(g =>
    normalizeText(g.name).includes(normalizeText(searchQuery)) ||
    normalizeText(g.family || "").includes(normalizeText(searchQuery))
  );

  const totalPages = Math.ceil(filteredGuests.length / ITEMS_PER_PAGE);
  const paginatedGuests = filteredGuests.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const stats = {
    total: guests.reduce((acc, g) => acc + g.totalGuests, 0),
    confirmed: guests.reduce((acc, g) => acc + (g.status === 'confirmed' ? g.confirmedCount : 0), 0),
    pending: guests.reduce((acc, g) => acc + (g.status === 'pending' ? g.totalGuests : 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Sticky tab bar — sticks just below the site's 80px fixed header */}
      <div className="sticky top-20 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 relative">
          {/* Centered title */}
          <div className="text-center">
            <h1 className="text-lg sm:text-2xl font-serif text-gray-900">Painel Admin</h1>
            <p className="text-xs text-gray-400">Gerencie convidados e pagamentos</p>
          </div>
          {/* Logout button - absolute top-right */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportExcel}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>

        {/* Scrollable Tab Navigation */}
        <div className="max-w-6xl mx-auto px-4 pb-3">
          <div className="flex flex-wrap justify-center gap-2 pb-0.5">
            <button
              onClick={() => handleTabChange('guests')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap text-sm shrink-0 ${
                activeTab === 'guests'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              Convidados
            </button>
            <button
              onClick={() => handleTabChange('payments')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap text-sm shrink-0 ${
                activeTab === 'payments'
                  ? 'bg-green-500 text-white shadow-md shadow-green-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              Pagamentos
            </button>
            <button
              onClick={() => handleTabChange('messages')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap text-sm shrink-0 ${
                activeTab === 'messages'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Heart className="w-4 h-4" />
              Mensagens
            </button>
            <button
              onClick={() => handleTabChange('whatsapp')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold transition-all whitespace-nowrap text-sm shrink-0 ${
                activeTab === 'whatsapp'
                  ? 'bg-blue-500 text-white shadow-md shadow-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">

        {/* ============ GUESTS TAB ============ */}
        {activeTab === 'guests' && (
          <>
            {/* Guest Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors shadow-sm disabled:opacity-50 text-sm font-medium"
              >
                <FileUp className="w-4 h-4 text-rose-500" />
                {isImporting ? "Importando..." : "Importar Planilha"}
              </button>
              <button
                onClick={() => {
                  setGuestForm({ name: "", family: "", totalGuests: 1, phone: "" });
                  setIsAdding(true);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors shadow-lg text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Novo Convidado
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total</p>
                <p className="text-2xl font-serif text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Confirmados</p>
                <p className="text-2xl font-serif text-green-600">{stats.confirmed}</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pendentes</p>
                <p className="text-2xl font-serif text-rose-500">{stats.total - stats.confirmed}</p>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou família..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 transition-all text-sm"
                />
              </div>
            </div>

            {/* Guests Table - Desktop */}
            <div className="hidden sm:block bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Família</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Qtd</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefone</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Carregando convidados...</td></tr>
                    ) : paginatedGuests.length > 0 ? (
                      paginatedGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3 font-medium text-gray-900 text-sm">{guest.name}</td>
                          <td className="px-5 py-3 text-gray-500 text-sm">{guest.family}</td>
                          <td className="px-5 py-3 text-center text-gray-600 text-sm">{guest.totalGuests}</td>
                          <td className="px-5 py-3 text-gray-500 font-mono text-xs">{guest.phone || '-'}</td>
                          <td className="px-5 py-3">
                            <div className="flex items-center justify-center">
                              {guest.status === 'confirmed' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                  <CheckCircle className="w-3 h-3" />Confirmado ({guest.confirmedCount})
                                </span>
                              ) : guest.status === 'declined' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">
                                  <XCircle className="w-3 h-3" />Não virá
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">Pendente</span>
                              )}
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <button onClick={() => handleEditClick(guest)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors">
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleDelete(guest.id)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Nenhum convidado encontrado</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Guests Cards - Mobile */}
            <div className="sm:hidden space-y-3">
              {isLoading ? (
                <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-sm">Carregando...</div>
              ) : paginatedGuests.length > 0 ? (
                paginatedGuests.map((guest) => (
                  <div key={guest.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900">{guest.name}</p>
                        <p className="text-xs text-gray-400">{guest.family} · {guest.totalGuests} pessoa{guest.totalGuests !== 1 ? 's' : ''}</p>
                        {guest.phone && <p className="text-xs text-gray-400 font-mono mt-0.5">{guest.phone}</p>}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => handleEditClick(guest)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(guest.id)} className="p-1.5 text-gray-400 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      {guest.status === 'confirmed' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />Confirmado ({guest.confirmedCount})
                        </span>
                      ) : guest.status === 'declined' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">
                          <XCircle className="w-3 h-3" />Não virá
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">Pendente</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-sm">Nenhum convidado encontrado</div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-gray-100 bg-white px-4 py-3 sm:px-6 mt-6 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-1 justify-between sm:hidden">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="relative inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Anterior
                  </button>
                  <span className="text-sm text-gray-700 flex items-center font-medium">
                    Pág. {currentPage} de {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="relative ml-3 inline-flex items-center rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Próxima
                  </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a{' '}
                      <span className="font-semibold">
                        {Math.min(currentPage * ITEMS_PER_PAGE, filteredGuests.length)}
                      </span>{' '}
                      de <span className="font-semibold">{filteredGuests.length}</span> convidados
                    </p>
                  </div>
                  <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md gap-1" aria-label="Pagination">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="relative inline-flex items-center rounded-xl px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 border border-gray-200 disabled:opacity-50 transition-colors"
                      >
                        &larr; Anterior
                      </button>
                      
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl transition-all ${
                                currentPage === page
                                  ? 'z-10 bg-rose-500 text-white shadow-md shadow-rose-200'
                                  : 'text-gray-900 border border-gray-200 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          (page === 2 && currentPage > 3) ||
                          (page === totalPages - 1 && currentPage < totalPages - 2)
                        ) {
                          return (
                            <span
                              key={page}
                              className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}

                      <button
                        disabled={currentPage === totalPages}
                        onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className="relative inline-flex items-center rounded-xl px-3 py-2 text-sm text-gray-500 hover:bg-gray-50 border border-gray-200 disabled:opacity-50 transition-colors"
                      >
                        Próxima &rarr;
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* ============ PAYMENTS TAB ============ */}
        {activeTab === 'payments' && (
          <>
            {/* Payments Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Total Arrecadado</p>
                </div>
                <p className="text-3xl font-serif text-green-600">
                  R$ {payments
                    .filter(p => p.status === 'approved')
                    .reduce((acc, p) => acc + (p.amount || 0), 0)
                    .toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Pagamentos Aprovados</p>
                </div>
                <p className="text-3xl font-serif text-blue-600">
                  {payments.filter(p => p.status === 'approved').length}
                </p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider">Ticket Médio</p>
                </div>
                <p className="text-3xl font-serif text-amber-600">
                  R$ {(() => {
                    const approved = payments.filter(p => p.status === 'approved');
                    if (approved.length === 0) return '0,00';
                    return (approved.reduce((acc, p) => acc + (p.amount || 0), 0) / approved.length)
                      .toLocaleString('pt-BR', { minimumFractionDigits: 2 });
                  })()}
                </p>
              </div>
            </div>

            {/* Payments Table - Desktop */}
            <div className="hidden sm:block bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Presente</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Método</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoadingPayments ? (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Carregando pagamentos...</td></tr>
                    ) : payments.length > 0 ? (
                      payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-5 py-3 font-medium text-gray-900 text-sm">{payment.gift_name || '-'}</td>
                          <td className="px-5 py-3 text-green-600 font-bold text-sm">
                            R$ {(payment.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-5 py-3 text-gray-500 text-xs">{payment.guest_email || '-'}</td>
                          <td className="px-5 py-3 text-center">
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium uppercase">{payment.payment_method || '-'}</span>
                          </td>
                          <td className="px-5 py-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              payment.status === 'approved' ? 'bg-green-100 text-green-700'
                              : payment.status === 'pending' || payment.status === 'in_process' ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                            }`}>
                              {payment.status === 'approved' ? 'Aprovado' : payment.status === 'pending' ? 'Pendente' : payment.status === 'in_process' ? 'Processando' : payment.status || 'Desconhecido'}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-gray-400 text-xs">
                            {payment.created_at ? new Date(payment.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-400">Nenhum pagamento registrado ainda</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Payments Cards - Mobile */}
            <div className="sm:hidden space-y-3">
              {isLoadingPayments ? (
                <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-sm">Carregando...</div>
              ) : payments.length > 0 ? (
                payments.map((payment) => (
                  <div key={payment.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-gray-900 text-sm">{payment.gift_name || '-'}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'approved' ? 'bg-green-100 text-green-700'
                        : payment.status === 'pending' || payment.status === 'in_process' ? 'bg-amber-100 text-amber-700'
                        : 'bg-rose-100 text-rose-700'
                      }`}>
                        {payment.status === 'approved' ? 'Aprovado' : payment.status === 'pending' ? 'Pendente' : payment.status === 'in_process' ? 'Processando' : payment.status || '-'}
                      </span>
                    </div>
                    <p className="text-green-600 font-bold">R$ {(payment.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                    <p className="text-xs text-gray-400 mt-1">{payment.guest_email || ''}</p>
                    <p className="text-xs text-gray-300 mt-0.5">{payment.created_at ? new Date(payment.created_at).toLocaleDateString('pt-BR') : ''}</p>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl p-6 text-center text-gray-400 text-sm">Nenhum pagamento registrado ainda</div>
              )}
            </div>
          </>
        )}

        {/* ============ MESSAGES TAB ============ */}
        {activeTab === 'messages' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingMessages ? (
                <div className="col-span-full py-20 text-center text-gray-400">
                  Carregando mensagens...
                </div>
              ) : messages.length > 0 ? (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative group"
                  >
                    <button
                      onClick={() => handleDeleteMessage(msg.id)}
                      className="absolute top-4 right-4 p-2 text-gray-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-10 h-10 bg-rose-50 rounded-full flex items-center justify-center shrink-0">
                        <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{msg.sender_name}</h4>
                        <p className="text-xs text-gray-400">
                          {new Date(msg.created_at).toLocaleDateString('pt-BR', {
                            day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-2xl relative">
                      <div className="absolute -top-2 left-4 w-4 h-4 bg-gray-50 rotate-45" />
                      <p className="text-gray-700 italic leading-relaxed">"{msg.message}"</p>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center text-gray-400">
                  <Heart className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  <p>Nenhuma mensagem recebida ainda. ❤️</p>
                </div>
              )}
            </div>
          </div>
        )}


        {/* ============ WHATSAPP TAB ============ */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-serif">Gerenciador de Convites WhatsApp</h3>
                  <p className="text-sm text-gray-500">Envie convites personalizados com um clique</p>
                </div>
              </div>

              {!isQueueActive && guests.filter(g => g.phone).length > 0 && (
                <button
                  onClick={() => {
                    setIsQueueActive(true);
                    setQueueIndex(0);
                  }}
                  className="w-full md:w-auto px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-rose-100 flex items-center justify-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  Iniciar Fila de Envio
                </button>
              )}
            </div>

            {isQueueActive && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-3xl border-2 border-rose-500 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gray-100">
                  <motion.div
                    className="h-full bg-rose-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((queueIndex) / guests.filter(g => g.phone).length) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center mb-8">
                  <span className="px-4 py-1.5 bg-rose-100 text-rose-700 text-sm font-bold rounded-full">
                    Convidado {queueIndex + 1} de {guests.filter(g => g.phone).length}
                  </span>
                  <button
                    onClick={() => setIsQueueActive(false)}
                    className="text-gray-400 hover:text-gray-600 text-sm font-medium"
                  >
                    Encerrar Fila
                  </button>
                </div>

                {(() => {
                  const queueGuests = guests.filter(g => g.phone);
                  const currentGuest = queueGuests[queueIndex];

                  if (!currentGuest) {
                    return (
                      <div className="text-center py-10">
                        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                        <h4 className="text-2xl font-serif mb-2">Fila Concluída!</h4>
                        <p className="text-gray-600 mb-8">Você percorreu toda a lista de convidados.</p>
                        <button
                          onClick={() => setIsQueueActive(false)}
                          className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors"
                        >
                          Voltar para a Lista
                        </button>
                      </div>
                    );
                  }

                  const handleSendNext = () => {
                    const finalInviteText = [
                      `Olá, ${currentGuest.name}!`,
                      '',
                      'Está se aproximando um momento de muita alegria: o casamento de Julia & Felipe!',
                      'Sua presença será essencial para tornar essa ocasião ainda mais especial.',
                      '',
                      'Confira todos os detalhes abaixo e não se esqueça de confirmar sua presença.',
                      '',
                      '- *Data:* 08/11/2026',
                      '- *Horário:* 09h45',
                      '- *Local Cerimônia:* La corcelle',
                      '',
                      '- *Lista de presentes:* https://casamento.infinitytechservices.com.br/lista-presentes',
                      '- *Confirmar presença:* https://casamento.infinitytechservices.com.br/confirmar-presenca',
                      '- *Visitar site:* https://casamento.infinitytechservices.com.br',
                      '',
                      '_Essa é uma mensagem automática._'
                    ].join('\n');

                    const waUrl = `https://wa.me/55${currentGuest.phone}?text=${encodeURIComponent(finalInviteText)}`;
                    window.open(waUrl, '_blank');
                    
                    if (queueIndex < queueGuests.length) {
                      setQueueIndex(queueIndex + 1);
                    }
                  };

                  return (
                    <div className="flex flex-col md:flex-row items-center gap-10">
                      <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Convidado</label>
                          <h4 className="text-4xl font-serif text-gray-900">{currentGuest.name}</h4>
                          <p className="text-gray-500">{currentGuest.family} • {currentGuest.totalGuests} pessoas</p>
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">WhatsApp</label>
                          <p className="text-xl font-mono text-gray-700">{currentGuest.phone}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 w-full md:w-auto">
                        <button
                          onClick={handleSendNext}
                          className="px-10 py-6 bg-green-500 hover:bg-green-600 text-white text-xl font-bold rounded-2xl transition-all shadow-xl shadow-green-100 flex items-center justify-center gap-3 group"
                        >
                          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                          Enviar e Próximo
                        </button>
                        <button
                          onClick={() => setQueueIndex(queueIndex + 1)}
                          className="px-10 py-3 text-gray-400 hover:text-gray-600 font-medium text-center"
                        >
                          Pular este convidado
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {!isQueueActive && (
              <>
                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3 items-start text-blue-800 text-sm">
                  <ExternalLink className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-bold mb-1">Como funciona:</p>
                    <p>O sistema gera uma mensagem personalizada para cada convidado. Ao clicar em "Enviar", uma nova aba do WhatsApp abrirá com o texto pronto para enviar. Certifique-se de que o número possui DDD.</p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-bottom border-gray-100">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Convidado / Família</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">WhatsApp</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status RSVP</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {guests.filter(g => g.phone).length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                          Nenhum convidado com telefone cadastrado. Adicione telefones na aba "Convidados".
                        </td>
                      </tr>
                    ) : (
                      guests.filter(g => g.phone).map((guest) => (
                        <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{guest.name}</div>
                            <div className="text-xs text-gray-500">{guest.family}</div>
                          </td>
                          <td className="px-6 py-4 text-gray-600 font-mono text-sm">{guest.phone}</td>
                          <td className="px-6 py-4 text-center">
                            {guest.status === 'confirmed' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium">
                                Confirmado
                              </span>
                            ) : guest.status === 'declined' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-medium">
                                Recusado
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-medium">
                                Pendente
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => {
                                const finalInviteText = [
                                  `Olá, ${guest.name}!`,
                                  '',
                                  'Está se aproximando um momento de muita alegria: o casamento de Julia & Felipe!',
                                  'Sua presença será essencial para tornar essa ocasião ainda mais especial.',
                                  '',
                                  'Confira todos os detalhes abaixo e não se esqueça de confirmar sua presença.',
                                  '',
                                  '- *Data:* 08/11/2026',
                                  '- *Horário:* 09h45',
                                  '- *Local Cerimônia:* La corcelle',
                                  '',
                                  '- *Lista de presentes:* https://casamento.infinitytechservices.com.br/lista-presentes',
                                  '- *Confirmar presença:* https://casamento.infinitytechservices.com.br/confirmar-presenca',
                                  '- *Visitar site:* https://casamento.infinitytechservices.com.br',
                                  '',
                                  '_Essa é uma mensagem automática._'
                                ].join('\n');

                                const waUrl = `https://wa.me/55${guest.phone}?text=${encodeURIComponent(finalInviteText)}`;
                                window.open(waUrl, '_blank');
                              }}
                              className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-green-100"
                            >
                              <MessageCircle className="w-4 h-4" />
                              Enviar Convite
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
        )}

      </div>

      {/* Guest Modal (Add/Edit) */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-serif mb-6">{isEditing ? "Editar Convidado" : "Novo Convidado"}</h2>
            <form onSubmit={isEditing ? handleUpdateGuest : handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Principal</label>
                <input
                  type="text"
                  value={guestForm.name}
                  onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Nome do convidado"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Diferenciador (Família/Grupo)</label>
                <input
                  type="text"
                  value={guestForm.family}
                  onChange={(e) => setGuestForm({ ...guestForm, family: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Ex: Família Silva ou Amigos da Faculdade"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Total de Convidados no Grupo</label>
                <input
                  type="number"
                  min="1"
                  value={guestForm.totalGuests}
                  onChange={(e) => setGuestForm({ ...guestForm, totalGuests: parseInt(e.target.value) || 1 })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp (DDD + Número)</label>
                <input
                  type="text"
                  value={guestForm.phone}
                  onChange={(e) => setGuestForm({ ...guestForm, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                  placeholder="Ex: 11999999999"
                />
                <p className="text-xs text-gray-400 mt-1">Apenas números. Opcional para salvar agora.</p>
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => {
                    setIsAdding(false);
                    setIsEditing(false);
                    setEditingGuest(null);
                  }}
                  className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors shadow-lg"
                >
                  {isEditing ? "Salvar" : "Adicionar"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
