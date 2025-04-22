import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './index.css';
import { IoIosCart } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";
import { BsCartPlusFill } from "react-icons/bs";
import { MdOutlineShoppingBag } from "react-icons/md";
import { HiMenuAlt3 } from "react-icons/hi";
import { IoCloseOutline } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { removeAuthData } from '../../Redux/authSlice';
import { useDispatch } from 'react-redux';

export default function Nav() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userRole } = useSelector(state => state.auth);
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    
    // Handle scroll effect for nav bar
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };
        
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [scrolled]);
    
    // Close menu when navigating
    useEffect(() => {
        return () => {
            setMenuOpen(false);
        };
    }, [navigate]);
    
    const handleLogout = () => {
        setMenuOpen(false);
        dispatch(removeAuthData());
        window.location.reload();
    };
    
    const handleLogin = () => {
        setMenuOpen(false);
        navigate('/login');
    };
    
    const handleHome = () => {
        setMenuOpen(false);
        if (userRole !== 'user') {
            navigate(`/${userRole}/dashboard`);
        } else {
            navigate('/');
        }
    };
    
    const navigateTo = (path) => {
        setMenuOpen(false);
        navigate(path);
    };
    
    const isAuthenticated = !!userRole;
    
    return (
        <>
            <div className={`nav ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
                <div className="logo" onClick={handleHome}>
                    <IoIosCart title='Home' fontSize={30} color='black' />
                    <span className="brand-name">DeshCart</span>
                </div>
                
                {/* Desktop navigation */}
                <div className='options desktop-options'>
                    <button 
                        onClick={() => navigate('/user/orders')} 
                        className="nav-button"
                    >
                        <MdOutlineShoppingBag fontSize={18} />
                        <span className="button-text">Orders</span>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/user/cart')} 
                        className="nav-button"
                    >
                        <BsCartPlusFill fontSize={18} />
                        <span className="button-text">Cart</span>
                    </button>
                    
                    {isAuthenticated ? (
                        <button 
                            title='Logout' 
                            onClick={handleLogout} 
                            className="nav-button auth-button"
                        >
                            <CiLogout fontSize={18} />
                            <span className="button-text">Logout</span>
                        </button>
                    ) : (
                        <button 
                            title='Login' 
                            onClick={handleLogin} 
                            className="nav-button auth-button"
                        >
                            <CiLogin fontSize={18} />
                            <span className="button-text">Login</span>
                        </button>
                    )}
                </div>
                
                {/* Mobile menu button */}
                <button 
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label={menuOpen ? "Close menu" : "Open menu"}
                >
                    {menuOpen ? (
                        <IoCloseOutline fontSize={24} />
                    ) : (
                        <HiMenuAlt3 fontSize={24} />
                    )}
                </button>
            </div>
            
            {/* Mobile menu overlay */}
            <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-items">
                    <button onClick={() => navigateTo('/user/orders')} className="mobile-menu-item">
                        <MdOutlineShoppingBag fontSize={22} />
                        <span>Orders</span>
                    </button>
                    
                    <button onClick={() => navigateTo('/user/cart')} className="mobile-menu-item">
                        <BsCartPlusFill fontSize={22} />
                        <span>Cart</span>
                    </button>
                    
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="mobile-menu-item">
                            <CiLogout fontSize={22} />
                            <span>Logout</span>
                        </button>
                    ) : (
                        <button onClick={handleLogin} className="mobile-menu-item">
                            <CiLogin fontSize={22} />
                            <span>Login</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}