import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { OutputCard } from '@/components/OutputCard';
import { GeneratingState } from '@/components/LoadingSpinner';
import { SaveButton } from '@/components/history/SaveButton';
import { Sparkles } from 'lucide-react';

const tones = [
  { value: 'professional', label: 'Professional' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'sales', label: 'Sales-focused' },
  { value: 'fun', label: 'Fun & Playful' },
];

const mockCaptions: Record<string, string[]> = {
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
  fun: [
    "POV: You just discovered your new obsession 😍 Tag a friend who needs this in their life! 🎉",
    "That Friday feeling when you realize... we've got you covered! 🎊 Who else is ready for the weekend?",
    "Plot twist: It actually IS as good as it looks! 🤩 Drop a 🙌 if you're feeling this vibe!",
  ],
};

const SocialMedia = () => {
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('friendly');
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState<string[] | null>(null);

  const handleGenerate = async () => {
    if (!description.trim()) return;
    
    setIsGenerating(true);
    setCaptions(null);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setCaptions(mockCaptions[tone] || mockCaptions.friendly);
    setIsGenerating(false);
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
              placeholder="E.g., A new fitness app that helps users track their workouts and nutrition with AI-powered recommendations..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[120px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tone">Select tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger id="tone" className="w-full md:w-[200px]">
                <SelectValue placeholder="Select tone" />
              </SelectTrigger>
              <SelectContent>
                {tones.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="gradient"
            size="lg"
            onClick={handleGenerate}
            disabled={!description.trim() || isGenerating}
            className="w-full md:w-auto"
          >
            <Sparkles className="h-4 w-4" />
            Generate Captions
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
