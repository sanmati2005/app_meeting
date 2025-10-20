// API service for making requests to the backend
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  // Generic fetch method with error handling
  async fetch(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      console.log(`Making request to: ${url}`, options);
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      
      console.log(`Response status: ${response.status}`);
      
      // Handle case where there's no content
      if (response.status === 204) {
        return { success: true };
      }
      
      // Try to parse JSON, but handle cases where response is not JSON
      let data;
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = { success: response.ok, message: response.statusText };
      }
      
      console.log(`Response data:`, data);
      
      if (!response.ok) {
        // Handle authentication errors specifically
        if (response.status === 401) {
          // Clear local storage and redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
        }
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }
      
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    return this.fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Profile endpoints
  async getProfile() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return this.fetch('/api/auth/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async updateProfile(profileData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return this.fetch('/api/auth/me', {
      method: 'PUT',
      body: JSON.stringify(profileData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Meeting endpoints
  async createMeeting(meetingData) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return this.fetch('/api/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getMeetings() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return this.fetch('/api/meetings', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async getMeeting(id) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return this.fetch(`/api/meetings/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  async deleteMeeting(id) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return this.fetch(`/api/meetings/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Analytics endpoints
  async getUserEngagementStats() {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return this.fetch('/api/meetings/analytics/user', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }
}

export default new ApiService();