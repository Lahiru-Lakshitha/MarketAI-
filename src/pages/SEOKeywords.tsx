import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { GeneratingState } from '@/components/LoadingSpinner';
import { SaveButton } from '@/components/history/SaveButton';
import { ToneSelector, ToneType } from '@/components/ToneSelector';
import { RegenerateButton } from '@/components/RegenerateButton';
import { CopyButton } from '@/components/CopyButton';
import { Sparkles, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KeywordResult {
  keyword: string;
  volume: string;
  difficulty: string;
}

const mockKeywords: Record<ToneType, KeywordResult[]> = {
  professional: [
    { keyword: 'enterprise solutions', volume: 'High', difficulty: 'High' },
    { keyword: 'business consulting services', volume: 'High', difficulty: 'Medium' },
    { keyword: 'corporate strategy planning', volume: 'Medium', difficulty: 'Medium' },
    { keyword: 'professional development programs', volume: 'Medium', difficulty: 'Low' },
    { keyword: 'executive coaching', volume: 'Medium', difficulty: 'Medium' },
    { keyword: 'B2B service provider', volume: 'High', difficulty: 'High' },
  ],
  friendly: [
    { keyword: 'helpful tips and tricks', volume: 'High', difficulty: 'Low' },
    { keyword: 'beginner friendly guide', volume: 'Very High', difficulty: 'Low' },
    { keyword: 'easy step by step', volume: 'High', difficulty: 'Low' },
    { keyword: 'community support forum', volume: 'Medium', difficulty: 'Low' },
    { keyword: 'how to get started', volume: 'Very High', difficulty: 'Medium' },
    { keyword: 'simple solutions for', volume: 'Medium', difficulty: 'Low' },
  ],
  sales: [
    { keyword: 'best deals online', volume: 'Very High', difficulty: 'High' },
    { keyword: 'limited time offer', volume: 'High', difficulty: 'Medium' },
    { keyword: 'discount code today', volume: 'Very High', difficulty: 'Medium' },
    { keyword: 'buy now save big', volume: 'High', difficulty: 'Medium' },
    { keyword: 'exclusive sale event', volume: 'Medium', difficulty: 'Low' },
    { keyword: 'special promotion', volume: 'High', difficulty: 'Medium' },
  ],
  creative: [
    { keyword: 'innovative design ideas', volume: 'Medium', difficulty: 'Low' },
    { keyword: 'unique creative solutions', volume: 'Medium', difficulty: 'Medium' },
    { keyword: 'artistic inspiration gallery', volume: 'Medium', difficulty: 'Low' },
    { keyword: 'custom creative services', volume: 'Medium', difficulty: 'Medium' },
    { keyword: 'original content creation', volume: 'High', difficulty: 'Medium' },
    { keyword: 'creative portfolio examples', volume: 'Medium', difficulty: 'Low' },
  ],
  casual: [
    { keyword: 'cool things to try', volume: 'High', difficulty: 'Low' },
    { keyword: 'fun ideas for', volume: 'Very High', difficulty: 'Low' },
    { keyword: 'quick tips for beginners', volume: 'High', difficulty: 'Low' },
    { keyword: 'easy ways to', volume: 'Very High', difficulty: 'Medium' },
    { keyword: 'simple hacks for', volume: 'High', difficulty: 'Low' },
    { keyword: 'everyday solutions', volume: 'Medium', difficulty: 'Low' },
  ],
};

const difficultyColors: Record<string, string> = {
  Low: 'bg-green-500/10 text-green-600 dark:text-green-400',
  Medium: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  High: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

const volumeColors: Record<string, string> = {
  Low: 'bg-muted text-muted-foreground',
  Medium: 'bg-primary/10 text-primary',
  High: 'bg-primary/20 text-primary',
  'Very High': 'bg-primary/30 text-primary font-medium',
};

const SEOKeywords = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState<KeywordResult[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setKeywords(mockKeywords[tone] || mockKeywords.professional);
    setIsGenerating(false);
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
            />
            <p className="text-xs text-muted-foreground">
              Include location and specific features for more targeted keyword suggestions.
            </p>
          </div>

          <ToneSelector value={tone} onValueChange={setTone} />

          <div className="flex flex-wrap gap-3">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleGenerate}
              disabled={!topic.trim() || isGenerating}
            >
              <Sparkles className="h-4 w-4" />
              Generate Keywords
            </Button>
            {keywords && (
              <RegenerateButton
                onClick={handleRegenerate}
                isLoading={isGenerating}
                disabled={!topic.trim()}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isGenerating && !keywords && (
        <Card>
          <CardContent className="pt-6">
            <GeneratingState />
          </CardContent>
        </Card>
      )}

      {/* Output Section */}
      {keywords && !isGenerating && (
        <Card className="animate-slide-up">
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
                        <Badge variant="secondary" className={cn('font-normal', volumeColors[item.volume])}>
                          {item.volume}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="secondary" className={cn('font-normal', difficultyColors[item.difficulty])}>
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
                    onClick={() => navigator.clipboard.writeText(item.keyword)}
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
