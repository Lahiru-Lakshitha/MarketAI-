import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Megaphone, Search, Eye, Pencil, Trash2, Clock } from 'lucide-react';
import { HistoryItem, ToolType } from '@/contexts/HistoryContext';
import { ExportMenu } from './ExportMenu';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface HistoryCardProps {
  item: HistoryItem;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const toolConfig: Record<ToolType, { icon: React.ElementType; label: string; color: string }> = {
  social: { 
    icon: MessageSquare, 
    label: 'Social Captions',
    color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
  },
  ads: { 
    icon: Megaphone, 
    label: 'Google Ads',
    color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
  },
  seo: { 
    icon: Search, 
    label: 'SEO Keywords',
    color: 'bg-green-500/10 text-green-600 dark:text-green-400'
  },
};

export const HistoryCard: React.FC<HistoryCardProps> = ({
  item,
  onView,
  onEdit,
  onDelete,
}) => {
  const config = toolConfig[item.toolType];
  const Icon = config.icon;
  
  const previewText = item.output.length > 150 
    ? item.output.substring(0, 150) + '...'
    : item.output;

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg', config.color)}>
              <Icon className="h-4 w-4" />
            </div>
            <div>
              <Badge variant="secondary" className={cn('font-normal', config.color)}>
                {config.label}
              </Badge>
              <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {format(item.createdAt, 'MMM d, yyyy • h:mm a')}
              </div>
            </div>
          </div>
          <ExportMenu content={item.output} filename={`${item.toolType}-${item.id}`} />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Input</p>
          <p className="text-sm text-foreground/80 line-clamp-2">{item.input}</p>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Output Preview</p>
          <p className="text-sm text-foreground line-clamp-3">{previewText}</p>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onView} className="gap-2">
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={onEdit} className="gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDelete}
            className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
