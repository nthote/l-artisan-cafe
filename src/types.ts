export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number; // in INR
  category: 'Coffee' | 'Tea' | 'Pastries' | 'Brunch' | 'Sides';
  imageUrl: string;
  tags?: string[];
  isAvailable: boolean;
  isBestSeller?: boolean;
}

export interface CartItem {
  id: string; // unique cart line ID
  menuItem: MenuItem;
  size: 'S' | 'M' | 'L';
  sugarLevel: number; // e.g. 0%, 50%, 100%
  milkType: 'Whole Milk' | 'Oat Milk' | 'Almond Milk';
  toppings: string[]; // e.g. ["Extra Shot Espresso", "Whipped Cream"]
  specialNotes: string;
  quantity: number;
}

export interface Order {
  id: string; // e.g., POSH-2849
  tableNumber: number;
  items: CartItem[];
  subtotal: number;
  discountAmt: number;
  gstAmt: number;
  serviceChargeAmt: number;
  total: number;
  status: 'Received' | 'Preparing' | 'Ready' | 'Served';
  elapsedTime: number; // in mins remaining or progress
  scEnabled: boolean;
  peopleToSplit: number;
  timestamp: string;
}

export interface FeedbackRating {
  overall: number;
  culinary: number;
  service: number;
  comments: string;
  itemThumbs: Record<string, 'up' | 'down' | null>; // keyed by MenuItem ID
  submitted: boolean;
}
