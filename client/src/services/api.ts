const API_BASE = '/api';

export function getAuthToken(): string | null {
  return localStorage.getItem('nexus_token');
}

export function setAuthToken(token: string | null): void {
  if (token) {
    localStorage.setItem('nexus_token', token);
  } else {
    localStorage.removeItem('nexus_token');
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorBody.message || 'An error occurred during request');
  }

  return response.json();
}

export const api = {
  auth: {
    login: (credentials: { email: string; password: string }) =>
      request<{ success: boolean; token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    register: (userData: any) =>
      request<{ success: boolean; token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    getMe: () => request<{ success: boolean; user: any }>('/auth/me'),
    updateProfile: (data: any) =>
      request<{ success: boolean; user: any }>('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    logout: () => request<{ success: boolean }>('/auth/logout', { method: 'POST' })
  },
  pickups: {
    getAll: (params?: { status?: string; category?: string; search?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<{ success: boolean; pickups: any[] }>(`/pickups${q ? '?' + q : ''}`);
    },
    getById: (id: string) =>
      request<{ success: boolean; pickup: any; collectionRecord?: any; recyclerRecord?: any; eprRecord?: any }>(`/pickups/${id}`),
    create: (data: any) =>
      request<{ success: boolean; pickup: any; message: string }>('/pickups', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    updateStatus: (id: string, data: { status: string; note?: string; assignedPartnerId?: string }) =>
      request<{ success: boolean; pickup: any; message: string }>(`/pickups/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
    cancel: (id: string, reason?: string) =>
      request<{ success: boolean; pickup: any; message: string }>(`/pickups/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason })
      })
  },
  collections: {
    getAll: (params?: { status?: string; partnerId?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<{ success: boolean; collections: any[] }>(`/collections${q ? '?' + q : ''}`);
    },
    submit: (data: { pickupId: string; submittedWeightKg: number; notes?: string; evidenceUrls?: string[] }) =>
      request<{ success: boolean; collection: any; message: string }>('/collections', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    verify: (id: string, data: { verifiedWeightKg?: number; status?: string; notes?: string }) =>
      request<{ success: boolean; collection: any; message: string }>(`/collections/${id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      })
  },
  recycling: {
    getAll: (params?: { status?: string; category?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<{ success: boolean; records: any[] }>(`/recycling${q ? '?' + q : ''}`);
    },
    submit: (data: {
      collectionRecordId: string;
      receivedWeightKg: number;
      processedWeightKg: number;
      processingStatus: string;
      notes?: string;
      processingEvidenceUrls?: string[];
    }) =>
      request<{ success: boolean; recyclingRecord: any; message: string }>('/recycling', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    updateStatus: (id: string, data: { processingStatus: string; processedWeightKg?: number; notes?: string }) =>
      request<{ success: boolean; record: any; message: string }>(`/recycling/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      })
  },
  epr: {
    getAll: (params?: { status?: string; approval?: string; period?: string; category?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<{
        success: boolean;
        summary: { totalApprovedCredits: number; pendingReviewCredits: number; totalEligibleWeightKg: number; totalRecords: number };
        conversionFactors: Record<string, number>;
        records: any[];
      }>(`/epr/records${q ? '?' + q : ''}`);
    },
    create: (data: { sourceRecyclerRecordId: string; targetProducer?: string; reportingPeriod?: string; notes?: string }) =>
      request<{ success: boolean; eprRecord: any; message: string }>('/epr/records', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    approve: (id: string, data: { approvalStatus: string; creditStatus?: string; targetProducer?: string; notes?: string }) =>
      request<{ success: boolean; eprRecord: any; message: string }>(`/epr/records/${id}/approve`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
    getCsvUrl: () => `${API_BASE}/epr/reports/csv`
  },
  admin: {
    getOverview: () => request<{ success: boolean; stats: any; queues: any }>('/admin/overview'),
    getUsers: (params?: { role?: string; status?: string; search?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<{ success: boolean; users: any[] }>(`/admin/users${q ? '?' + q : ''}`);
    },
    updateUserStatus: (id: string, data: { status?: string; role?: string }) =>
      request<{ success: boolean; user: any; message: string }>(`/admin/users/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      }),
    getAuditLogs: (params?: { entityType?: string; search?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<{ success: boolean; logs: any[] }>(`/admin/audit-logs${q ? '?' + q : ''}`);
    }
  },
  centers: {
    getAll: (params?: { category?: string; city?: string; search?: string }) => {
      const q = new URLSearchParams(params as any).toString();
      return request<{ success: boolean; centers: any[] }>(`/centers${q ? '?' + q : ''}`);
    },
    getById: (id: string) => request<{ success: boolean; center: any }>(`/centers/${id}`)
  },
  analytics: {
    getMetrics: () => request<{
      success: boolean;
      metrics: any;
      categoryBreakdown: any[];
      monthlyTrends: any[];
      partnerPerformance: any[];
      regionalDistribution: any[];
      disclaimer: string;
    }>('/analytics')
  },
  upload: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const token = getAuthToken();

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(err.message || 'File upload failed');
    }

    const data = await response.json();
    return { url: data.url, filename: data.filename };
  }
};
