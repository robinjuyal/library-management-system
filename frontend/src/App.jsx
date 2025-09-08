import React, { useState, useContext } from 'react';
import AuthProvider from './auth/AuthProvider';
import AuthContext from './auth/AuthContext';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Dashboard from './components/DashBoard';

const LibraryManagementApp = () => {
  const [showRegister, setShowRegister] = useState(false);
  const { user } = useContext(AuthContext);

  if (user) return <Dashboard />;
  return showRegister 
    ? <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
    : <LoginForm onSwitchToRegister={() => setShowRegister(true)} />;
};

const App = () => (
  <AuthProvider>
    <LibraryManagementApp />
  </AuthProvider>
);

export default App;
