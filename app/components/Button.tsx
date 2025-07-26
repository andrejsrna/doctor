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
  const baseStyles = 'relative inline-flex items-center justify-center font-bold overflow-hidden';
  
  const variants = {
    toxic: {
      background: 'from-green-900/80 via-green-700/80 to-green-900/80',
      text: 'text-green-300',
    },
    infected: {
      background: 'from-purple-900/80 via-purple-700/80 to-purple-900/80',
      text: 'text-purple-300',
    },
    decayed: {
      background: 'from-yellow-900/80 via-yellow-700/80 to-yellow-900/80',
      text: 'text-yellow-300',
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
    <motion.span 
      className="relative z-10 flex items-center gap-2"
    >
      {children}
    </motion.span>
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