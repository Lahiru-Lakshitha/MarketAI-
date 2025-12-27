import { Loader2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', className }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <Loader2 className={cn('animate-spin text-primary', sizes[size], className)} />
  );
};

export const LoadingSkeleton: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div className={cn(
      'animate-pulse rounded-lg bg-muted',
      className
    )} />
  );
};

export const GeneratingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full gradient-primary opacity-20 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary animate-pulse" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-foreground font-medium">AI is generating content...</p>
        <p className="text-sm text-muted-foreground">This may take a few seconds</p>
      </div>
    </div>
  );
};

export const OutputSkeleton: React.FC = () => {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
      <div className="space-y-3 p-4 rounded-lg border border-border/50 bg-muted/30">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[90%]" />
        <Skeleton className="h-4 w-[75%]" />
        <div className="h-4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-[85%]" />
        <Skeleton className="h-4 w-[60%]" />
      </div>
    </div>
  );
};

export const HistoryCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-lg border border-border/50 bg-card p-6 space-y-4 animate-pulse">
      <div className="flex items-start gap-4">
        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
};
