export interface IProperty {
  _id?: string;
  _v?: string;
  name: string;
  updatedAt: string;
  createdAt: string;
  location: {
    town: string;
    province: string;
  };
  description?: string;
  active?: boolean;
  images?: {
    path: string;
    public_id: string;
  }[];
  rent: number; // monthly rent per unit
  type?: "apartment" | "house" | "boarding house" | "condo"; // e.g., "Apartments", "House", etc.
  units: number; // number of apartments or rooms
  status?: "pending" | "in_progress" | "completed";
  tenants?: string[]; // references to Tenant documents
}
