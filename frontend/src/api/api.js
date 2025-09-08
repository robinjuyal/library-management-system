// API service
const API_BASE_URL = 'http://localhost:8080/api';

const api = {
  // Auth endpoints
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.text();
  },

  // Book endpoints
  getBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/books`);
    return response.json();
  },

  getAvailableBooks: async () => {
    const response = await fetch(`${API_BASE_URL}/books/available`);
    return response.json();
  },

  searchBooks: async (keyword) => {
    const response = await fetch(`${API_BASE_URL}/books/search?keyword=${encodeURIComponent(keyword)}`);
    return response.json();
  },

  addBook: async (book, token) => {
    const response = await fetch(`${API_BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error('Failed to add book');
    return response.json();
  },

  borrowBook: async (bookId, token) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/borrow`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to borrow book');
    return response.json();
  },

  returnBook: async (bookId, token) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}/return`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to return book');
    return response.json();
  },

  updateBook: async (bookId, book, token) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(book),
    });
    if (!response.ok) throw new Error('Failed to update book');
    return response.json();
  },

  deleteBook: async (bookId, token) => {
    const response = await fetch(`${API_BASE_URL}/books/${bookId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete book');
    return response.text();
  },
};
export default api;