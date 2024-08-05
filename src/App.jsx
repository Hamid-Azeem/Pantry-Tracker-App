import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard'; 
import Login from './components/Login'; 
import SignUp from './components/SignUp'; 
import AddItem from './components/AddItem'; 
import ItemList from './components/ItemList';
import SearchItem from './components/SearchItem';
import Profile from './components/Profile'; 
import PrivateRoute from './components/PrivateRoute'; 

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        <Route path="/" element={<PrivateRoute element={Dashboard} />}>
          <Route path="add-product" element={<AddItem />} />
          <Route path="show-products" element={<ItemList />} />
          <Route path="search-product" element={<SearchItem />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

