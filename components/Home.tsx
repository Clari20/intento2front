
import React from 'react';
import { View } from '../types';

interface HomeProps {
  setView: (view: View) => void;
}

const Home: React.FC<HomeProps> = ({ setView }) => {
  return (
    <div className="space-y-20 animate-fadeIn">
      {/* Hero High-Tech */}
      <section className="relative py-28 px-8 text-center overflow-hidden rounded-[2.5rem] bg-slate-900 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent opacity-60"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-8">
          <div className="inline-block px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest">
            Hardware de Última Generación 2025
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tighter">
            Potencia tu <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-400 to-blue-500">Creatividad</span>
          </h1>
          <p className="text-xl text-slate-400 font-medium max-w-2xl mx-auto">
            Desde estaciones de trabajo hasta dispositivos móviles. TechStore ofrece lo mejor del mercado tecnológico con garantía internacional.
          </p>
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <button 
              onClick={() => setView('shop')}
              className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black text-lg transition-all hover:scale-105 shadow-2xl shadow-white/10 active:scale-95"
            >
              Comprar Ahora
            </button>
            <button 
              onClick={() => setView('dashboard')}
              className="px-10 py-5 bg-slate-800/80 hover:bg-slate-700 text-white border border-slate-700 rounded-2xl font-bold transition-all backdrop-blur-md"
            >
              Panel Admin
            </button>
          </div>
        </div>
      </section>

      {/* Categorías Tech */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Laptops Pro', count: '45+ Modelos', icon: '💻', color: 'from-blue-600' },
          { title: 'Mobile Ultra', count: '30+ Modelos', icon: '📱', color: 'from-emerald-600' },
          { title: 'Periféricos', count: '100+ Modelos', icon: '⌨️', color: 'from-purple-600' }
        ].map((cat, i) => (
          <div key={i} className="group relative overflow-hidden p-8 rounded-[2rem] bg-slate-900 border border-slate-800 hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => setView('shop')}>
             <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat.color} to-transparent opacity-10 group-hover:opacity-20 transition-opacity`}></div>
            <div className="text-5xl mb-6">{cat.icon}</div>
            <h3 className="text-2xl font-black text-white mb-1">{cat.title}</h3>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest">{cat.count}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Home;
