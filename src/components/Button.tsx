import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label: string;
}

export const Button: React.FC<ButtonProps> = ({ 
  icon, 
  label, 
  className = '', 
  ...props 
}) => {
  return (
    <button 
      className={`
        relative group overflow-hidden h-14 rounded-xl transition-all duration-300 active:scale-[0.97]
        bg-gradient-to-b from-[#1a1a1a] to-[#0a0a0a]
        border border-white/5 border-t-white/10
        shadow-[0_4px_15px_rgba(0,0,0,0.5)]
        ${className}
      `} 
      {...props}
    >
      {/* Inner Glow/Shine */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Hover Light Stripe */}
      <div className="absolute -inset-full top-0 block w-1/2 h-full -skew-x-12 bg-gradient-to-r from-transparent via-white/[0.05] to-transparent group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />

      <div className="relative flex items-center justify-center gap-3 px-4 text-sm font-medium tracking-tight text-white/80 group-hover:text-white transition-colors">
        {icon && <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>}
        {label}
      </div>
      
      {/* Border effect on hover */}
      <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-xl transition-all duration-300" />
    </button>
  );
};