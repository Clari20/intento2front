
import React, { useState } from 'react';
import { api } from '../services/api';

interface CreateProductModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Laptop',
    price: 0,
    image_url: '',
    stock_quantity: 1,
    status: 'completed' as const
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.createItem(formData);
      setSuccess(true);
      // Notificar al usuario mediante alert como solicitó
      setTimeout(() => {
        alert("¡ÉXITO! El producto '" + formData.title + "' ha sido creado y ya está disponible en el servidor.");
        onSuccess();
        onClose();
      }, 500);
    } catch (error: any) {
      alert(`ERROR: No se pudo crear el producto. Detalle: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl animate-fadeIn">
        <div className="bg-slate-900 border border-emerald-500/30 p-12 rounded-[3rem] text-center space-y-6 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-4xl mx-auto shadow-lg shadow-emerald-500/20">
            ✓
          </div>
          <h2 className="text-3xl font-black text-white">¡PRODUCTO CREADO!</h2>
          <p className="text-slate-400">Sincronizando inventario con el servidor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-[3rem] shadow-2xl overflow-hidden animate-scaleIn relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors text-xl"
        >
          ✕
        </button>
        
        <div className="p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">Crear Nuevo Producto</h2>
            <p className="text-slate-500 font-medium">Completa la ficha técnica del dispositivo.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Nombre del Modelo</label>
                <input
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ej: ASUS ROG Zephyrus"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Precio Unitario (USD)</label>
                <input
                  required
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="2400"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Categoría</label>
                <select 
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>Laptop</option>
                  <option>Mobile</option>
                  <option>Tablet</option>
                  <option>Accesorio</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Unidades en Stock</label>
                <input
                  required
                  type="number"
                  className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({...formData, stock_quantity: Number(e.target.value)})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">URL de la Foto</label>
              <input
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://images.unsplash.com/..."
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">Especificaciones / Descripción</label>
              <textarea
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] resize-none"
                placeholder="Describe el hardware..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold transition-all"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                disabled={loading}
                className="flex-[2] py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-900/30"
              >
                {loading ? 'Subiendo al Servidor...' : 'Publicar Producto'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
