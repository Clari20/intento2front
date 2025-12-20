
import React from 'react';
import { Item } from '../types';

interface ProductDetailsProps {
  item: Item;
  onClose: () => void;
  onAddToCart: (item: Item) => void;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ item, onClose, onAddToCart }) => {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fadeIn">
      <div className="max-w-4xl w-full bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative flex flex-col md:flex-row">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors"
        >
          ✕
        </button>

        <div className="md:w-1/2 bg-slate-950 flex items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent"></div>
          <span className="text-9xl relative z-10 drop-shadow-2xl">
            {item.category === 'Laptop' ? '💻' : item.category === 'Mobile' ? '📱' : item.category === 'Tablet' ? '平板' : '🔌'}
          </span>
        </div>

        <div className="md:w-1/2 p-10 flex flex-col justify-center">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="px-4 py-1 bg-blue-500/10 text-blue-400 text-xs font-black rounded-full border border-blue-500/20 uppercase tracking-widest">
                {item.category}
              </span>
              <h2 className="text-4xl font-black text-white leading-tight">{item.title}</h2>
            </div>

            <div className="space-y-4">
              <p className="text-slate-400 text-lg leading-relaxed font-medium">
                {item.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Stock</p>
                  <p className="text-emerald-400 font-bold">Disponible ✅</p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Garantía</p>
                  <p className="text-blue-400 font-bold">12 Meses 🛡️</p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase">Precio Especial</p>
                <p className="text-4xl font-black text-white">${item.price}</p>
              </div>
              <button 
                onClick={() => { onAddToCart(item); onClose(); }}
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black transition-all shadow-xl shadow-blue-900/40 transform active:scale-95"
              >
                Añadir al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
