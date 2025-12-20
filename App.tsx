
import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import { AuthState, User, Item, View, CartItem } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ItemsList from './components/ItemsList';
import AIAssistant from './components/AIAssistant';
import Home from './components/Home';
import Cart from './components/Cart';
import ProductDetails from './components/ProductDetails';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
  });

  const [view, setView] = useState<View>('home');
  const [items, setItems] = useState<Item[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Item | null>(null);
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '', full_name: '' });
  const [authError, setAuthError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getItems();
      setItems(data);
    } catch (err: any) {
      console.error("Fetch Items Error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (auth.token) {
      api.getCurrentUser()
        .then(user => {
          const is_admin = user.email === 'admin@techstore.com' || user.is_admin;
          setAuth(prev => ({ ...prev, user: { ...user, is_admin }, isAuthenticated: true }));
          fetchData();
        })
        .catch(() => {
          console.warn("Sesión expirada o inválida. Reiniciando...");
          api.logout();
          setAuth({ user: null, token: null, isAuthenticated: false });
          fetchData();
        });
    } else {
      fetchData();
    }
  }, [auth.token, fetchData]);

  const handleAuth = async (e?: React.FormEvent, directCreds?: any) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setLoading(true);
    
    const targetCreds = directCreds || credentials;

    try {
      if (isRegistering && !directCreds) {
        await api.register(targetCreds);
        setIsRegistering(false);
        setAuthError(null);
        alert("¡Cuenta creada exitosamente! Ya puedes iniciar sesión.");
      } else {
        const formData = new FormData();
        formData.append('username', targetCreds.username);
        formData.append('password', targetCreds.password);
        formData.append('grant_type', 'password'); // Requerido por muchos backends de FastAPI
        
        await api.login(formData);
        const token = localStorage.getItem('token');
        
        setAuth(prev => ({
          ...prev,
          token,
          isAuthenticated: true
        }));
        
        setShowLoginModal(false);
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      let errorMsg = err.message || 'Error de conexión';
      if (errorMsg.includes('404')) {
        errorMsg = "Error: El servidor no reconoce la ruta de autenticación. Verifica la configuración en Render.";
      }
      setAuthError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const setDemoUser = (type: 'admin' | 'client') => {
    const creds = type === 'admin' 
      ? { username: 'admin@techstore.com', password: 'admin123' }
      : { username: 'cliente@techstore.com', password: 'cliente123' };
    
    setCredentials({ ...creds, full_name: '' });
    handleAuth(undefined, creds);
  };

  const handleLogout = () => {
    api.logout();
    setAuth({ user: null, token: null, isAuthenticated: false });
    setView('home');
    setItems([]);
    fetchData();
  };

  const addToCart = (item: Item) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1, price: item.price || 500 }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  };

  const removeFromCart = (id: number) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const handleCheckout = () => {
    alert("¡Pedido procesado con éxito!");
    setCart([]);
    setView('home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Sidebar 
        currentView={view} 
        setView={setView} 
        onLogout={handleLogout} 
        isAuthenticated={auth.isAuthenticated}
        isAdmin={!!auth.user?.is_admin}
        onLoginClick={() => { setShowLoginModal(true); setAuthError(null); }}
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
      />

      <main className="pl-64 min-h-screen">
        <div className="p-8 md:p-12 max-w-7xl mx-auto">
          {view === 'home' && <Home setView={setView} />}
          {view === 'shop' && (
            <ItemsList 
              items={items} 
              refreshData={fetchData} 
              isAuthenticated={auth.isAuthenticated} 
              onActionClick={() => setShowLoginModal(true)}
              addToCart={addToCart}
              onViewDetails={setSelectedProduct}
              mode="shop"
            />
          )}
          {view === 'cart' && (
            <Cart 
              cart={cart} 
              updateQuantity={updateQuantity} 
              removeFromCart={removeFromCart} 
              onCheckout={handleCheckout} 
            />
          )}
          {view === 'dashboard' && <Dashboard items={items} refreshData={fetchData} />}
          {view === 'items' && (
            <ItemsList 
              items={items} 
              refreshData={fetchData} 
              isAuthenticated={auth.isAuthenticated} 
              onActionClick={() => setShowLoginModal(true)}
              addToCart={addToCart}
              onViewDetails={setSelectedProduct}
              mode="inventory"
            />
          )}
          {view === 'ai-assistant' && <AIAssistant items={items} />}
        </div>
      </main>

      {selectedProduct && (
        <ProductDetails 
          item={selectedProduct} 
          onClose={() => setSelectedProduct(null)} 
          onAddToCart={addToCart} 
        />
      )}

      {showLoginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 shadow-2xl relative">
            <button onClick={() => setShowLoginModal(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors">✕</button>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
                {isRegistering ? 'Crear Cuenta' : 'Acceso Premium'}
              </h2>
              <p className="text-slate-500 font-medium italic">Sincronizado con Render Cloud.</p>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-3">
              <button 
                onClick={() => setDemoUser('admin')}
                className="py-3 px-3 bg-blue-600/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-tighter hover:bg-blue-600/20 transition-all flex flex-col items-center gap-1"
              >
                <span className="text-lg">🛠️</span>
                Admin Demo
              </button>
              <button 
                onClick={() => setDemoUser('client')}
                className="py-3 px-3 bg-emerald-600/10 border border-emerald-500/20 rounded-xl text-[10px] font-black text-emerald-400 uppercase tracking-tighter hover:bg-emerald-600/20 transition-all flex flex-col items-center gap-1"
              >
                <span className="text-lg">👤</span>
                Cliente Demo
              </button>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              {isRegistering && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nombre Completo</label>
                  <input
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={credentials.full_name}
                    onChange={(e) => setCredentials({ ...credentials, full_name: e.target.value })}
                  />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Email / Usuario</label>
                <input
                  required
                  type="email"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Contraseña</label>
                <input
                  required
                  type="password"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                />
              </div>

              {authError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs p-4 rounded-xl font-bold animate-pulse">
                  ⚠️ {authError}
                </div>
              )}

              <button
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-900/40 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>Sincronizando...</span>
                  </div>
                ) : isRegistering ? 'Registrarme' : 'Entrar'}
              </button>

              <p className="text-center text-slate-500 text-sm mt-6">
                {isRegistering ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
                <button
                  type="button"
                  onClick={() => { setIsRegistering(!isRegistering); setAuthError(null); }}
                  className="ml-2 text-blue-500 font-bold hover:underline"
                >
                  {isRegistering ? 'Inicia Sesión' : 'Regístrate gratis'}
                </button>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
