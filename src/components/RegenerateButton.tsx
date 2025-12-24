import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegenerateButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const RegenerateButton: React.FC<RegenerateButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  className,
}) => {
  return (
    <Button
      variant="outline"
      size="lg"
      onClick={onClick}
      disabled={disabled || isLoading}
      className={cn('gap-2', className)}
    >
      <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
      {isLoading ? 'Regenerating…' : 'Regenerate'}
    </Button>
  );
};
