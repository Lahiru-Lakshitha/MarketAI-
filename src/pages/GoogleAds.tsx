import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OutputCard } from '@/components/OutputCard';
import { GeneratingState, OutputSkeleton } from '@/components/LoadingSpinner';
import { SaveButton } from '@/components/history/SaveButton';
import { ToneSelector, ToneType } from '@/components/ToneSelector';
import { RegenerateButton } from '@/components/RegenerateButton';
import { Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const GoogleAds = () => {
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ headlines: string[]; descriptions: string[] } | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!productDescription.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-ads', {
        body: { productDescription, targetAudience, tone },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Parse the ad copy from the response
      const adCopyText = data.adCopy;
      
      // Extract headlines
      const headlinesMatch = adCopyText.match(/HEADLINES?:?\s*([\s\S]*?)(?=DESCRIPTIONS?:|$)/i);
      const descriptionsMatch = adCopyText.match(/DESCRIPTIONS?:?\s*([\s\S]*?)$/i);

      const headlines = headlinesMatch
        ? headlinesMatch[1]
            .split(/\d+\.\s+/)
            .filter((h: string) => h.trim())
            .map((h: string) => h.trim().replace(/\n/g, ''))
        : [];

      const descriptions = descriptionsMatch
        ? descriptionsMatch[1]
            .split(/\d+\.\s+/)
            .filter((d: string) => d.trim())
            .map((d: string) => d.trim().replace(/\n/g, ''))
        : [];

      setResult({
        headlines: headlines.length > 0 ? headlines : ['Generated headline'],
        descriptions: descriptions.length > 0 ? descriptions : ['Generated description'],
      });
      
      toast({
        title: 'Generated!',
        description: 'Your Google Ads copy is ready.',
      });
    } catch (error) {
      console.error('Error generating ads:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate ad copy. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!productDescription.trim()) return;
    await handleGenerate();
  };

  const resultAsString = result 
    ? `HEADLINES:\n${result.headlines.join('\n')}\n\nDESCRIPTIONS:\n${result.descriptions.join('\n\n')}`
    : '';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Google Ads Copy Generator
          </CardTitle>
          <CardDescription>
            Generate compelling ad headlines and descriptions optimized for Google Ads campaigns.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="product">Product or service description</Label>
            <Textarea
              id="product"
              placeholder="Example: Online digital marketing course for beginners in Sri Lanka with practical projects and certification"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="min-h-[120px]"
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Include key features, benefits, and unique selling points for better results.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Target audience (optional)</Label>
            <Input
              id="audience"
              placeholder="Example: Small business owners, marketing managers, startups"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              disabled={isGenerating}
            />
          </div>

          <ToneSelector value={tone} onValueChange={setTone} disabled={isGenerating} />

          <div className="flex flex-wrap gap-3">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleGenerate}
              disabled={!productDescription.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Ad Copy
                </>
              )}
            </Button>
            {result && !isGenerating && (
              <RegenerateButton
                onClick={handleRegenerate}
                isLoading={isGenerating}
                disabled={!productDescription.trim()}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State with Skeleton */}
      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            {!result ? (
              <GeneratingState />
            ) : (
              <OutputSkeleton />
            )}
          </CardContent>
        </Card>
      )}

      {/* Output Section */}
      {result && !isGenerating && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex justify-end">
            <SaveButton
              toolType="ads"
              input={`Product: ${productDescription}${targetAudience ? `\nAudience: ${targetAudience}` : ''}\nTone: ${tone}`}
              output={resultAsString}
            />
          </div>
          <OutputCard
            title="Headlines (Max 30 characters each)"
            content={result.headlines}
          />
          <OutputCard
            title="Descriptions (Max 90 characters each)"
            content={result.descriptions}
          />
        </div>
      )}
    </div>
  );
};

export default GoogleAds;
