export interface OrganizationProfile {
  id: number;
  name: string;
  edrpou: string;
  contact_email: string;
  created_at: string;
}

export interface PendingSubmitter {
  id: number;
  email: string;
  status?: string;
  organization_profile: OrganizationProfile;
}

export interface PendingOrganization {
  id: number;
  created_at: string;
  submitter: PendingSubmitter;
}

export interface PendingProject {
  id: number;
  created_at: string;
  entity_id: number;
  submitter: Omit<PendingSubmitter, 'status'>;
  project: {
    id: number;
    title: string;
    description: string;
    status: string;
  };
}

export interface PendingTicket {
  id: number;
  title: string;
  description: string;
  created_at: string;
  status: string;
  priority: string;
  app_user: {
    id: number;
    email: string;
    first_name?: string;
    last_name?: string;
  };
}

export interface PendingNews {
  id: number;
  title: string;
  created_at: string;
  organization?: {
    name: string;
    contact_email?: string;
  };
}
