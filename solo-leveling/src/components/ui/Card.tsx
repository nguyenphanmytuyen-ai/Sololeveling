import React, { useEffect, useRef } from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'surface' | 'elevated' | 'glow' | 'gold' | 'interactive';
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  variant = 'surface',
  children,
  className = '',
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const lit = variant === 'interactive' || variant === 'glow' || variant === 'gold';
  useEffect(() => {
    const card = cardRef.current;
    if (!card || !lit) return;
    const media = window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
    let frame = 0;
    let x = 0, y = 0, targetX = 0, targetY = 0;
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      card.removeAttribute('data-lit');
    };
    const tick = () => {
      x += (targetX - x) * .16;
      y += (targetY - y) * .16;
      card.style.setProperty('--light-x', `${x}px`);
      card.style.setProperty('--light-y', `${y}px`);
      frame = Math.abs(targetX - x) + Math.abs(targetY - y) > .5 ? requestAnimationFrame(tick) : 0;
    };
    const move = (event: PointerEvent) => {
      if (!media.matches || event.pointerType !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      targetX = event.clientX - rect.left;
      targetY = event.clientY - rect.top;
      if (!card.hasAttribute('data-lit')) { x = targetX; y = targetY; }
      card.setAttribute('data-lit', 'true');
      if (!frame) frame = requestAnimationFrame(tick);
    };
    card.addEventListener('pointermove', move, { passive: true });
    card.addEventListener('pointerleave', stop);
    media.addEventListener('change', stop);
    return () => {
      stop();
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerleave', stop);
      media.removeEventListener('change', stop);
    };
  }, [lit]);
  const baseStyles = 'ui-card relative min-w-0 border transition-all duration-200';

  const variantStyles = {
    surface: 'bg-[#161B40]/80 border-slate-700/50 backdrop-blur-sm shadow-xl',
    elevated: 'bg-[#1F2656] border-slate-600/60 shadow-2xl',
    glow: 'bg-[#161B40]/90 border-violet-500/40 rpg-border-glow shadow-violet-950/40',
    gold: 'bg-gradient-to-b from-[#2A1D0B] to-[#161B40] border-amber-400/60 rpg-border-gold shadow-amber-950/30',
    interactive:
      'bg-[#161B40]/80 border-slate-700/50 hover:border-violet-500/60 hover:bg-[#1A204C] cursor-pointer shadow-lg hover:shadow-violet-950/30 hover:-translate-y-0.5',
  };

  return (
    <div ref={cardRef} data-surface={variant} className={`${baseStyles} ${variantStyles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};
