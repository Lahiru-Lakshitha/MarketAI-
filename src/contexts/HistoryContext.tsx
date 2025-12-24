import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ToolType = 'social' | 'ads' | 'seo';

export interface HistoryItem {
  id: string;
  toolType: ToolType;
  input: string;
  output: string;
  createdAt: Date;
  updatedAt: Date;
}

interface HistoryContextType {
  items: HistoryItem[];
  addItem: (item: Omit<HistoryItem, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateItem: (id: string, output: string) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  getItemsByType: (type: ToolType | 'all') => HistoryItem[];
}

const STORAGE_KEY = 'marketai_history';

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const serializeItems = (items: HistoryItem[]): string => {
  return JSON.stringify(items.map(item => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    updatedAt: item.updatedAt.toISOString(),
  })));
};

const deserializeItems = (data: string): HistoryItem[] => {
  try {
    const parsed = JSON.parse(data);
    return parsed.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  } catch {
    return [];
  }
};

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? deserializeItems(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, serializeItems(items));
  }, [items]);

  const addItem = async (item: Omit<HistoryItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newItem: HistoryItem = {
      ...item,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setItems(prev => [newItem, ...prev]);
  };

  const updateItem = async (id: string, output: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setItems(prev => prev.map(item => 
      item.id === id 
        ? { ...item, output, updatedAt: new Date() }
        : item
    ));
  };

  const deleteItem = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const getItemsByType = (type: ToolType | 'all') => {
    if (type === 'all') return items;
    return items.filter(item => item.toolType === type);
  };

  return (
    <HistoryContext.Provider value={{ items, addItem, updateItem, deleteItem, getItemsByType }}>
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
