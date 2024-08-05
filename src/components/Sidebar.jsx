import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaPlus, FaList, FaSearch, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { signOut } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Sidebar = ({ userName, isCollapsed, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState(location.pathname);

  const displayName = userName?.split('@')[0] || 'User';

  const menuItems = [
    { to: "/add-product", label: "Add Product", icon: FaPlus },
    { to: "/show-products", label: "Show Products", icon: FaList },
    { to: "/search-product", label: "Search Product", icon: FaSearch },
    { to: "/profile", label: "Profile", icon: FaUser },
    { to: "/log-out", label: "Log Out", icon: FaSignOutAlt }
  ];

  const handleItemClick = (path) => {
    if (path === '/log-out') {
      handleLogout();
    } else {
      setActiveItem(path);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  return (
    <aside className={`bg-gray-800 text-white py-6 min-h-screen fixed left-0 top-0 transition-width duration-300 ${isCollapsed ? "w-16" : "w-60"}`}>
      <button 
        onClick={toggleSidebar} 
        className="text-2xl mb-6 px-4 focus:outline-none hover:text-gray-400 transition-colors duration-300"
      >
        <FaBars />
      </button>
      <h1 className={`text-2xl mx-3 font-bold flex items-center ${isCollapsed ? "justify-center" : ""}`}>
        <FaUser className="mr-2 text-2xl" />
        {!isCollapsed && displayName}
      </h1>
      <ul className="text-[1rem] font-[500] py-4 space-y-4">
        {menuItems.map((item) => (
          <li 
            key={item.to} 
            className={`flex items-center rounded-tl-[50px] rounded-bl-[50px] ${activeItem === item.to ? 'bg-gray-700' : ''}`} 
            onClick={() => handleItemClick(item.to)}
          >
            <Link className="flex items-center gap-3 py-2 px-3 w-full hover:text-gray-400 transition-colors duration-300" to={item.to}>
              <item.icon className="text-2xl" />
              {!isCollapsed && item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
