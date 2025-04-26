import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Nav from '../../../components/AdminNav';
import './index.css';
import { useNavigate } from 'react-router-dom';
import { MdProductionQuantityLimits } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
  const { userID } = useSelector(state => state.auth); // ✅ Correctly placed useSelector
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [shopkeepers, setShopkeepers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/products/1`);
        if (response) setProducts(response.data.products.length);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    fetchShopkeepers();
  }, []);

  const fetchShopkeepers = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/getShopkeepers`);
      setShopkeepers(response.data.shopkeepers.length || 0);
    } catch (err) {
      console.error("Error fetching shopkeepers:", err);
      setError(err.response?.data?.message || "Failed to fetch shopkeepers");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='dashboard'>
      <Nav />
      <div className='dashboardhome'>
        <h1>Hi Admin 👋</h1>
        <h4>Here is your dashboard.</h4>

        {error && <p style={{ color: 'red' }}>{error}</p>} 

        <div className='highlightCards'>
          <div className='card' onClick={() => navigate('/admin/products')}>
            <div className='card-top'>
              <h3>Total Products</h3>
              <MdProductionQuantityLimits fontSize={25} />
            </div>
            <div className='card-bottom'>
              <h1>{loading ? <LoadingSpinner className="loading-spinner" style={{ width: '40px', height: '40px', borderWidth: '4px' }} /> : products}</h1>
            </div>
          </div>
          <div className='card' onClick={() => navigate('/admin/getShopkeepers')}>
            <div className='card-top'>
              <h3>Shop Keepers</h3>
              <TfiStatsUp fontSize={23} />
            </div>
            <div className='card-bottom'>
              <h1>{shopkeepers}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import the LoadingSpinner from AuthStyles
import { LoadingSpinner } from '../../auth/styledComponents';

export default AdminDashboard;
