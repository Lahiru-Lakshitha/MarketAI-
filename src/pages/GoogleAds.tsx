import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OutputCard } from '@/components/OutputCard';
import { GeneratingState } from '@/components/LoadingSpinner';
import { SaveButton } from '@/components/history/SaveButton';
import { Sparkles } from 'lucide-react';

const mockHeadlines = [
  "Transform Your Business Today",
  "Get Results in 30 Days or Less",
  "Trusted by 10,000+ Companies",
  "Award-Winning Solutions",
  "Start Your Free Trial Now",
];

const mockDescriptions = [
  "Discover the #1 rated platform for business growth. Join thousands of satisfied customers and see why we're the industry leader. Start free today.",
  "Our proven methodology has helped businesses achieve 300% ROI. Get personalized recommendations and expert support. Limited time offer - Act now!",
  "Simple, powerful, and affordable. Everything you need to succeed in one platform. No credit card required to get started.",
];

const GoogleAds = () => {
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ headlines: string[]; descriptions: string[] } | null>(null);

  const handleGenerate = async () => {
    if (!productDescription.trim()) return;
    
    setIsGenerating(true);
    setResult(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setResult({
      headlines: mockHeadlines,
      descriptions: mockDescriptions,
    });
    setIsGenerating(false);
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
              placeholder="E.g., An online project management tool that helps remote teams collaborate more efficiently with real-time updates and integrations..."
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="audience">Target audience (optional)</Label>
            <Input
              id="audience"
              placeholder="E.g., Small business owners, marketing managers, startups..."
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
            />
          </div>

          <Button
            variant="gradient"
            size="lg"
            onClick={handleGenerate}
            disabled={!productDescription.trim() || isGenerating}
            className="w-full md:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            Generate Ad Copy
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
      {result && !isGenerating && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <SaveButton
              toolType="ads"
              input={`Product: ${productDescription}${targetAudience ? `\nAudience: ${targetAudience}` : ''}`}
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
