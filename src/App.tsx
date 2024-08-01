import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './hooks/useAuth';
import { useDispatch } from 'react-redux';
import { initializeSettings } from './slices/settingsSlice';

import Layout from './pages/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';


import Dashboard from './components/Dashboard';
// const App: React.FC = () => {
//   return (
//     <div className="App">
//       <Dashboard></Dashboard>
//     </div>
//   );
// }
// src/App.tsx


const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeSettings());
  }, [dispatch]);
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PrivateRoute />}>
            <Route index element={<Dashboard/>} />
          </Route>
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;