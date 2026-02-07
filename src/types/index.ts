export type FreelancerProfile = {
  id: string;
  role: string;
  yearsExperience: number;
  hourlyRate: number;
  skills: string[];
  createdAt: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  hasContract?: boolean;
  featureRequestCount?: number;
};

export type ProjectDetail = Project & {
  contractText: string | null;
  contractUploadedAt: string | null;
  featureRequests: FeatureRequestListItem[];
};

export type FeatureRequestListItem = {
  id: string;
  description: string;
  scopeStatus: string;
  totalHours: number;
  totalPrice: number;
  createdAt: string;
};

export type FeatureRequestDetail = {
  id: string;
  projectId: string;
  description: string;
  scopeStatus: string;
  totalHours: number;
  totalPrice: number;
  aiResponse: string;
  createdAt: string;
};

export type ScopeAIResult = {
  scope_status: "in_scope" | "out_of_scope" | "partial";
  scope_reasoning: string;
  missing_scope_items: string[];
  tasks: Array<{ name: string; hours: number; skills: string[] }>;
  total_hours: number;
  hourly_rate: number;
  total_price: number;
  confidence: "low" | "medium" | "high";
  assumptions: string[];
};
