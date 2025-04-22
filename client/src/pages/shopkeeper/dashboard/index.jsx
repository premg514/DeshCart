
// components/Dashboard.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Nav from '../../../components/Nav';
import './index.css'
import { useNavigate } from 'react-router-dom';
import { MdProductionQuantityLimits } from "react-icons/md";
import { TfiStatsUp } from "react-icons/tfi";
import { TfiStatsDown } from "react-icons/tfi";

import { useSelector } from 'react-redux';

const Dashboard = () => {
  const {userID} = useSelector(state => state.auth)
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState(0)
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate()
  useEffect(() => {
          let isMounted = true;
  
          const fetchData = async () => {
              try {
                  setLoading(true);
                  const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/orders/${userID}`);
                  
                  if (isMounted) {
                     
                      const productIds = [...new Set(response.data.data.flatMap(order =>
                          order.products.map(product => product.product)
                      ))].length;
                    setSales(productIds)
                     
                  }
              } catch (error) {
                  console.error("Error fetching orders:", error);
                  if (isMounted) setError("Failed to fetch orders. Please try again later.");
              } finally {
                  if (isMounted) setLoading(false);
              }
          };
  
          if (userID) {
              fetchData();
          }
  
          return () => {
              isMounted = false;
          };
      }, [userID]);

  useEffect(() => {
    const fetchUserData = async () => {
      const shopkeeperID = localStorage.getItem('userID')
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/products/${shopkeeperID}`);
        if (response) setProducts(response.data.products.length);
        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchUserData();
  }, [userID]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login')
  };

 console.log(products)

  return (
    <div className='dashboard' >
      <Nav />
      <div className='dashboardhome' >
        <h1>Hi Shop Keeper 👋</h1>
        <h4>Here is your dashboard.</h4>

        <div className='highlightCards' >
          <div className='card' onClick={()=>navigate('/shopkeeper/products')} >
            <div className='card-top'  >
              <h3>Total Products</h3>
              <MdProductionQuantityLimits fontSize={25} />
            </div>
            <div className='card-bottom' >
              <h1>{loading ? <LoadingSpinner style={{ width: '40px', height: '40px', borderWidth: '4px' }} /> : products}</h1>
            </div>
          </div>
          <div className='card' onClick={()=> navigate('/shopkeeper/sales')} >
            <div className='card-top' >
              <h3>Total Sales</h3>
              <TfiStatsUp fontSize={23} />
            </div>
            <div className='card-bottom' >
              <h1>{sales}</h1>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

// Import the LoadingSpinner from AuthStyles
import { LoadingSpinner } from '../../auth/styledComponents';

export default Dashboard;