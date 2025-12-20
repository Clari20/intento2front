
import React, { useState } from 'react';
import { Item } from '../types';
import { api } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CreateProductModal from './CreateProductModal';

interface DashboardProps {
  items: Item[];
  refreshData: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ items, refreshData }) => {
  const [seeding, setSeeding] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const seedDemoData = async () => {
    const token = api.getToken();
    if (!token) {
      alert("⚠️ ERROR CRÍTICO: El sistema no detecta tu sesión. Intenta cerrar sesión y volver a entrar con el botón 'Admin Demo'.");
      return;
    }

    setSeeding(true);
    const techCatalog = [
      { title: "MacBook Pro M3", price: 2499, category: "Laptop", description: "Chip M3 Max para profesionales.", stock_quantity: 10 },
      { title: "iPhone 15 Pro", price: 999, category: "Mobile", description: "Titanio y cámara de 48MP.", stock_quantity: 25 },
      { title: "Sony WH-1000XM5", price: 350, category: "Accesorio", description: "Cancelación de ruido líder.", stock_quantity: 40 },
      { title: "RTX 4090 OC", price: 1599, category: "Componente", description: "La GPU más potente del mundo.", stock_quantity: 5 }
    ];

    try {
      console.log("[TechStore] Iniciando población masiva...");
      for (const prod of techCatalog) {
        await api.createItem(prod as any);
      }
      alert("🚀 ¡ÉXITO! Inventario sincronizado.");
      refreshData();
    } catch (e: any) {
      alert(`❌ ERROR AL POBLAR:\n${e.message}\n\nNota: Es posible que tu usuario no tenga permisos de escritura en el backend de Render.`);
    } finally {
      setSeeding(false);
    }
  };

  const chartData = items.length > 0 
    ? Object.values(items.reduce((acc: any, item) => {
        const cat = item.category || 'Otros';
        acc[cat] = acc[cat] || { category: cat, count: 0 };
        acc[cat].count += 1;
        return acc;
      }, {}))
    : [{ category: 'Sin Datos', count: 0 }];

  return (
    <div className="space-y-10 animate-fadeIn min-h-screen pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Panel de Control</h2>
          <p className="text-slate-500 font-medium italic">Sincronizado con Render Cloud.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/30 active:scale-95"
          >
            + Crear
          </button>
          <button 
            onClick={seedDemoData}
            disabled={seeding}
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl border border-slate-700 font-bold transition-all disabled:opacity-50"
          >
            {seeding ? 'Cargando...' : '🚀 Poblar API'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">SKUs</p>
          <p className="text-5xl font-black text-white mt-2">{items.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Valor</p>
          <p className="text-5xl font-black text-emerald-500 mt-2">${items.reduce((a, b) => a + (b.price || 0), 0)}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Server</p>
          <p className="text-5xl font-black text-blue-500 mt-2">ONLINE</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[2.5rem]">
        <h3 className="text-xl font-bold text-white mb-8">Stock por Categoría</h3>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="category" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip 
                cursor={{fill: '#1e293b'}} 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', color: '#fff' }} 
              />
              <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showCreateModal && (
        <CreateProductModal 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={refreshData}
        />
      )}
    </div>
  );
};

export default Dashboard;
