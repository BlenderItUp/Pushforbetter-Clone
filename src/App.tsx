import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './hooks/useAuth';

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
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route element={<PrivateRoute />}>
            <Route index element={<HomePage />} />
          </Route>
          <Route path="login" element={<LoginPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
};

export default App;