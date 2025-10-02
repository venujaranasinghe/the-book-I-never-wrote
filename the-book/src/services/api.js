const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5031/api';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP error! status: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  
  return await response.text();
};

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const apiService = {
  // Auth endpoints
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  async getProfile() {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getUser(userId) {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);
    return handleResponse(response);
  },

  // Chapter endpoints
  async getChapters() {
    const response = await fetch(`${API_BASE_URL}/chapter`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async getChapter(chapterId) {
    const response = await fetch(`${API_BASE_URL}/chapter/${chapterId}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async createChapter(chapterData) {
    const response = await fetch(`${API_BASE_URL}/chapter`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(chapterData),
    });
    return handleResponse(response);
  },

  async updateChapter(chapterId, chapterData) {
    const response = await fetch(`${API_BASE_URL}/chapter/${chapterId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(chapterData),
    });
    return handleResponse(response);
  },

  async deleteChapter(chapterId) {
    const response = await fetch(`${API_BASE_URL}/chapter/${chapterId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async reorderChapters(chapterOrders) {
    const response = await fetch(`${API_BASE_URL}/chapter/reorder`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(chapterOrders),
    });
    return handleResponse(response);
  },

  async getPublicChapters(userId) {
    const response = await fetch(`${API_BASE_URL}/chapter/user/${userId}`);
    return handleResponse(response);
  },
};

export default apiService;
