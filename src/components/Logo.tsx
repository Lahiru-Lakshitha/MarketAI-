import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true, className }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="gradient-primary p-2 rounded-xl shadow-soft">
        <Sparkles className={cn(iconSizes[size], 'text-primary-foreground')} />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn(textSizes[size], 'font-bold text-foreground leading-tight')}>
            MarketAI
          </span>
          <span className="text-xs text-muted-foreground font-medium">
            Digital Assistant
          </span>
        </div>
      )}
    </div>
  );
};
