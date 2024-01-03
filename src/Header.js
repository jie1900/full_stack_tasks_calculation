import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [showIcon, setShowIcon] = useState(window.innerWidth > 500);

  useEffect(() => {
    const handleResize = () => {
      setShowIcon(window.innerWidth > 500);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="header-container">
      <div className="icon-and-title">
        {showIcon && (
          <span className="material-symbols-outlined">
            list
          </span>
        )}
        <h1>To Do List</h1>
      </div>
    </header>
  );
};

export default Header;
