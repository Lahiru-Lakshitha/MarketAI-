import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Download, Copy, FileText, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ExportMenuProps {
  content: string;
  filename?: string;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ content, filename = 'export' }) => {
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    toast({
      title: 'Copied!',
      description: 'Content copied to clipboard.',
    });
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'Downloaded!',
      description: 'File saved as .txt',
    });
  };

  const handleDownloadPdf = () => {
    toast({
      title: 'PDF Export',
      description: 'PDF export feature coming soon.',
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={handleCopyToClipboard} className="cursor-pointer">
          <Copy className="h-4 w-4 mr-2" />
          Copy to clipboard
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadTxt} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Download as .TXT
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadPdf} className="cursor-pointer">
          <File className="h-4 w-4 mr-2" />
          Download as .PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
