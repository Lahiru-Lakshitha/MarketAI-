import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { OutputCard } from '@/components/OutputCard';
import { GeneratingState, OutputSkeleton } from '@/components/LoadingSpinner';
import { SaveButton } from '@/components/history/SaveButton';
import { ToneSelector, ToneType } from '@/components/ToneSelector';
import { RegenerateButton } from '@/components/RegenerateButton';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const SocialMedia = () => {
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState<ToneType>('friendly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState<string[] | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-captions', {
        body: { description, tone },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Parse the captions from the response
      const captionsText = data.captions;
      const parsedCaptions = captionsText
        .split(/\d+\.\s+/)
        .filter((c: string) => c.trim())
        .map((c: string) => c.trim());

      setCaptions(parsedCaptions.length > 0 ? parsedCaptions : [captionsText]);
      
      toast({
        title: 'Generated!',
        description: 'Your social media captions are ready.',
      });
    } catch (error) {
      console.error('Error generating captions:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate captions. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!description.trim()) return;
    await handleGenerate();
  };

  const captionsAsString = captions?.join('\n\n---\n\n') || '';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Social Media Caption Generator
          </CardTitle>
          <CardDescription>
            Describe your product, service, or content and we'll generate engaging captions for your social media posts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="description">What do you want to promote?</Label>
            <Textarea
              id="description"
              placeholder="Example: Promote a new coffee shop opening in Colombo with a cozy ambiance and specialty drinks"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Be specific about your product, audience, and key message for best results.
            </p>
          </div>

          <ToneSelector value={tone} onValueChange={setTone} disabled={isGenerating} />

          <div className="flex flex-wrap gap-3">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleGenerate}
              disabled={!description.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Captions
                </>
              )}
            </Button>
            {captions && !isGenerating && (
              <RegenerateButton
                onClick={handleRegenerate}
                isLoading={isGenerating}
                disabled={!description.trim()}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State with Skeleton */}
      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            {!captions ? (
              <GeneratingState />
            ) : (
              <OutputSkeleton />
            )}
          </CardContent>
        </Card>
      )}

      {/* Output Section */}
      {captions && !isGenerating && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-end">
            <SaveButton
              toolType="social"
              input={`Topic: ${description}\nTone: ${tone}`}
              output={captionsAsString}
            />
          </div>
          <OutputCard
            title="Generated Captions"
            content={captions}
          />
        </div>
      )}
    </div>
  );
};

export default SocialMedia;
