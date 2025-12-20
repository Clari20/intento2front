
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  onLoginClick: () => void;
  cartCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onLogout, isAuthenticated, isAdmin, onLoginClick, cartCount }) => {
  const publicItems = [
    { id: 'home', label: 'Inicio', icon: '🏠' },
    { id: 'shop', label: 'Tienda', icon: '💻' },
    { id: 'cart', label: `Carrito (${cartCount})`, icon: '🛒' },
  ];

  const adminItems = [
    { id: 'dashboard', label: 'Panel Control', icon: '📊' },
    { id: 'items', label: 'Gestión Stock', icon: '📦' },
    { id: 'ai-assistant', label: 'Analista AI', icon: '✨' },
  ];

  const renderNavItems = (items: typeof publicItems) => items.map((item) => (
    <button
      key={item.id}
      onClick={() => setView(item.id as View)}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
        currentView === item.id 
          ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30 shadow-lg shadow-blue-900/10' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <span className="text-xl">{item.icon}</span>
      <span className="font-medium">{item.label}</span>
    </button>
  ));

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-900 flex flex-col h-screen fixed left-0 top-0 z-50">
      <div className="p-8">
        <h1 className="text-2xl font-black tracking-tighter text-white">
          TECH<span className="text-blue-500">STORE</span>
        </h1>
        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">Premium Hardware</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-6 mt-4">
        <div className="space-y-1">
          <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Explorar</p>
          {renderNavItems(publicItems)}
        </div>

        {isAuthenticated && isAdmin && (
          <div className="space-y-1 animate-fadeIn">
            <p className="px-4 text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-2">Administración</p>
            {renderNavItems(adminItems)}
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
        {isAuthenticated ? (
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
          >
            <span>🚪</span>
            <span className="font-medium">Salir</span>
          </button>
        ) : (
          <button
            onClick={onLoginClick}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-900/20"
          >
            <span>🔑</span>
            <span className="font-medium">Entrar</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
