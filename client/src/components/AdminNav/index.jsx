import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './index.css';
import { IoIosCart } from "react-icons/io";
import { CiLogout } from "react-icons/ci";
import { CiLogin } from "react-icons/ci";
import { RiMenu3Line, RiCloseLine } from "react-icons/ri";
import { useSelector, useDispatch } from 'react-redux';
import { removeAuthData } from '../../Redux/authSlice';

export default function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const { userRole } = useSelector(state => state.auth);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handlelogout = () => {
        dispatch(removeAuthData());
        window.location.reload();
    };

    const handleLogin = () => {
        navigate('/login');
        setMobileMenuOpen(false);
    };

    const handleHome = () => {
        if (userRole !== 'user') {
            navigate(`/${userRole}/dashboard`);
        } else {
            navigate('/');
        }
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    const isAuthenticated = !!userRole;
    
    const isActive = (path) => {
        return location.pathname === path ? 'active' : '';
    };

    return (
        <>
            <div className={`nav ${scrolled ? 'scrolled' : ''}`}>
                <div className="logo-container">
                    <IoIosCart onClick={handleHome} fontSize={30} color={scrolled ? '#3b82f6' : 'black'} />
                </div>
                
                <div className='optionsNav'>
                    <Link to={`/${userRole}/dashboard`} className={isActive(`/${userRole}/dashboard`)}>Dashboard</Link>
                    <Link to={`/${userRole}/products`} className={isActive(`/${userRole}/products`)}>Products</Link>
                    
                    {isAuthenticated ? 
                        <button title='logout' onClick={handlelogout}>
                            <CiLogout fontSize={22} />
                        </button> 
                        : 
                        <button title='login' onClick={handleLogin}>
                            <CiLogin fontSize={22} />
                        </button>
                    }
                </div>
                
                <button className="mobile-menu-button" onClick={toggleMobileMenu}>
                    {mobileMenuOpen ? <RiCloseLine fontSize={24} /> : <RiMenu3Line fontSize={24} />}
                </button>
            </div>
            
            <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                <Link to={`/${userRole}/dashboard`} onClick={() => setMobileMenuOpen(false)}>Dashboard</Link>
                <Link to={`/${userRole}/products`} onClick={() => setMobileMenuOpen(false)}>Products</Link>
                
                {isAuthenticated ? 
                    <button onClick={handlelogout}>
                        <CiLogout fontSize={20} /> Logout
                    </button> 
                    : 
                    <button onClick={handleLogin}>
                        <CiLogin fontSize={20} /> Login
                    </button>
                }
            </div>
        </>
    );
}