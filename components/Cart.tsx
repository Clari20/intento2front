
import React from 'react';
import { CartItem } from '../types';

interface CartProps {
  cart: CartItem[];
  updateQuantity: (id: number, delta: number) => void;
  removeFromCart: (id: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, updateQuantity, removeFromCart, onCheckout }) => {
  const total = cart.reduce((acc, item) => acc + (item.price || 500) * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-6 animate-fadeIn">
        <div className="text-8xl">🛒</div>
        <h2 className="text-3xl font-black text-white">Tu carrito está vacío</h2>
        <p className="text-slate-500">¿Buscas algo de potencia tecnológica? Explora nuestra tienda.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fadeIn">
      <h2 className="text-5xl font-black text-white tracking-tighter">Tu Carrito</h2>
      
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-800 p-6 rounded-3xl flex items-center gap-6">
            <div className="w-20 h-20 bg-slate-950 rounded-2xl flex items-center justify-center text-3xl">
              {item.category === 'Laptop' ? '💻' : '📱'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="text-slate-500 text-sm font-medium">{item.category}</p>
            </div>
            <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
              <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 hover:bg-slate-800 rounded-lg text-white">-</button>
              <span className="px-4 font-bold text-white">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 hover:bg-slate-800 rounded-lg text-white">+</button>
            </div>
            <div className="text-right min-w-[100px]">
              <p className="text-2xl font-black text-white">${(item.price || 500) * item.quantity}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-xs font-bold hover:underline mt-1">Eliminar</button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-slate-900 border-t-4 border-blue-600 p-10 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Total a Pagar</p>
          <p className="text-6xl font-black text-white mt-1">${total}</p>
        </div>
        <button 
          onClick={onCheckout}
          className="w-full md:w-auto px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-blue-900/40 transform active:scale-95"
        >
          Finalizar Compra ⚡
        </button>
      </div>
    </div>
  );
};

export default Cart;
