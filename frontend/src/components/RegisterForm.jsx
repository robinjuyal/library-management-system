import { BookOpen } from "lucide-react";
import { useState } from "react";
import api from '../api/api'; // <-- Add this


const RegisterForm = ({ onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
      role: 'MEMBER'
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setError('');
      setSuccess('');
  
      try {
        await api.register(formData);
        setSuccess('Registration successful! Please login.');
        setTimeout(() => onSwitchToLogin(), 2000);
      } catch (err) {
        setError('Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <BookOpen className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
            <p className="text-blue-200 mt-2">Join the library system</p>
          </div>
  
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Username</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Choose a username"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-white mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-white mb-2">Password</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Create a password"
                required
              />
            </div>
  
            <div>
              <label className="block text-sm font-medium text-white mb-2">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="MEMBER" className="bg-gray-800">Member</option>
                <option value="ADMIN" className="bg-gray-800">Admin</option>
              </select>
            </div>
  
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 p-3 rounded-lg">
                {error}
              </div>
            )}
  
            {success && (
              <div className="text-green-400 text-sm text-center bg-green-500/10 p-3 rounded-lg">
                {success}
              </div>
            )}
  
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 transition-all duration-200"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
  
          <div className="text-center mt-6">
            <button
              onClick={onSwitchToLogin}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      </div>
    );
  };
  export default RegisterForm;