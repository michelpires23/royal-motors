
import React, { useState, useMemo, useEffect } from 'react';
import { CarFront, Search, Info, Instagram, Facebook, Twitter, Phone, X, ChevronLeft, ChevronRight, CheckCircle2, Settings, Plus, Save, Trash2, Edit3, Image as ImageIcon, EyeOff, Eye, Lock, LogOut, MapPin, Upload } from 'lucide-react';
import { MOCK_CARS } from './constants';
import { Car } from './types';
import CarCard from './components/CarCard';

const ITEMS_PER_PAGE = 16;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'seminovo' | 'search'>('seminovo');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Admin States
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [cars, setCars] = useState<Car[]>([]);
  const [editingCar, setEditingCar] = useState<Car | null>(null);

  const ADMIN_PASSWORD = 'royalmotors369741';

  // Load cars from localStorage or use Mock
  useEffect(() => {
    const savedCars = localStorage.getItem('royal_motors_inventory');
    if (savedCars) {
      setCars(JSON.parse(savedCars));
    } else {
      setCars(MOCK_CARS);
    }
    
    // Check if was admin in this session
    const adminSession = sessionStorage.getItem('is_admin_royal');
    if (adminSession === 'true') setIsAdmin(true);
  }, []);

  // Save to localStorage whenever cars change
  const saveInventory = (updatedCars: Car[]) => {
    setCars(updatedCars);
    localStorage.setItem('royal_motors_inventory', JSON.stringify(updatedCars));
  };

  const filteredCars = useMemo(() => {
    let result = activeTab === 'seminovo' ? [...cars] : [...cars].reverse();
    
    if (searchTerm) {
      result = result.filter(car => 
        car.brand.toLowerCase().includes(searchTerm.toLowerCase()) || 
        car.model.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    return result;
  }, [searchTerm, cars, activeTab]);

  // Reset page when filtering or changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, activeTab]);

  const totalPages = Math.ceil(filteredCars.length / ITEMS_PER_PAGE);
  const paginatedCars = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCars.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCars, currentPage]);

  const openGallery = (car: Car) => {
    setSelectedCar(car);
    setActiveImageIndex(0);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setSelectedCar(null);
    document.body.style.overflow = 'unset';
  };

  // Auth Actions
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setShowAuthModal(false);
      setPasswordInput('');
      setShowPassword(false);
      setAuthError(false);
      sessionStorage.setItem('is_admin_royal', 'true');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('is_admin_royal');
  };

  // Admin Actions
  const handleAddNew = () => {
    const newCar: Car = {
      id: Date.now().toString(),
      brand: 'NOVA MARCA',
      model: 'MODELO DO VEÍCULO',
      year: new Date().getFullYear(),
      price: 0,
      km: 0,
      description: 'Descrição do veículo...',
      fuel: 'Flex',
      transmission: 'Automático',
      imageUrl: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800',
      gallery: [],
      features: ['Ar condicionado', 'Direção hidráulica'],
      isNew: true
    };
    setEditingCar(newCar);
  };

  const handleEdit = (car: Car) => {
    setEditingCar({ ...car });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCar) return;

    const exists = cars.find(c => c.id === editingCar.id);
    let updated: Car[];
    if (exists) {
      updated = cars.map(c => c.id === editingCar.id ? editingCar : c);
    } else {
      updated = [editingCar, ...cars];
    }
    
    saveInventory(updated);
    setEditingCar(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este veículo do estoque?')) {
      const updated = cars.filter(c => c.id !== id);
      saveInventory(updated);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 10);
    if (files.length === 0 || !editingCar) return;

    const readAsDataURL = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };

    try {
      const base64Images = await Promise.all(files.map(readAsDataURL));
      setEditingCar({
        ...editingCar,
        imageUrl: base64Images[0], // Primeira imagem como principal
        gallery: base64Images // Todas as selecionadas na galeria
      });
    } catch (error) {
      console.error("Erro ao ler arquivos:", error);
    }
  };

  const RoyalLogo = ({ className = "", watermark = false }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 500 350" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="chromeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="48%" stopColor="#d1d5db" />
            <stop offset="50%" stopColor="#6b7280" />
            <stop offset="52%" stopColor="#9ca3af" />
            <stop offset="100%" stopColor="#374151" />
          </linearGradient>
          <linearGradient id="goldStrokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8a6d3b" />
            <stop offset="50%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#8a6d3b" />
          </linearGradient>
        </defs>
        
        {/* Golden Arcs over the text */}
        <g transform="translate(0, 30)" opacity={watermark ? 0.1 : 1}>
          {/* Top Arc */}
          <path d="M120,80 C180,30 320,30 380,80" fill="none" stroke="url(#goldStrokeGradient)" strokeWidth="5" strokeLinecap="round" />
          {/* Lower Arc with Red Dot */}
          <path d="M100,105 C170,45 330,45 400,105" fill="none" stroke="url(#goldStrokeGradient)" strokeWidth="7" strokeLinecap="round" />
          {/* Red Circle detail on the left edge of arc */}
          <circle cx="95" cy="100" r="10" fill="#b91c1c" />
        </g>

        {/* ROYAL Text - Chrome/Silver Bold Italic */}
        <text x="250" y="215" textAnchor="middle" style={{ 
          fontSize: '115px', 
          fontWeight: '900',
          fontStyle: 'italic',
          fill: watermark ? 'rgba(255,255,255,0.05)' : 'url(#chromeGradient)', 
          fontFamily: "'Inter', sans-serif",
          letterSpacing: '-2px'
        }}>ROYAL</text>
        
        {/* MOTORS Text - Gold Bold */}
        <text x="250" y="280" textAnchor="middle" style={{ 
          fontSize: '70px', 
          fontWeight: '800',
          fill: watermark ? 'rgba(212,175,55,0.05)' : '#D4AF37', 
          letterSpacing: '5px', 
          fontFamily: "'Inter', sans-serif" 
        }}>MOTORS</text>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <RoyalLogo className="w-[180%] h-[180%] -rotate-6 opacity-10" watermark />
        </div>

        {/* Header Admin Controls */}
        {isAdmin && (
          <div className="fixed top-4 right-4 z-[60] flex gap-2">
            <button 
              onClick={handleLogout}
              className="bg-red-600 text-white p-3 rounded-full shadow-2xl hover:bg-red-700 transition-all flex items-center gap-2 font-bold text-xs uppercase tracking-widest"
              title="Sair do Painel"
            >
              <LogOut size={18} />
              Sair
            </button>
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10 flex flex-col items-center justify-center">
          <div className="w-full max-w-[500px] md:max-w-[700px] transform hover:scale-105 transition-transform duration-700">
            <RoyalLogo className="w-full h-auto drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" />
          </div>
        </div>

        <div className="bg-black/80 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 h-24 flex flex-col md:flex-row justify-between items-center py-4 relative z-10">
            <div className="flex flex-col mb-2 md:mb-0">
              <h1 className="text-3xl font-extrabold tracking-tighter flex items-center">
                CONFIRA <span className="text-[#D4AF37] ml-2 uppercase">NOSSO ESTOQUE</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-300 font-medium">
              <div className="flex items-center gap-2">
                <CarFront size={18} className="text-gray-400" />
                <span>DISPONÍVEL <span className="text-white font-bold">{cars.length}</span> AUTOMÓVEIS</span>
              </div>
              
              {isAdmin && (
                <button 
                  onClick={handleAddNew}
                  className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md font-black uppercase tracking-widest flex items-center gap-2 transition-colors"
                >
                  <Plus size={16} />
                  Novo Carro
                </button>
              )}
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 flex relative z-10">
            <button 
              onClick={() => { setActiveTab('seminovo'); setSearchTerm(''); }}
              className={`px-10 py-5 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                activeTab === 'seminovo' ? 'bg-white text-gray-900 border-white' : 'bg-transparent text-gray-400 hover:text-white border-transparent'
              }`}
            >
              Automóveis Seminovo
            </button>
            <button 
              onClick={() => setActiveTab('search')}
              className={`px-10 py-5 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                activeTab === 'search' ? 'bg-white text-gray-900 border-white' : 'bg-transparent text-gray-400 hover:text-white border-transparent'
              }`}
            >
              Pesquisar no Estoque
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto px-4 py-8 w-full">
        {activeTab === 'search' && (
          <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#D4AF37] transition-colors" />
              </div>
              <input
                type="text"
                autoFocus
                className="block w-full pl-12 pr-4 py-5 border-2 border-gray-100 focus:border-[#D4AF37] focus:ring-0 bg-white shadow-xl sm:text-sm rounded-lg placeholder-gray-400 transition-all outline-none text-black font-semibold"
                placeholder="Digite a marca ou modelo que você procura..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        )}

        {paginatedCars.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {paginatedCars.map((car) => (
                <CarCard 
                  key={car.id} 
                  car={car} 
                  onImageClick={openGallery} 
                  isAdmin={isAdmin}
                  onEdit={() => handleEdit(car)}
                  onDelete={() => handleDelete(car.id)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-16 flex items-center justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-[#D4AF37] disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`min-w-[44px] h-[44px] rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-sm ${
                        currentPage === page 
                        ? 'bg-[#D4AF37] text-white' 
                        : 'bg-white text-gray-400 border border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 bg-white border border-gray-200 rounded-lg text-gray-400 hover:text-[#D4AF37] disabled:opacity-30 disabled:hover:text-gray-400 transition-all shadow-sm"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Info size={64} className="mb-6 opacity-10" />
            <p className="text-xl font-bold italic">Nenhum veículo encontrado para sua busca.</p>
            <button onClick={() => setSearchTerm('')} className="mt-6 text-[#D4AF37] hover:text-[#b5952f] font-black uppercase text-sm tracking-widest">[ Limpar Pesquisa ]</button>
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-black p-6 flex justify-between items-center">
              <h2 className="text-[#D4AF37] font-black uppercase tracking-widest flex items-center gap-2">
                <Lock size={18} />
                Acesso Vendedor
              </h2>
              <button onClick={() => { setShowAuthModal(false); setAuthError(false); setPasswordInput(''); setShowPassword(false); }} className="text-white hover:text-red-500 transition-colors"><X size={24} /></button>
            </div>
            <form onSubmit={handleAuthSubmit} className="p-8 space-y-6 text-center">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] leading-relaxed">
                Digite a senha de acesso para gerenciar o estoque.
              </p>
              <div className="relative group">
                <input 
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  placeholder="Senha Royal Motors"
                  value={passwordInput}
                  onChange={e => { setPasswordInput(e.target.value); setAuthError(false); }}
                  className={`w-full p-4 pr-12 bg-gray-50 border-2 rounded-xl text-center font-black tracking-widest outline-none transition-all text-black ${authError ? 'border-red-500 bg-red-50' : 'border-gray-100 focus:border-[#D4AF37]'}`}
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#D4AF37] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {authError && <p className="mt-2 text-[10px] text-red-500 font-black uppercase tracking-widest">Senha Incorreta</p>}
              </div>
              <button 
                type="submit"
                className="w-full bg-black text-white font-black uppercase text-xs py-4 rounded-xl hover:bg-[#D4AF37] transition-all shadow-xl tracking-widest"
              >
                Entrar no Painel
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {editingCar && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 overflow-y-auto">
          <form onSubmit={handleSaveEdit} className="bg-white w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="bg-black p-6 flex justify-between items-center">
              <h2 className="text-[#D4AF37] font-black uppercase tracking-widest flex items-center gap-2">
                <Edit3 size={20} />
                Editor de Veículo
              </h2>
              <button type="button" onClick={() => setEditingCar(null)} className="text-white hover:text-red-500"><X size={24} /></button>
            </div>
            
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <h3 className="font-black text-xs uppercase text-gray-400 border-b pb-1">Informações Básicas</h3>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Marca</label>
                  <input required value={editingCar.brand} onChange={e => setEditingCar({...editingCar, brand: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold uppercase text-black" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Modelo</label>
                  <input required value={editingCar.model} onChange={e => setEditingCar({...editingCar, model: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold uppercase text-black" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Ano</label>
                    <input type="number" required value={editingCar.year} onChange={e => setEditingCar({...editingCar, year: parseInt(e.target.value)})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-black" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Preço (R$)</label>
                    <input type="number" required value={editingCar.price} onChange={e => setEditingCar({...editingCar, price: parseInt(e.target.value)})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-black" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Quilometragem</label>
                    <input type="number" required value={editingCar.km} onChange={e => setEditingCar({...editingCar, km: parseInt(e.target.value)})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-black" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Combustível</label>
                    <input value={editingCar.fuel} onChange={e => setEditingCar({...editingCar, fuel: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-bold text-black" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-black text-xs uppercase text-gray-400 border-b pb-1">Mídia & Destaques</h3>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Imagens do Veículo {editingCar.gallery && editingCar.gallery.length > 0 && `(${editingCar.gallery.length}/10)`}</label>
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <input 
                        type="text"
                        required 
                        value={editingCar.imageUrl} 
                        onChange={e => setEditingCar({...editingCar, imageUrl: e.target.value})} 
                        className="w-full p-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg text-xs text-black" 
                        placeholder="Link da imagem principal ou selecione arquivos..." 
                      />
                      <label className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer p-2 hover:text-[#D4AF37] text-gray-400 transition-colors" title="Carregar até 10 fotos">
                        <Upload size={18} />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept=".jpg,.jpeg,.png,.gif,.bmp,.tiff,.svg,.pdf"
                          multiple
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden border shrink-0">
                      <img 
                        src={editingCar.imageUrl} 
                        className="w-full h-full object-cover" 
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x100?text=IMG')} 
                      />
                    </div>
                  </div>
                  <p className="mt-1 text-[8px] text-gray-400 uppercase font-black tracking-widest">Formatos: JPG, PNG, GIF, BMP, TIFF, SVG, PDF (Máx. 10 fotos)</p>
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Descrição Comercial</label>
                  <textarea rows={3} value={editingCar.description} onChange={e => setEditingCar({...editingCar, description: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm italic text-black" />
                </div>
                <div>
                  <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">Opcionais (separados por vírgula)</label>
                  <textarea rows={2} value={editingCar.features?.join(', ')} onChange={e => setEditingCar({...editingCar, features: e.target.value.split(',').map(s => s.trim())})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-black" placeholder="Ar condicionado, Direção, etc..." />
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 border-t flex justify-end gap-4">
              <button type="button" onClick={() => setEditingCar(null)} className="px-6 py-3 font-black uppercase text-xs text-gray-400 hover:text-gray-600 tracking-widest">Cancelar</button>
              <button type="submit" className="bg-[#D4AF37] hover:bg-[#b5952f] text-white px-10 py-3 rounded-xl font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20 transition-all">
                <Save size={18} />
                Salvar Veículo
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Modal */}
      {selectedCar && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300" onClick={closeGallery}>
          <button className="absolute top-6 right-6 text-white hover:text-[#D4AF37] transition-colors z-[130] p-2 bg-black/50 rounded-full" onClick={closeGallery}><X size={32} /></button>
          <div className="flex flex-col lg:flex-row max-w-7xl w-full h-full lg:h-[85vh] bg-white overflow-hidden shadow-2xl rounded-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex-1 bg-zinc-900 flex items-center justify-center relative group h-1/2 lg:h-full">
              <img src={selectedCar.gallery && selectedCar.gallery.length > 0 ? selectedCar.gallery[activeImageIndex] : selectedCar.imageUrl} alt={selectedCar.model} className="max-h-full max-w-full object-contain p-4" />
              {selectedCar.gallery && selectedCar.gallery.length > 1 && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev - 1 + (selectedCar.gallery?.length || 1)) % (selectedCar.gallery?.length || 1)) }} className="absolute left-6 p-3 bg-black/80 text-white rounded-full hover:bg-[#D4AF37] transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"><ChevronLeft size={28} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex((prev) => (prev + 1) % (selectedCar.gallery?.length || 1)) }} className="absolute right-6 p-3 bg-black/80 text-white rounded-full hover:bg-[#D4AF37] transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"><ChevronRight size={28} /></button>
                  <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                    {selectedCar.gallery.map((_, idx) => (
                      <div key={idx} className={`h-2 w-10 rounded-full transition-all duration-300 ${idx === activeImageIndex ? 'bg-[#D4AF37] w-14' : 'bg-white/20'}`} />
                    ))}
                  </div>
                </>
              )}
            </div>
            <div className="w-full lg:w-[450px] p-8 overflow-y-auto bg-white border-l border-gray-100">
              <div className="mb-8">
                <span className="text-[#D4AF37] text-xs font-black uppercase tracking-[0.3em]">{selectedCar.brand}</span>
                <h2 className="text-4xl font-black text-gray-900 leading-none mt-2 uppercase italic tracking-tighter">{selectedCar.model}</h2>
                <div className="flex items-center gap-4 mt-6">
                  <div className="bg-[#D4AF37] text-white font-black text-2xl px-6 py-3 transform skew-x-[-12deg] shadow-lg shadow-[#D4AF37]/30">
                    <span className="transform skew-x-[12deg] inline-block tracking-tighter">{selectedCar.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                  <div className="flex flex-col"><span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Ano</span><span className="text-gray-900 font-black text-lg">{selectedCar.year}</span></div>
                </div>
              </div>
              <div className="space-y-8">
                <div>
                  <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-[0.2em] border-b border-gray-100 pb-2">Sobre este Veículo</h3>
                  <p className="text-sm text-gray-600 leading-relaxed italic font-medium">{selectedCar.description}</p>
                </div>
                {selectedCar.features && (
                  <div>
                    <h3 className="text-xs font-black uppercase text-gray-400 mb-4 tracking-[0.2em] border-b border-gray-100 pb-2">Destaques e Opcionais</h3>
                    <ul className="grid grid-cols-1 gap-y-3">
                      {selectedCar.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs text-gray-700 font-bold uppercase tracking-tight">
                          <CheckCircle2 size={16} className="text-[#D4AF37] mt-0.5 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="pt-8 mt-4">
                  <a href={`https://api.whatsapp.com/send/?phone=5518996717436&text=Olá, tenho interesse no ${selectedCar.model} (${selectedCar.year}) que vi no site Royal Motors!`} target="_blank" rel="noopener noreferrer" className="w-full bg-[#D4AF37] hover:bg-[#b5952f] text-white font-black uppercase text-sm py-5 rounded-xl flex items-center justify-center gap-3 transition-all shadow-xl hover:shadow-[#D4AF37]/40 transform hover:-translate-y-1">
                    <Phone size={20} /> Falar com Especialista
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-black mt-16 pt-16 pb-12 border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16 items-start">
            {/* Logo and Description Section */}
            <div className="flex flex-col">
              <div className="w-48 mb-6 transform -translate-x-4"><RoyalLogo className="w-full h-auto" /></div>
              <p className="text-gray-500 text-[11px] max-w-sm leading-relaxed font-medium italic">
                A Royal Motors é sinônimo de excelência e exclusividade. Nossa missão é oferecer curadoria de alto nível para quem busca veículos com procedência garantida e performance superior.
              </p>
            </div>

            {/* Quick Links Section */}
            <div className="flex flex-col md:pl-20 md:pt-40">
              <nav className="space-y-6">
                <a href="https://api.whatsapp.com/send/?phone=5518996717436" target="_blank" rel="noopener noreferrer" className="block text-white text-xs font-black uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors">
                  FINANCIAMENTO
                </a>
                <a href="https://api.whatsapp.com/send/?phone=5518996717436" target="_blank" rel="noopener noreferrer" className="block text-white text-xs font-black uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors">
                  AVALIE SEU CARRO
                </a>
                <button 
                  onClick={() => isAdmin ? handleLogout() : setShowAuthModal(true)} 
                  className="flex items-center gap-3 text-gray-500 text-xs font-black uppercase tracking-[0.2em] hover:text-[#D4AF37] transition-colors"
                >
                  <Lock size={16} /> {isAdmin ? 'SAIR DO PAINEL' : 'Acesso Vendedor'}
                </button>
              </nav>
            </div>

            {/* Contact and Social Section */}
            <div className="flex flex-col md:items-end md:pt-40">
              <a href="https://api.whatsapp.com/send/?phone=5518996717436" target="_blank" rel="noopener noreferrer" className="flex items-center gap-6 text-sm text-gray-300 mb-8 hover:text-white transition-colors group p-3 px-6 bg-zinc-900/40 rounded-full border border-zinc-800/50">
                <Phone size={18} className="text-[#D4AF37]" />
                <span className="font-black tracking-[0.1em]">(18) 99671-7436</span>
              </a>
              
              <div className="flex gap-4">
                <a 
                  href="https://maps.app.goo.gl/fKu3DAs4FWszjQVD9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 bg-zinc-900/60 rounded-xl hover:bg-[#D4AF37] hover:text-white text-gray-500 transition-all hover:-translate-y-1"
                  title="Como Chegar"
                >
                  <MapPin size={22} />
                </a>
                <a 
                  href="https://www.instagram.com/royalmotors_ppta/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-4 bg-zinc-900/60 rounded-xl hover:bg-[#D4AF37] hover:text-white text-gray-500 transition-all hover:-translate-y-1"
                  title="Instagram"
                >
                  <Instagram size={22} />
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900/50 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-700 font-bold tracking-[0.2em] uppercase">
            <p>© 2024 ROYAL MOTORS • COMPRA VENDA TROCA</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
