import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { HistoryItem, ToolType } from '@/contexts/HistoryContext';
import { ExportMenu } from './ExportMenu';
import { MessageSquare, Megaphone, Search, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ViewEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: HistoryItem | null;
  mode: 'view' | 'edit';
  onSave: (id: string, output: string) => Promise<void>;
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

export const ViewEditModal: React.FC<ViewEditModalProps> = ({
  open,
  onOpenChange,
  item,
  mode,
  onSave,
}) => {
  const [editedOutput, setEditedOutput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  React.useEffect(() => {
    if (item) {
      setEditedOutput(item.output);
      setIsEditing(mode === 'edit');
    }
  }, [item, mode]);

  if (!item) return null;

  const config = toolConfig[item.toolType];
  const Icon = config.icon;

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(item.id, editedOutput);
    setIsSaving(false);
    setIsEditing(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-border/50">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className={cn('p-2 rounded-lg', config.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="secondary" className={cn('font-normal', config.color)}>
              {config.label}
            </Badge>
          </div>
          <DialogTitle>{isEditing ? 'Edit Content' : 'View Content'}</DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Created {format(item.createdAt, 'MMMM d, yyyy • h:mm a')}
            {item.updatedAt > item.createdAt && (
              <span className="ml-2">• Updated {format(item.updatedAt, 'MMM d, h:mm a')}</span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Original Input
            </Label>
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              {item.input}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Generated Output
              </Label>
              <ExportMenu content={editedOutput} filename={`${item.toolType}-${item.id}`} />
            </div>
            {isEditing ? (
              <Textarea
                value={editedOutput}
                onChange={(e) => setEditedOutput(e.target.value)}
                className="min-h-[200px] font-mono text-sm"
              />
            ) : (
              <div className="p-3 rounded-lg bg-muted/50 text-sm whitespace-pre-wrap min-h-[100px]">
                {item.output}
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {!isEditing && mode === 'view' && (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
          {isEditing && (
            <>
              <Button variant="outline" onClick={() => {
                setEditedOutput(item.output);
                setIsEditing(false);
              }}>
                Cancel
              </Button>
              <Button 
                variant="gradient" 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </>
          )}
          {!isEditing && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
