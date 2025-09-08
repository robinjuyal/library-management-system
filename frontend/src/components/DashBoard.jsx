import { useContext, useEffect, useState } from "react";
import AuthContext from "../auth/AuthContext";
import api from "../api/api"; 

import { BookOpen, LogOut, Plus, Search, User } from "lucide-react"; 

import BookCard from "./BookCard"; 
import BookModal from "./BookModal"; 


const Dashboard = () => {
    const { user, token, logout } = useContext(AuthContext);
    const [books, setBooks] = useState([]);
    const [filteredBooks, setFilteredBooks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAvailableOnly, setShowAvailableOnly] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [message, setMessage] = useState('');
  
    useEffect(() => {
      loadBooks();
    }, []);
  
    useEffect(() => {
      filterBooks();
    }, [books, searchTerm, showAvailableOnly]);
  
    const loadBooks = async () => {
      try {
        const data = showAvailableOnly ? await api.getAvailableBooks() : await api.getBooks();
        setBooks(data);
      } catch (error) {
        showMessage('Failed to load books', 'error');
      }
    };
  
    const filterBooks = async () => {
      let filtered = books;
  
      if (searchTerm.trim()) {
        try {
          filtered = await api.searchBooks(searchTerm);
        } catch (error) {
          filtered = books.filter(book =>
            book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            book.author.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
      }
  
      if (showAvailableOnly) {
        filtered = filtered.filter(book => book.available);
      }
  
      setFilteredBooks(filtered);
    };
  
    const showMessage = (text, type = 'success') => {
      setMessage({ text, type });
      setTimeout(() => setMessage(''), 3000);
    };
  
    const handleBorrow = async (bookId) => {
      setLoading(true);
      try {
        await api.borrowBook(bookId, token);
        showMessage('Book borrowed successfully!');
        await loadBooks();
      } catch (error) {
        showMessage('Failed to borrow book', 'error');
      } finally {
        setLoading(false);
      }
    };
  
    const handleReturn = async (bookId) => {
      setLoading(true);
      try {
        await api.returnBook(bookId, token);
        showMessage('Book returned successfully!');
        await loadBooks();
      } catch (error) {
        showMessage('Failed to return book', 'error');
      } finally {
        setLoading(false);
      }
    };
  
    const handleSaveBook = async (bookData) => {
      setLoading(true);
      try {
        if (editingBook) {
          await api.updateBook(editingBook.id, bookData, token);
          showMessage('Book updated successfully!');
        } else {
          await api.addBook(bookData, token);
          showMessage('Book added successfully!');
        }
        await loadBooks();
        setShowModal(false);
        setEditingBook(null);
      } catch (error) {
        showMessage(`Failed to ${editingBook ? 'update' : 'add'} book`, 'error');
      } finally {
        setLoading(false);
      }
    };
  
    const handleDeleteBook = async (bookId) => {
      if (!window.confirm('Are you sure you want to delete this book?')) return;
      
      setLoading(true);
      try {
        await api.deleteBook(bookId, token);
        showMessage('Book deleted successfully!');
        await loadBooks();
      } catch (error) {
        showMessage('Failed to delete book', 'error');
      } finally {
        setLoading(false);
      }
    };
  
    const handleEditBook = (book) => {
      setEditingBook(book);
      setShowModal(true);
    };
  
    const handleAddBook = () => {
      setEditingBook(null);
      setShowModal(true);
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <BookOpen className="h-8 w-8 text-blue-400" />
                <h1 className="text-2xl font-bold text-white">Library Management</h1>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-white">
                  <User className="h-5 w-5" />
                  <span className="font-medium">{user.username}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    user.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {user.role}
                  </span>
                </div>
                
                <button
                  onClick={logout}
                  className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>
  
        {/* Message */}
        {message && (
          <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4`}>
            <div className={`p-4 rounded-lg ${
              message.type === 'error' ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
            }`}>
              {message.text}
            </div>
          </div>
        )}
  
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search books by title or author..."
                    className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center space-x-2 text-white">
                  <input
                    type="checkbox"
                    checked={showAvailableOnly}
                    onChange={(e) => setShowAvailableOnly(e.target.checked)}
                    className="rounded bg-white/10 border-white/20 text-blue-600 focus:ring-blue-400"
                  />
                  <span>Available only</span>
                </label>
                
                {user.role === 'ADMIN' && (
                  <button
                    onClick={handleAddBook}
                    className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Book</span>
                  </button>
                )}
              </div>
            </div>
          </div>
  
          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.length > 0 ? (
              filteredBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onBorrow={handleBorrow}
                  onReturn={handleReturn}
                  onEdit={handleEditBook}
                  onDelete={handleDeleteBook}
                  userRole={user.role}
                  loading={loading}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-xl text-gray-400 mb-2">No books found</p>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search criteria' : 'No books available in the library'}
                </p>
              </div>
            )}
          </div>
  
          {/* Loading overlay */}
          {loading && (
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40">
              <div className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                <p className="text-white mt-2">Loading...</p>
              </div>
            </div>
          )}
        </main>
  
        {/* Book Modal */}
        {showModal && (
          <BookModal
            book={editingBook}
            onSave={handleSaveBook}
            onClose={() => {
              setShowModal(false);
              setEditingBook(null);
            }}
            loading={loading}
          />
        )}
      </div>
    );
  };
  export default Dashboard;