import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { GeneratingState } from '@/components/LoadingSpinner';
import { SaveButton } from '@/components/history/SaveButton';
import { ToneSelector, ToneType } from '@/components/ToneSelector';
import { RegenerateButton } from '@/components/RegenerateButton';
import { Sparkles, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface KeywordResult {
  keyword: string;
  volume: string;
  difficulty: string;
}

const difficultyColors: Record<string, string> = {
  Low: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  High: 'bg-red-500/10 text-red-600 dark:text-red-400',
  Easy: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Hard: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

const volumeColors: Record<string, string> = {
  Low: 'bg-muted text-muted-foreground',
  Medium: 'bg-primary/10 text-primary',
  High: 'bg-primary/20 text-primary',
  'Very High': 'bg-primary/30 text-primary font-medium',
};

const KeywordTableSkeleton = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <Skeleton className="h-6 w-40" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted/30 p-3 border-b">
        <div className="flex gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="p-3 border-b last:border-0">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SEOKeywords = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState<KeywordResult[] | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-seo', {
        body: { topic, tone },
      });

      if (error) {
        throw error;
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Handle the keywords response
      let parsedKeywords: KeywordResult[];
      
      if (Array.isArray(data.keywords)) {
        parsedKeywords = data.keywords.map((k: { keyword?: string; volume?: string; difficulty?: string }) => ({
          keyword: k.keyword || '',
          volume: k.volume || 'Medium',
          difficulty: k.difficulty || 'Medium',
        }));
      } else {
        // Fallback if response is not in expected format
        parsedKeywords = [{ keyword: String(data.keywords), volume: 'Medium', difficulty: 'Medium' }];
      }

      setKeywords(parsedKeywords);
      
      toast({
        title: 'Generated!',
        description: 'Your SEO keywords are ready.',
      });
    } catch (error) {
      console.error('Error generating keywords:', error);
      toast({
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate keywords. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!topic.trim()) return;
    await handleGenerate();
  };

  const handleCopyAll = async () => {
    if (!keywords) return;
    const text = keywords.map(k => k.keyword).join(', ');
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast({
      title: 'Copied!',
      description: 'All keywords copied to clipboard.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const keywordsAsString = keywords 
    ? keywords.map(k => `${k.keyword} (Volume: ${k.volume}, Difficulty: ${k.difficulty})`).join('\n')
    : '';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            SEO Keyword Generator
          </CardTitle>
          <CardDescription>
            Enter your topic or business niche to discover high-impact keywords for your content strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic or business niche</Label>
            <Input
              id="topic"
              placeholder="Example: beachfront hotel in Hikkaduwa with ocean views and water sports"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              disabled={isGenerating}
            />
            <p className="text-xs text-muted-foreground">
              Include location and specific features for more targeted keyword suggestions.
            </p>
          </div>

          <ToneSelector value={tone} onValueChange={setTone} disabled={isGenerating} />

          <div className="flex flex-wrap gap-3">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Generate Keywords
                </>
              )}
            </Button>
            {keywords && !isGenerating && (
              <RegenerateButton
                onClick={handleRegenerate}
                isLoading={isGenerating}
                disabled={!topic.trim()}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State with Skeleton */}
      {isGenerating && (
        <Card>
          <CardContent className="pt-6">
            {!keywords ? (
              <GeneratingState />
            ) : (
              <KeywordTableSkeleton />
            )}
          </CardContent>
        </Card>
      )}

      {/* Output Section */}
      {keywords && !isGenerating && (
        <Card className="animate-fade-in">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <CardTitle className="text-lg">Generated Keywords</CardTitle>
            <div className="flex items-center gap-2">
              <SaveButton
                toolType="seo"
                input={`Topic: ${topic}\nTone: ${tone}`}
                output={keywordsAsString}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyAll}
                className="gap-2"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy All
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Keyword</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Search Volume</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.map((item, index) => (
                    <tr 
                      key={index} 
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium">{item.keyword}</td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className={cn('font-normal', volumeColors[item.volume] || volumeColors.Medium)}>
                          {item.volume}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className={cn('font-normal', difficultyColors[item.difficulty] || difficultyColors.Medium)}>
                          {item.difficulty}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tags View */}
            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">Quick copy tags:</p>
              <div className="flex flex-wrap gap-2">
                {keywords.map((item, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(item.keyword);
                      toast({
                        title: 'Copied!',
                        description: `"${item.keyword}" copied to clipboard.`,
                      });
                    }}
                  >
                    {item.keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SEOKeywords;
