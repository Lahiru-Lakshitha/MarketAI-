import { MessageSquare, Megaphone, Search, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ToolCard } from '@/components/ToolCard';
import { useAuth } from '@/contexts/AuthContext';

const tools = [
  {
    title: 'Social Media Captions',
    description: 'Generate engaging captions for Instagram, Twitter, LinkedIn and more.',
    icon: MessageSquare,
    path: '/social-media',
  },
  {
    title: 'Google Ads Copy',
    description: 'Create compelling headlines and descriptions for your ad campaigns.',
    icon: Megaphone,
    path: '/google-ads',
  },
  {
    title: 'SEO Keywords',
    description: 'Discover high-impact keywords to boost your search rankings.',
    icon: Search,
    path: '/seo-keywords',
  },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Welcome Section */}
      <Card className="overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 gradient-primary opacity-5" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">AI-Powered Marketing</span>
            </div>
            <CardTitle className="text-2xl lg:text-3xl">
              Welcome back, {user?.name || 'there'}!
            </CardTitle>
            <CardDescription className="text-base max-w-2xl">
              Supercharge your digital marketing with AI-generated content. Create compelling social media captions, 
              ad copy, and discover the perfect keywords in seconds.
            </CardDescription>
          </CardHeader>
        </div>
      </Card>

      {/* Tools Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">AI Marketing Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <ToolCard
              key={tool.path}
              {...tool}
              gradient={index === 0}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">∞</div>
            <p className="text-sm text-muted-foreground">Generations Available</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">3</div>
            <p className="text-sm text-muted-foreground">AI Tools Ready</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">24/7</div>
            <p className="text-sm text-muted-foreground">Always Available</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
