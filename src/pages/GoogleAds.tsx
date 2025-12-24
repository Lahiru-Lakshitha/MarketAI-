import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { OutputCard } from '@/components/OutputCard';
import { GeneratingState } from '@/components/LoadingSpinner';
import { SaveButton } from '@/components/history/SaveButton';
import { ToneSelector, ToneType } from '@/components/ToneSelector';
import { RegenerateButton } from '@/components/RegenerateButton';
import { Sparkles } from 'lucide-react';

const mockHeadlines: Record<ToneType, string[]> = {
  professional: [
    "Industry-Leading Solutions",
    "Trusted by 10,000+ Companies",
    "Enterprise-Grade Quality",
    "Expert Team, Proven Results",
    "Transform Your Business Today",
  ],
  friendly: [
    "We're Here to Help You Grow",
    "Your Success is Our Priority",
    "Join Our Happy Customers",
    "Let's Build Something Great",
    "Start Your Journey With Us",
  ],
  sales: [
    "Limited Time: 50% Off!",
    "Don't Miss This Deal",
    "Get Results in 30 Days",
    "Risk-Free Trial Available",
    "Act Now – Save Big!",
  ],
  creative: [
    "Reimagine What's Possible",
    "Where Innovation Meets You",
    "The Future Starts Here",
    "Unleash Your Potential",
    "Think Different. Act Bold.",
  ],
  casual: [
    "Check This Out",
    "You'll Love What We Do",
    "Simple. Easy. Effective.",
    "Give It a Try Today",
    "See What the Buzz Is About",
  ],
};

const mockDescriptions: Record<ToneType, string[]> = {
  professional: [
    "Discover the #1 rated platform for business growth. Join thousands of satisfied customers and see why we're the industry leader. Start free today.",
    "Our proven methodology has helped businesses achieve 300% ROI. Get personalized recommendations and expert support.",
    "Simple, powerful, and affordable. Everything you need to succeed in one platform. No credit card required.",
  ],
  friendly: [
    "We'd love to help you reach your goals! Our friendly team is here to support you every step of the way. Let's get started!",
    "Join a community of happy users who've transformed their business. We can't wait to welcome you!",
    "Making your life easier is what we do best. Try us out and see the difference for yourself!",
  ],
  sales: [
    "Limited time offer! Sign up now and get exclusive access to premium features. Don't let this opportunity pass you by!",
    "Join 50,000+ customers who saved big. Special pricing ends soon – act now to lock in your discount!",
    "Risk-free guarantee: If you're not satisfied, get a full refund. No questions asked. Order today!",
  ],
  creative: [
    "Break free from the ordinary. Our innovative approach helps you stand out and make a lasting impression.",
    "Creativity meets functionality. Discover a new way of thinking that will transform how you work.",
    "Dare to be different. Join the movement of forward-thinkers who are changing the game.",
  ],
  casual: [
    "Looking for something that just works? We've got you covered. Simple, straightforward, and effective.",
    "No complicated stuff here. Just great results without the hassle. Give it a shot!",
    "Real talk: this is what you've been looking for. Try it out – we think you'll love it.",
  ],
};

const GoogleAds = () => {
  const [productDescription, setProductDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [tone, setTone] = useState<ToneType>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<{ headlines: string[]; descriptions: string[] } | null>(null);

  const handleGenerate = async () => {
    if (!productDescription.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setResult({
      headlines: mockHeadlines[tone] || mockHeadlines.professional,
      descriptions: mockDescriptions[tone] || mockDescriptions.professional,
    });
    setIsGenerating(false);
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
            />
          </div>

          <ToneSelector value={tone} onValueChange={setTone} />

          <div className="flex flex-wrap gap-3">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleGenerate}
              disabled={!productDescription.trim() || isGenerating}
            >
              <Sparkles className="h-4 w-4" />
              Generate Ad Copy
            </Button>
            {result && (
              <RegenerateButton
                onClick={handleRegenerate}
                isLoading={isGenerating}
                disabled={!productDescription.trim()}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isGenerating && !result && (
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
