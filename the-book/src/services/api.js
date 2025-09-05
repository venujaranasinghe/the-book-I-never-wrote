// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Utility function to handle API responses
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

// API service object
const apiService = {
  // Auth endpoints
  async register(userData) {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    return handleResponse(response);
  },

  async getProfile(token) {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return handleResponse(response);
  },

  // User-related endpoints
  async getUser(userId) {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`);
    return handleResponse(response);
  },

  async createUser(userData) {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },

  // Book-related endpoints
  async getBook(bookId) {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
    return handleResponse(response);
  },

  // Chapter-related endpoints
  async getChapterContent(chapterId) {
    const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}/content`);
    return handleResponse(response);
  },

  async saveChapterContent(chapterId, content) {
    const response = await fetch(`${API_BASE_URL}/chapters/${chapterId}/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    return handleResponse(response);
  },
};

export default apiService;
