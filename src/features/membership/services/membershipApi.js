/**
 * Membership API Service
 * Handles all requests related to doctors, labs, and delivery affiliation requests.
 */

const MOCK_DATA = [
  // Doctors
  { id: 1, name: 'أحمد غانم', type: 'doctor', status: 'pending', documentUrl: '#', createdAt: '2026-05-01' },
  { id: 2, name: 'أحمد غانم', type: 'doctor', status: 'rejected', documentUrl: '#', createdAt: '2026-05-02' },
  { id: 3, name: 'أحمد غانم', type: 'doctor', status: 'accepted', documentUrl: '#', createdAt: '2026-05-03' },
  { id: 10, name: 'أحمد غانم', type: 'doctor', status: 'accepted', documentUrl: '#', createdAt: '2026-05-10' },
  { id: 13, name: 'أحمد غانم', type: 'doctor', status: 'pending', documentUrl: '#', createdAt: '2026-05-13' },
  { id: 15, name: 'أحمد غانم', type: 'doctor', status: 'accepted', documentUrl: '#', createdAt: '2026-05-15' },
  { id: 16, name: 'أحمد غانم', type: 'doctor', status: 'pending', documentUrl: '#', createdAt: '2026-05-16' },
  { id: 17, name: 'أحمد غانم', type: 'doctor', status: 'rejected', documentUrl: '#', createdAt: '2026-05-17' },
  { id: 18, name: 'أحمد غانم', type: 'doctor', status: 'accepted', documentUrl: '#', createdAt: '2026-05-18' },
  { id: 19, name: 'أحمد غانم', type: 'doctor', status: 'pending', documentUrl: '#', createdAt: '2026-05-19' },

  // Labs
  { id: 4, name: 'أحمد غانم', type: 'lab', status: 'accepted', documentUrl: '#', createdAt: '2026-05-04' },
  { id: 5, name: 'أحمد غانم', type: 'lab', status: 'pending', documentUrl: '#', createdAt: '2026-05-05' },
  { id: 6, name: 'أحمد غانم', type: 'lab', status: 'rejected', documentUrl: '#', createdAt: '2026-05-06' },
  { id: 11, name: 'أحمد غانم', type: 'lab', status: 'pending', documentUrl: '#', createdAt: '2026-05-11' },
  { id: 14, name: 'أحمد غانم', type: 'lab', status: 'accepted', documentUrl: '#', createdAt: '2026-05-14' },
  { id: 20, name: 'أحمد غانم', type: 'lab', status: 'pending', documentUrl: '#', createdAt: '2026-05-20' },
  { id: 21, name: 'أحمد غانم', type: 'lab', status: 'rejected', documentUrl: '#', createdAt: '2026-05-21' },
  { id: 22, name: 'أحمد غانم', type: 'lab', status: 'accepted', documentUrl: '#', createdAt: '2026-05-22' },
  { id: 23, name: 'أحمد غانم', type: 'lab', status: 'pending', documentUrl: '#', createdAt: '2026-05-23' },
];

export const membershipApi = {
  /**
   * Fetch all membership requests with optional filtering
   */
  getMembershipRequests: async ({ type = 'all', page = 1, limit = 8 } = {}) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    let filtered = [...MOCK_DATA];
    if (type !== 'all') {
      filtered = filtered.filter(item => item.type === type);
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = filtered.slice(start, end);

    return {
      data,
      pagination: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      }
    };
  },

  /**
   * Update the status of a request
   */
  updateRequestStatus: async (id, status) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real app, this would be a PUT/PATCH request
    console.log(`Request ${id} status updated to ${status}`);
    return { success: true, id, status };
  }
};
