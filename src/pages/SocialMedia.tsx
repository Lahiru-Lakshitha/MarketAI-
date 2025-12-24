import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { OutputCard } from '@/components/OutputCard';
import { GeneratingState } from '@/components/LoadingSpinner';
import { SaveButton } from '@/components/history/SaveButton';
import { ToneSelector, ToneType } from '@/components/ToneSelector';
import { RegenerateButton } from '@/components/RegenerateButton';
import { Sparkles } from 'lucide-react';

const mockCaptions: Record<ToneType, string[]> = {
  professional: [
    "Elevate your business with our cutting-edge solutions. We're committed to driving your success. 🚀 #BusinessGrowth #Innovation",
    "Excellence isn't just our goal—it's our standard. Discover how we can transform your operations. 💼 #ProfessionalServices",
    "Leading the industry with proven results. Let's discuss how we can add value to your business. 📈 #Results #Success",
  ],
  friendly: [
    "Hey there! 👋 We've got something special just for you. Come check it out and let us know what you think!",
    "You asked, we listened! Here's exactly what you've been waiting for. Can't wait to hear your thoughts! 💬",
    "Big smiles over here because you're amazing! Thanks for being part of our journey. ❤️ #Community",
  ],
  sales: [
    "🔥 LIMITED TIME: Get 20% off when you order today! Don't miss out on this exclusive deal. Link in bio! 🛒",
    "Ready to transform your life? Our bestselling product is back in stock! Get yours before they're gone! ⚡",
    "What if we told you there's a better way? Try us risk-free for 30 days. Your satisfaction, guaranteed! ✨",
  ],
  creative: [
    "Imagine a world where your dreams become reality... ✨ That's what we're creating, one step at a time. Join the revolution!",
    "Colors. Vibes. Energy. We're not just building a brand—we're crafting an experience. Ready to dive in? 🎨",
    "They said it couldn't be done. We did it anyway. Here's to the dreamers and doers! 🌟 #Innovation #Creative",
  ],
  casual: [
    "Just dropped something cool 😎 Check it out when you get a chance. No pressure, but you might love it!",
    "Real talk: this is one of our favorites. Give it a try and tell us what you think! 🙌",
    "Weekend vibes + our latest drop = perfect combo. Who's in? 🎉",
  ],
};

const SocialMedia = () => {
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState<ToneType>('friendly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState<string[] | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCaptions(mockCaptions[tone] || mockCaptions.friendly);
    setIsGenerating(false);
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
            />
            <p className="text-xs text-muted-foreground">
              Be specific about your product, audience, and key message for best results.
            </p>
          </div>

          <ToneSelector value={tone} onValueChange={setTone} />

          <div className="flex flex-wrap gap-3">
            <Button
              variant="gradient"
              size="lg"
              onClick={handleGenerate}
              disabled={!description.trim() || isGenerating}
            >
              <Sparkles className="h-4 w-4" />
              Generate Captions
            </Button>
            {captions && (
              <RegenerateButton
                onClick={handleRegenerate}
                isLoading={isGenerating}
                disabled={!description.trim()}
              />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {isGenerating && !captions && (
        <Card>
          <CardContent className="pt-6">
            <GeneratingState />
          </CardContent>
        </Card>
      )}

      {/* Output Section */}
      {captions && !isGenerating && (
        <div className="space-y-4">
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
