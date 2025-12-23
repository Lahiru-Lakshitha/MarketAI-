import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OutputCardProps {
  title: string;
  content: string | string[];
  className?: string;
}

export const OutputCard: React.FC<OutputCardProps> = ({ title, content, className }) => {
  const [copied, setCopied] = useState(false);

  const textContent = Array.isArray(content) ? content.join('\n') : content;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(textContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className={cn('animate-slide-up', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
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
              Copy
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        {Array.isArray(content) ? (
          <div className="space-y-3">
            {content.map((item, index) => (
              <div
                key={index}
                className="p-3 bg-secondary rounded-lg text-secondary-foreground"
              >
                {item}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-secondary rounded-lg text-secondary-foreground whitespace-pre-wrap">
            {content}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
