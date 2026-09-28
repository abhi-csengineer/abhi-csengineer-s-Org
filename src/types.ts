export type ItemType = 'lost' | 'found';

export type ItemStatus = 'active' | 'claimed' | 'resolved';

export type ItemCategory =
  | 'Electronics'
  | 'IDs & Cards'
  | 'Keys'
  | 'Bags & Backpacks'
  | 'Books & Stationery'
  | 'Clothing & Accessories'
  | 'Water Bottles & Mugs'
  | 'Other';

export type CampusZone =
  | 'Central Library'
  | 'STEM Quad'
  | 'Student Union'
  | 'Athletic Complex'
  | 'North Campus'
  | 'South Campus'
  | 'Transit Hub & Parking'
  | 'Residence Halls'
  | 'Main Library & Study Hub'
  | 'Science & Engineering Quad'
  | 'Student Union & Dining'
  | 'Athletics & Recreation Center'
  | 'North Residential Complex'
  | 'South Residence Halls'
  | 'Health & Wellness Pavilion'
  | 'Other Campus Grounds';

export const HERO_CAMPUS_ZONES = [
  'Central Library',
  'STEM Quad',
  'Student Union',
  'Athletic Complex',
  'North Campus',
  'South Campus',
  'Transit Hub & Parking',
  'Residence Halls',
] as const;

export interface Item {
  id: string;
  type: ItemType;
  title: string;
  category: ItemCategory;
  location: string;
  campusZone: CampusZone;
  date: string;
  description: string;
  imageUrl?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  contactRole: 'Student' | 'Faculty' | 'Campus Staff' | 'Campus Safety';
  status: ItemStatus;
  primaryColor?: string;
  identifyingFeatures?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface SmartMatchResult {
  id: string;
  lostItem: Item;
  foundItem: Item;
  confidence: number; // 0 to 100
  matchGrade: 'High' | 'Medium' | 'Potential';
  reasoning: string;
  matchedAttributes: string[];
}

export interface ClaimSubmission {
  id: string;
  itemId: string;
  claimantName: string;
  claimantEmail: string;
  claimantPhone: string;
  claimType: 'i_found_this' | 'this_is_mine';
  proofDetails: string;
  status: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
}

export interface FilterState {
  searchQuery: string;
  type: 'all' | 'lost' | 'found' | 'resolved';
  category: 'all' | ItemCategory;
  campusZone: 'all' | CampusZone;
  color: 'all' | string;
  sortBy: 'newest' | 'oldest';
}
