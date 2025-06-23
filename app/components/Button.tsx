import { ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: 'toxic' | 'infected' | 'decayed';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Button({
  children,
  href,
  variant = 'toxic',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  // Generate unique IDs for filters to avoid conflicts when multiple buttons are present
  const uniqueId = Math.random().toString(36).substring(7);
  const noiseId = `noise-${uniqueId}`;
  const glowId = `glow-${uniqueId}`;
  
  const baseStyles = 'relative inline-flex items-center justify-center font-bold overflow-hidden';
  
  const variants = {
    toxic: {
      background: 'from-green-900/80 via-green-700/80 to-green-900/80',
      text: 'text-green-300',
      glow: 'rgba(0, 255, 0, 0.3)'
    },
    infected: {
      background: 'from-purple-900/80 via-purple-700/80 to-purple-900/80',
      text: 'text-purple-300',
      glow: 'rgba(255, 0, 255, 0.3)'
    },
    decayed: {
      background: 'from-yellow-900/80 via-yellow-700/80 to-yellow-900/80',
      text: 'text-yellow-300',
      glow: 'rgba(255, 255, 0, 0.3)'
    }
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm min-w-[120px]',
    md: 'px-6 py-3 text-base min-w-[160px]',
    lg: 'px-8 py-4 text-lg min-w-[200px]'
  };

  const buttonStyles = `
    ${baseStyles} 
    bg-gradient-to-r ${variants[variant].background}
    ${variants[variant].text}
    ${sizes[size]} 
    ${className}
    rounded-lg
  `.replace(/\s+/g, ' ').trim();

  const ButtonContent = () => (
    <>
      {/* Base SVG with filters */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <filter id={noiseId}>
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" />
            <feDisplacementMap in="SourceGraphic" scale="2" />
          </filter>
          <radialGradient id={glowId}>
            <stop offset="0%" stopColor={variants[variant].glow} />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>
        
        {/* Grotesque border */}
        <motion.path
          d="M5,20 Q10,5 25,5 T45,5 Q60,5 65,20 T85,35 Q95,50 85,65 T65,80 Q60,95 45,95 T25,95 Q10,95 5,80 T5,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 2"
          filter={`url(#${noiseId})`}
          animate={{
            d: [
              "M5,20 Q10,5 25,5 T45,5 Q60,5 65,20 T85,35 Q95,50 85,65 T65,80 Q60,95 45,95 T25,95 Q10,95 5,80 T5,20",
              "M5,25 Q15,5 25,10 T45,5 Q65,5 70,25 T85,40 Q90,50 85,60 T65,75 Q55,90 45,90 T25,90 Q10,90 5,75 T5,25"
            ]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glowing background */}
        <motion.circle
          cx="50%"
          cy="50%"
          r="40%"
          fill={`url(#${glowId})`}
          animate={{
            r: ['40%', '45%', '40%'],
            filter: ['blur(10px)', 'blur(15px)', 'blur(10px)']
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      </svg>

      {/* Content */}
      <motion.span 
        className="relative z-10 flex items-center gap-2"
        animate={{
          textShadow: [
            '0 0 8px currentColor',
            '0 0 12px currentColor',
            '0 0 8px currentColor'
          ]
        }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {children}
      </motion.span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonStyles}>
        <ButtonContent />
      </Link>
    );
  }

  return (
    <button className={buttonStyles} {...props}>
      <ButtonContent />
    </button>
  );
} 