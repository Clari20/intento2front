
import React, { useState } from 'react';
import { Item } from '../types';
import CreateProductModal from './CreateProductModal';

interface ItemsListProps {
  items: Item[];
  refreshData: () => void;
  isAuthenticated: boolean;
  onActionClick: () => void;
  addToCart: (item: Item) => void;
  onViewDetails: (item: Item) => void;
  mode?: 'inventory' | 'shop';
}

const ItemsList: React.FC<ItemsListProps> = ({ items, refreshData, isAuthenticated, onActionClick, addToCart, onViewDetails, mode = 'shop' }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-12 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-5xl font-black text-white tracking-tighter">
            {mode === 'shop' ? 'Tech Collection' : 'Gestión de Stock'}
          </h2>
          <p className="text-slate-500 mt-2 font-medium text-lg italic">
            {mode === 'shop' ? 'Los mejores dispositivos del planeta.' : 'Supervisa y añade nuevo inventario.'}
          </p>
        </div>
        {mode === 'inventory' && isAuthenticated && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-4 rounded-2xl font-black transition-all shadow-xl shadow-blue-900/20 active:scale-95"
          >
            + Crear Nuevo Producto
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.id} className="bg-slate-900/50 border border-slate-800 rounded-[2rem] p-6 hover:border-blue-500/40 transition-all flex flex-col group shadow-xl">
            <div 
              onClick={() => onViewDetails(item)}
              className="aspect-square bg-slate-950 rounded-[1.5rem] mb-6 flex items-center justify-center text-5xl cursor-pointer hover:scale-[1.03] transition-transform duration-500 relative group overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {item.image_url ? (
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover rounded-[1.5rem] opacity-80 group-hover:opacity-100 transition-opacity" />
              ) : (
                item.category === 'Laptop' ? '💻' : item.category === 'Mobile' ? '📱' : item.category === 'Tablet' ? '平板' : '🔌'
              )}
            </div>
            <div className="space-y-2 flex-1">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">{item.category}</span>
              <h3 
                onClick={() => onViewDetails(item)}
                className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors cursor-pointer"
              >
                {item.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 font-medium">
                {item.description}
              </p>
              {item.stock_quantity !== undefined && (
                <p className={`text-[10px] font-bold ${item.stock_quantity > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                  STOCK: {item.stock_quantity} unidades
                </p>
              )}
            </div>
            <div className="mt-6 pt-6 border-t border-slate-800 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Price</span>
                <span className="text-2xl font-black text-white">${item.price || 500}</span>
              </div>
              <button 
                onClick={() => addToCart(item)}
                className="p-4 bg-white hover:bg-blue-600 text-slate-950 hover:text-white rounded-2xl transition-all shadow-lg active:scale-90"
                title="Añadir al Carrito"
              >
                🛒
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-24 bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-800">
          <div className="text-7xl mb-6 grayscale opacity-20">📦</div>
          <p className="text-slate-500 font-bold text-xl italic">La tienda está lista para ser poblada. ¡Usa el botón de creación!</p>
        </div>
      )}

      {showCreateModal && (
        <CreateProductModal 
          onClose={() => setShowCreateModal(false)} 
          onSuccess={refreshData}
        />
      )}
    </div>
  );
};

export default ItemsList;
