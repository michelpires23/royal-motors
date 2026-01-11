
import React, { useState, useEffect } from 'react';
import { Car } from '../types';
import { Gauge, Fuel, Settings2, Maximize2, Edit3, Trash2 } from 'lucide-react';

interface CarCardProps {
  car: Car;
  onImageClick: (car: Car) => void;
  isAdmin?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const CarCard: React.FC<CarCardProps> = ({ car, onImageClick, isAdmin, onEdit, onDelete }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = car.gallery && car.gallery.length > 0 ? car.gallery : [car.imageUrl];

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [images.length]);

  const formatPrice = (value: number) => {
    try {
      return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }).replace('R$', 'R$ ');
    } catch (e) {
      return `R$ ${value}`;
    }
  };

  return (
    <div className="bg-white overflow-hidden shadow-xl group hover:shadow-2xl transition-all duration-300 border border-gray-100 flex flex-col h-full rounded-xl relative">
      {/* Admin Quick Actions */}
      {isAdmin && (
        <div className="absolute top-2 right-2 z-20 flex gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
            className="p-2 bg-white/90 text-blue-600 rounded-full shadow-lg hover:bg-blue-600 hover:text-white transition-all"
            title="Editar Veículo"
          >
            <Edit3 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
            className="p-2 bg-white/90 text-red-600 rounded-full shadow-lg hover:bg-red-600 hover:text-white transition-all"
            title="Remover Veículo"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}

      {/* Image Container */}
      <div 
        className="relative aspect-video overflow-hidden cursor-pointer bg-zinc-900"
        onClick={() => onImageClick(car)}
      >
        {images.map((src, index) => (
          <img 
            key={`${src}-${index}`}
            src={src} 
            alt={`${car.brand} ${car.model}`}
            onError={(e) => {
              e.currentTarget.src = 'https://placehold.co/600x400?text=Imagem+N%C3%A3o+Dispon%C3%ADvel';
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-110 ${
              index === currentImageIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
          />
        ))}
        
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
          <Maximize2 size={32} className="text-white drop-shadow-lg scale-50 group-hover:scale-100 transition-transform duration-500" />
        </div>
        
        {car.isNew && (
          <div className="absolute top-4 left-4 bg-green-500 text-white text-[10px] font-black px-3 py-1 uppercase rounded-md shadow-lg tracking-widest z-20">
            Novo
          </div>
        )}
        
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {images.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1 rounded-full transition-all duration-500 ${
                  idx === currentImageIndex 
                    ? 'bg-[#D4AF37] w-6 shadow-[0_0_8px_rgba(212,175,55,0.6)]' 
                    : 'bg-white/40 w-1.5'
                }`} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow bg-white">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <span className="text-[10px] text-[#D4AF37] font-black uppercase tracking-widest block mb-1">{car.brand}</span>
            <h3 className="text-gray-900 font-black text-sm uppercase leading-tight line-clamp-2 min-h-[2.5rem] pr-2 italic">
              {car.model}
            </h3>
            <p className="text-[10px] text-gray-400 font-bold mt-1 tracking-widest">{car.year}</p>
          </div>
          
          <div className="flex flex-col items-end">
            {car.oldPrice && (
              <span className="text-[10px] text-gray-400 line-through mb-1 font-bold">
                {formatPrice(car.oldPrice)}
              </span>
            )}
            <div className="bg-[#D4AF37] text-white font-black text-xs px-4 py-2 flex items-center justify-center whitespace-nowrap transform skew-x-[-12deg] shadow-lg shadow-[#D4AF37]/20 border-r-2 border-white/20">
               <span className="transform skew-x-[12deg] tracking-tighter">{formatPrice(car.price)}</span>
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="mt-auto grid grid-cols-3 gap-3 pt-5 border-t border-gray-100">
          <div className="flex flex-col items-center justify-center gap-1.5 text-[9px] text-gray-400 uppercase font-black tracking-tighter">
            <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-[#D4AF37]/10 transition-colors">
              <Gauge size={14} className="text-[#D4AF37]" />
            </div>
            <span>{car.km?.toLocaleString() || 0} KM</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 text-[9px] text-gray-400 uppercase font-black tracking-tighter">
            <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-[#D4AF37]/10 transition-colors">
              <Fuel size={14} className="text-[#D4AF37]" />
            </div>
            <span>{car.fuel || 'Flex'}</span>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 text-[9px] text-gray-400 uppercase font-black tracking-tighter text-center">
            <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-[#D4AF37]/10 transition-colors">
              <Settings2 size={14} className="text-[#D4AF37]" />
            </div>
            <span className="truncate w-full">{car.transmission || 'Automático'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
