import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Users, Plus, Trash2, CheckCircle, XCircle, Search, LogOut, FileUp, Pencil, CreditCard, DollarSign, TrendingUp } from "lucide-react";
import { guestService, Guest } from "../services/guestService";
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
  const [guestForm, setGuestForm] = useState({ name: "", family: "", totalGuests: 1 });
  const [isImporting, setIsImporting] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'guests' | 'payments'>('guests');
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);

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

  useEffect(() => {
    const isAuth = sessionStorage.getItem("admin_auth");
    if (!isAuth) {
      navigate("/login");
      return;
    }
    fetchGuests();
    fetchPayments();
  }, [navigate]);

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    await guestService.addGuest({
      ...guestForm,
      status: 'pending',
      confirmedCount: 0,
    });
    setGuestForm({ name: "", family: "", totalGuests: 1 });
    setIsAdding(false);
    await fetchGuests();
  };

  const handleEditClick = (guest: Guest) => {
    setEditingGuest(guest);
    setGuestForm({
      name: guest.name,
      family: guest.family,
      totalGuests: guest.totalGuests
    });
    setIsEditing(true);
  };

  const handleUpdateGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGuest) return;

    await guestService.updateGuest(editingGuest.id, {
      ...guestForm
    });
    setGuestForm({ name: "", family: "", totalGuests: 1 });
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

          if (name) {
            await guestService.addGuest({
              name,
              family,
              totalGuests: isNaN(total) ? 1 : total,
              status: 'pending',
              confirmedCount: 0,
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
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.family.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: guests.reduce((acc, g) => acc + g.totalGuests, 0),
    confirmed: guests.reduce((acc, g) => acc + (g.status === 'confirmed' ? g.confirmedCount : 0), 0),
    pending: guests.reduce((acc, g) => acc + (g.status === 'pending' ? g.totalGuests : 0), 0),
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif text-gray-900 mb-2">Painel Administrativo</h1>
            <p className="text-gray-600">Gerencie convidados e acompanhe os pagamentos</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportExcel}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sair
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <button
            onClick={() => setActiveTab('guests')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'guests'
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Users className="w-5 h-5" />
            Convidados
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              activeTab === 'payments'
                ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            Pagamentos
          </button>
        </div>

        {/* ============ GUESTS TAB ============ */}
        {activeTab === 'guests' && (
          <>
            {/* Guest Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-8">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors shadow-sm disabled:opacity-50"
              >
                <FileUp className="w-5 h-5 text-rose-500" />
                {isImporting ? "Importando..." : "Importar Planilha"}
              </button>
              <button
                onClick={() => {
                  setGuestForm({ name: "", family: "", totalGuests: 1 });
                  setIsAdding(true);
                }}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl transition-colors shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Novo Convidado
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Total de Convidados</p>
                <p className="text-3xl font-serif text-gray-900">{stats.total}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Confirmados</p>
                <p className="text-3xl font-serif text-green-600">{stats.confirmed}</p>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">Pendente/Recusado</p>
                <p className="text-3xl font-serif text-rose-500">{stats.total - stats.confirmed}</p>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome ou família..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                />
              </div>
            </div>

            {/* Guests Table */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-bottom border-gray-100">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nome Principal</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Família/Grupo</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Tamanho</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                          Carregando convidados...
                        </td>
                      </tr>
                    ) : filteredGuests.length > 0 ? (
                      filteredGuests.map((guest) => (
                        <tr key={guest.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{guest.name}</td>
                          <td className="px-6 py-4 text-gray-600">{guest.family}</td>
                          <td className="px-6 py-4 text-center text-gray-600">{guest.totalGuests}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              {guest.status === 'confirmed' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
                                  <CheckCircle className="w-4 h-4" />
                                  Confirmado ({guest.confirmedCount})
                                </span>
                              ) : guest.status === 'declined' ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-medium">
                                  <XCircle className="w-4 h-4" />
                                  Não virá
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm font-medium">
                                  Pendente
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditClick(guest)}
                                className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(guest.id)}
                                className="p-2 text-gray-400 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                          Nenhum convidado encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* ============ PAYMENTS TAB ============ */}
        {activeTab === 'payments' && (
          <>
            {/* Payments Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
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

            {/* Payments Table */}
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50 border-bottom border-gray-100">
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Presente</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Valor</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Método</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {isLoadingPayments ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                          Carregando pagamentos...
                        </td>
                      </tr>
                    ) : payments.length > 0 ? (
                      payments.map((payment) => (
                        <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{payment.gift_name || '-'}</td>
                          <td className="px-6 py-4 text-green-600 font-bold">
                            R$ {(payment.amount || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{payment.guest_email || '-'}</td>
                          <td className="px-6 py-4 text-center">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium uppercase">
                              {payment.payment_method || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                              payment.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : payment.status === 'pending' || payment.status === 'in_process'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-rose-100 text-rose-700'
                            }`}>
                              {payment.status === 'approved' ? 'Aprovado' 
                                : payment.status === 'pending' ? 'Pendente'
                                : payment.status === 'in_process' ? 'Processando'
                                : payment.status || 'Desconhecido'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 text-sm">
                            {payment.created_at ? new Date(payment.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            }) : '-'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                          Nenhum pagamento registrado ainda
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Guest Modal (Add/Edit) */}
      {(isAdding || isEditing) && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-serif mb-6">{isEditing ? "Editar Convidado" : "Novo Convidado"}</h2>
            <form onSubmit={isEditing ? handleUpdateGuest : handleAddGuest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Principal</label>
                <input
                  type="text"
                  value={guestForm.name}
                  onChange={(e) => setGuestForm({...guestForm, name: e.target.value})}
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
                  onChange={(e) => setGuestForm({...guestForm, family: e.target.value})}
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
                  onChange={(e) => setGuestForm({...guestForm, totalGuests: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
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
