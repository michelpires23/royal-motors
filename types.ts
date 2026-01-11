
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  description: string;
  price: number;
  oldPrice?: number;
  km: number;
  transmission: 'Automático' | 'Manual';
  fuel: string;
  imageUrl: string;
  gallery?: string[];
  features?: string[];
  isNew?: boolean;
}

export interface FilterState {
  search: string;
  type: 'all' | 'seminovo' | 'usado';
}
