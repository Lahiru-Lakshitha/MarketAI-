import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

export type ToolType = 'social' | 'ads' | 'seo';

export interface HistoryItem {
  id: string;
  toolType: ToolType;
  input: string;
  output: string;
  tone?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface HistoryContextType {
  items: HistoryItem[];
  isLoading: boolean;
  addItem: (item: Omit<HistoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, output: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItemsByType: (type: ToolType | 'all') => HistoryItem[];
  refreshHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchHistory = async () => {
    if (!isAuthenticated || !user) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching history:', error);
        return;
      }

      const mappedItems: HistoryItem[] = (data || []).map((item) => ({
        id: item.id,
        toolType: item.tool_type as ToolType,
        input: item.input,
        output: item.output,
        tone: item.tone || undefined,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
      }));

      setItems(mappedItems);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [isAuthenticated, user]);

  const addItem = async (item: Omit<HistoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) {
      throw new Error('Must be logged in to save history');
    }

    const { data, error } = await supabase
      .from('history')
      .insert({
        user_id: user.id,
        tool_type: item.toolType,
        input: item.input,
        output: item.output,
        tone: item.tone || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding history item:', error);
      throw error;
    }

    const newItem: HistoryItem = {
      id: data.id,
      toolType: data.tool_type as ToolType,
      input: data.input,
      output: data.output,
      tone: data.tone || undefined,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };

    setItems((prev) => [newItem, ...prev]);
  };

  const updateItem = async (id: string, output: string) => {
    const { error } = await supabase
      .from('history')
      .update({ output })
      .eq('id', id);

    if (error) {
      console.error('Error updating history item:', error);
      throw error;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, output, updatedAt: new Date() } : item
      )
    );
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase.from('history').delete().eq('id', id);

    if (error) {
      console.error('Error deleting history item:', error);
      throw error;
    }

    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const getItemsByType = (type: ToolType | 'all') => {
    if (type === 'all') return items;
    return items.filter((item) => item.toolType === type);
  };

  const refreshHistory = async () => {
    await fetchHistory();
  };

  return (
    <HistoryContext.Provider
      value={{ items, isLoading, addItem, updateItem, deleteItem, getItemsByType, refreshHistory }}
    >
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
