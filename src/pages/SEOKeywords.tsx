import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { GeneratingState } from '@/components/LoadingSpinner';
import { SaveButton } from '@/components/history/SaveButton';
import { Sparkles, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockKeywords = [
  { keyword: 'digital marketing services', volume: 'High', difficulty: 'Medium' },
  { keyword: 'online marketing strategy', volume: 'High', difficulty: 'High' },
  { keyword: 'social media marketing', volume: 'Very High', difficulty: 'High' },
  { keyword: 'content marketing tips', volume: 'Medium', difficulty: 'Low' },
  { keyword: 'SEO best practices', volume: 'High', difficulty: 'Medium' },
  { keyword: 'email marketing automation', volume: 'Medium', difficulty: 'Medium' },
  { keyword: 'PPC advertising', volume: 'Medium', difficulty: 'High' },
  { keyword: 'marketing analytics tools', volume: 'Medium', difficulty: 'Low' },
  { keyword: 'brand awareness campaign', volume: 'Medium', difficulty: 'Medium' },
  { keyword: 'lead generation strategies', volume: 'High', difficulty: 'Medium' },
  { keyword: 'conversion optimization', volume: 'Medium', difficulty: 'Low' },
  { keyword: 'marketing ROI calculator', volume: 'Low', difficulty: 'Low' },
];

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [keywords, setKeywords] = useState<typeof mockKeywords | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setIsGenerating(true);
    setKeywords(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setKeywords(mockKeywords);
    setIsGenerating(false);
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
              placeholder="E.g., Digital marketing agency, Organic skincare products, SaaS project management..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <Button
            variant="gradient"
            size="lg"
            onClick={handleGenerate}
            disabled={!topic.trim() || isGenerating}
            className="w-full md:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            Generate Keywords
          </Button>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isGenerating && (
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
                input={`Topic: ${topic}`}
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
