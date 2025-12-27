import React, { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useHistory, ToolType } from '@/contexts/HistoryContext';
import { HistoryCard } from '@/components/history/HistoryCard';
import { ViewEditModal } from '@/components/history/ViewEditModal';
import { ConfirmDialog } from '@/components/history/ConfirmDialog';
import { HistoryCardSkeleton } from '@/components/LoadingSpinner';
import { useToast } from '@/hooks/use-toast';
import { History as HistoryIcon, MessageSquare, Megaphone, Search, Inbox, Sparkles, FolderOpen } from 'lucide-react';
import { HistoryItem } from '@/contexts/HistoryContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

type FilterType = 'all' | ToolType;

const History = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<HistoryItem | null>(null);
  
  const { getItemsByType, updateItem, deleteItem: removeItem, isLoading } = useHistory();
  const { toast } = useToast();
  
  const allItems = getItemsByType(activeFilter);
  
  // Filter items by search query
  const items = useMemo(() => {
    if (!searchQuery.trim()) return allItems;
    
    const query = searchQuery.toLowerCase();
    return allItems.filter(item => 
      item.input.toLowerCase().includes(query) ||
      item.output.toLowerCase().includes(query)
    );
  }, [allItems, searchQuery]);

  const handleView = (item: HistoryItem) => {
    setSelectedItem(item);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleEdit = (item: HistoryItem) => {
    setSelectedItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleSave = async (id: string, output: string) => {
    try {
      await updateItem(id, output);
      toast({
        title: 'Updated!',
        description: 'Content updated successfully.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update content.',
        variant: 'destructive',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    
    try {
      await removeItem(deleteItem.id);
      toast({
        title: 'Deleted!',
        description: 'Content removed from history.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete content.',
        variant: 'destructive',
      });
    }
    setDeleteItem(null);
  };

  const filters = [
    { value: 'all', label: 'All', icon: HistoryIcon },
    { value: 'social', label: 'Social Captions', icon: MessageSquare },
    { value: 'ads', label: 'Google Ads', icon: Megaphone },
    { value: 'seo', label: 'SEO Keywords', icon: Search },
  ];

  // Empty state based on filter
  const getEmptyState = () => {
    if (searchQuery.trim()) {
      return {
        icon: Search,
        title: 'No results found',
        description: `No saved content matches "${searchQuery}". Try a different search term.`,
        showCta: false,
      };
    }
    
    if (activeFilter !== 'all') {
      const filterLabels: Record<ToolType, string> = {
        social: 'social media captions',
        ads: 'Google Ads copy',
        seo: 'SEO keywords',
      };
      return {
        icon: FolderOpen,
        title: `No ${filterLabels[activeFilter as ToolType]} saved`,
        description: `Generate and save some ${filterLabels[activeFilter as ToolType]} to see them here.`,
        showCta: true,
      };
    }
    
    return {
      icon: Inbox,
      title: 'No saved generations yet',
      description: 'Start generating content with our AI tools and save your favorites here for easy access later.',
      showCta: true,
    };
  };

  const emptyState = getEmptyState();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-foreground">Generation History</h1>
        <p className="text-muted-foreground">View, edit, and export your saved AI generations.</p>
      </div>

      {/* Search and Filter */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search history by content or prompt..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filter Tabs */}
        <Tabs value={activeFilter} onValueChange={(v) => setActiveFilter(v as FilterType)}>
          <TabsList className="w-full justify-start flex-wrap h-auto gap-2 bg-transparent p-0">
            {filters.map((filter) => (
              <TabsTrigger
                key={filter.value}
                value={filter.value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
              >
                <filter.icon className="h-4 w-4" />
                {filter.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <HistoryCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <Card className="border-border/50 overflow-hidden">
          <CardContent className="py-16 text-center relative">
            {/* Background decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            </div>
            
            <div className="relative space-y-4">
              {/* Icon */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50">
                    <emptyState.icon className="h-10 w-10 text-primary" />
                  </div>
                  {emptyState.showCta && (
                    <div className="absolute -top-1 -right-1">
                      <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Text */}
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">{emptyState.title}</h3>
                <p className="text-muted-foreground text-sm max-w-md mx-auto">
                  {emptyState.description}
                </p>
              </div>
              
              {/* CTA */}
              {emptyState.showCta && (
                <div className="pt-4">
                  <Button variant="gradient" asChild>
                    <Link to="/social-media" className="gap-2">
                      <Sparkles className="h-4 w-4" />
                      Start Generating
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      {!isLoading && items.length > 0 && (
        <p className="text-sm text-muted-foreground">
          Showing {items.length} {items.length === 1 ? 'result' : 'results'}
          {searchQuery && ` for "${searchQuery}"`}
        </p>
      )}

      {/* History Items */}
      {!isLoading && items.length > 0 && (
        <div className="space-y-4">
          {items.map((item) => (
            <HistoryCard
              key={item.id}
              item={item}
              onView={() => handleView(item)}
              onEdit={() => handleEdit(item)}
              onDelete={() => setDeleteItem(item)}
            />
          ))}
        </div>
      )}

      {/* View/Edit Modal */}
      <ViewEditModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        item={selectedItem}
        mode={modalMode}
        onSave={handleSave}
      />

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        title="Delete this item?"
        description="This action cannot be undone. This will permanently delete the saved content from your history."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />
    </div>
  );
};

export default History;
