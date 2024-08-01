import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <div>
      <header>
        {/* <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav> */}
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>&copy; 2024 My App</p>
      </footer>
    </div>
  );
};

export default Layout;
