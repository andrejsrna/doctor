import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEventHandler } from 'react'
import Link from 'next/link';

type CommonProps = {
  href?: string
  target?: string
  rel?: string
  variant?: 'toxic' | 'infected' | 'decayed'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
  onClick?: MouseEventHandler<HTMLElement>
}

type ButtonAsButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined }
type ButtonAsLinkProps = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }
type ButtonProps = ButtonAsButtonProps | ButtonAsLinkProps

export default function Button({
  children,
  href,
  variant = 'toxic',
  size = 'md',
  className = '',
  target,
  rel,
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

   if (href) {
     const isExternal =
       href.startsWith('http://') ||
       href.startsWith('https://') ||
       href.startsWith('mailto:') ||
       href.startsWith('tel:')

     if (isExternal) {
       return (
         <a
           href={href}
           className={buttonStyles}
           target={target}
           rel={rel}
           {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}
         >
           <span className="relative z-10 flex items-center gap-2">{children}</span>
         </a>
       )
     }
     return (
       <Link
         href={href}
         className={buttonStyles}
         target={target}
         rel={rel}
         onClick={(props as AnchorHTMLAttributes<HTMLAnchorElement>).onClick}
       >
         <span className="relative z-10 flex items-center gap-2">{children}</span>
       </Link>
     );
   }

   return (
     <button className={buttonStyles} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>
       <span className="relative z-10 flex items-center gap-2">{children}</span>
     </button>
   );
} 
