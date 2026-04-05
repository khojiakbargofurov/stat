import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Compass, LayoutDashboard, Map as MapIcon, Settings, Sun, Moon } from 'lucide-react';

const Layout = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      setIsDark(false);
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  };
  return (
    <div className="app-container">
      {/* Sidebar Layout */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Compass size={28} color="var(--accent)" />
          ToshkentTurizm
        </div>
        
        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            end
          >
            <LayoutDashboard size={20} />
            Asosiy Statistika
          </NavLink>
          
          <NavLink 
            to="/map" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <MapIcon size={20} />
            Xarita
          </NavLink>
          
          <NavLink 
            to="/admin" 
            className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
          >
            <Settings size={20} />
            Admin Panel
          </NavLink>
          
          <div className="sidebar-divider"></div>

          <button className="theme-toggle-btn" onClick={toggleTheme}>
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
            <span className="theme-toggle-text">{isDark ? "Light Mode" : "Dark Mode"}</span>
          </button>
        </nav>
      </aside>

      {/* Main Page Area */}
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
