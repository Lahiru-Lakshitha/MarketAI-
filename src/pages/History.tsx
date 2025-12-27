import React, { useState, useMemo } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { useHistory, ToolType } from '@/contexts/HistoryContext';
import { HistoryCard } from '@/components/history/HistoryCard';
import { ViewEditModal } from '@/components/history/ViewEditModal';
import { ConfirmDialog } from '@/components/history/ConfirmDialog';
import { useToast } from '@/hooks/use-toast';
import { History as HistoryIcon, MessageSquare, Megaphone, Search, Inbox } from 'lucide-react';
import { HistoryItem } from '@/contexts/HistoryContext';

type FilterType = 'all' | ToolType;

const History = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'edit'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<HistoryItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { getItemsByType, updateItem, deleteItem: removeItem } = useHistory();
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
    await updateItem(id, output);
    toast({
      title: 'Updated!',
      description: 'Content updated successfully.',
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) return;
    
    await removeItem(deleteItem.id);
    toast({
      title: 'Deleted!',
      description: 'Content removed from history.',
    });
    setDeleteItem(null);
  };

  const filters = [
    { value: 'all', label: 'All', icon: HistoryIcon },
    { value: 'social', label: 'Social Captions', icon: MessageSquare },
    { value: 'ads', label: 'Google Ads', icon: Megaphone },
    { value: 'seo', label: 'SEO Keywords', icon: Search },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
            <Card key={i} className="border-border/50">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && items.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="py-16 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-full bg-muted">
                <Inbox className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-lg font-semibold mb-2">No saved generations yet</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Start generating content and save your favorites here for easy access later.
            </p>
          </CardContent>
        </Card>
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
