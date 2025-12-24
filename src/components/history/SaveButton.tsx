import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, Check } from 'lucide-react';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { useHistory, ToolType } from '@/contexts/HistoryContext';
import { useToast } from '@/hooks/use-toast';

interface SaveButtonProps {
  toolType: ToolType;
  input: string;
  output: string;
  disabled?: boolean;
}

export const SaveButton: React.FC<SaveButtonProps> = ({
  toolType,
  input,
  output,
  disabled = false,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { addItem } = useHistory();
  const { toast } = useToast();

  const handleSave = async () => {
    if (!output || isSaving) return;
    
    setIsSaving(true);
    try {
      await addItem({ toolType, input, output });
      setIsSaved(true);
      toast({
        title: 'Saved!',
        description: 'Content saved to history.',
      });
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save content.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleSave}
      disabled={disabled || isSaving || !output}
      className="gap-2"
    >
      {isSaving ? (
        <>
          <LoadingSpinner size="sm" />
          Saving...
        </>
      ) : isSaved ? (
        <>
          <Check className="h-4 w-4 text-green-500" />
          Saved!
        </>
      ) : (
        <>
          <Bookmark className="h-4 w-4" />
          Save Result
        </>
      )}
    </Button>
  );
};
