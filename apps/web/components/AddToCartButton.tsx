'use client';

import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@gemcart/ui';
import { useCartStore } from '../lib/store';

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    priceNGN: number;
    imageUrl?: string;
  };
  size?: string;
  color?: string;
  className?: string;
}

export function AddToCartButton({ product, size, color, className }: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.priceNGN,
      imageUrl: product.imageUrl || '',
      quantity: 1,
      size,
      color,
    });

    // Show feedback
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAdding(false);
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={className}
    >
      <ShoppingBag className="h-4 w-4 mr-2" />
      {isAdding ? 'Adding...' : 'Quick Add'}
    </Button>
  );
}




