import React, { useState } from "react";
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar'; 
import Header from './Header'; 


const Dashboard = () => {
    
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${isCollapsed ? "ml-16" : "ml-60"}`}>
        <Header />
        <main className="p-4 min-h-screen">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
