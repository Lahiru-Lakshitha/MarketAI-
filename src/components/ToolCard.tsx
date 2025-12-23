import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  path: string;
  gradient?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({
  title,
  description,
  icon: Icon,
  path,
  gradient = false,
}) => {
  const navigate = useNavigate();

  return (
    <Card className={cn(
      'group hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden',
      gradient && 'hover:shadow-glow'
    )}
    onClick={() => navigate(path)}
    >
      <CardHeader className="pb-3">
        <div className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110',
          gradient ? 'gradient-primary' : 'bg-primary/10'
        )}>
          <Icon className={cn(
            'h-6 w-6',
            gradient ? 'text-primary-foreground' : 'text-primary'
          )} />
        </div>
        <CardTitle className="text-lg group-hover:text-primary transition-colors">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
          Open Tool
        </Button>
      </CardContent>
    </Card>
  );
};
