export interface HelpRequest {
  id: string;
  title: string;
  description: string;
  location: string;
  type: 'urgent' | 'normal';
  createdAt: Date;
  createdBy: string;
  status: 'pending' | 'in-progress' | 'completed';
}

export type CreateHelpRequest = Omit<HelpRequest, 'id' | 'createdAt' | 'status'>;