import React from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type ToneType = 'professional' | 'friendly' | 'sales' | 'creative' | 'casual';

interface ToneSelectorProps {
  value: ToneType;
  onValueChange: (value: ToneType) => void;
  className?: string;
  disabled?: boolean;
}

const toneOptions: { value: ToneType; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-oriented' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
  { value: 'sales', label: 'Sales', description: 'Persuasive and action-driven' },
  { value: 'creative', label: 'Creative', description: 'Unique and imaginative' },
  { value: 'casual', label: 'Casual', description: 'Relaxed and conversational' },
];

export const ToneSelector: React.FC<ToneSelectorProps> = ({
  value,
  onValueChange,
  className,
  disabled = false,
}) => {
  return (
    <div className={className}>
      <Label htmlFor="tone" className="text-sm font-medium">
        Tone
      </Label>
      <Select value={value} onValueChange={(v) => onValueChange(v as ToneType)} disabled={disabled}>
        <SelectTrigger id="tone" className="w-full md:w-[200px] mt-1.5">
          <SelectValue placeholder="Select tone" />
        </SelectTrigger>
        <SelectContent className="bg-popover border-border">
          {toneOptions.map((tone) => (
            <SelectItem key={tone.value} value={tone.value}>
              <div className="flex flex-col">
                <span>{tone.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
