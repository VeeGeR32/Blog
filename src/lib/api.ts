const API_URL = 'http://localhost:5000/api';

export const api = {
  auth: {
    login: async (email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) throw new Error('Login failed');
      return response.json();
    },
    register: async (username: string, email: string, password: string) => {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      if (!response.ok) throw new Error('Registration failed');
      return response.json();
    },
  },
  posts: {
    create: async (post: any, token: string) => {
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    getAll: async (token: string) => {
      const response = await fetch(`${API_URL}/posts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to fetch posts');
      return response.json();
    },
    getBySlug: async (slug: string) => {
      const response = await fetch(`${API_URL}/posts/public/${slug}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    },
    update: async (id: string, post: any, token: string) => {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(post),
      });
      if (!response.ok) throw new Error('Failed to update post');
      return response.json();
    },
    delete: async (id: string, token: string) => {
      const response = await fetch(`${API_URL}/posts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Failed to delete post');
      return response.json();
    },
  },
};