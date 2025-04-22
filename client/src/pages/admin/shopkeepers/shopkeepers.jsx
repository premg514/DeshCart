import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ShopkeepersPage.css';
import { FaTrash, FaEdit, FaEye } from 'react-icons/fa';

export default function ShopkeepersPage() {
    const [shopkeepers, setShopkeepers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedShopkeeper, setSelectedShopkeeper] = useState(null);

    useEffect(() => {
        fetchShopkeepers();
    }, []);

    const fetchShopkeepers = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/getShopkeepers`);
            
            setShopkeepers(response.data.shopkeepers || []);
            setError(null);
        } catch (err) {
            console.error("Error fetching shopkeepers:", err);
            setError(err.response?.data?.message || "Failed to fetch shopkeepers");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteShopkeeper = async (shopkeeperId) => {
        if (window.confirm('Are you sure you want to delete this shopkeeper?')) {
            try {
                await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/admin/shopkeepers/${shopkeeperId}`);
                fetchShopkeepers();
            } catch (err) {
                console.error("Error deleting shopkeeper:", err);
                setError(err.response?.data?.message || "Failed to delete shopkeeper");
            }
        }
    };

    const handleViewDetails = (shopkeeper) => {
        setSelectedShopkeeper(shopkeeper);
    };

    const renderShopkeeperDetails = () => {
        if (!selectedShopkeeper) return null;

        return (
            <div className="shopkeeper-details-modal">
                <div className="shopkeeper-details-content">
                    <button 
                        className="close-button" 
                        onClick={() => setSelectedShopkeeper(null)}
                    >
                        &times;
                    </button>
                    <h2>Shopkeeper Details</h2>
                    <table>
                        <tbody>
                            <tr>
                                <th>Name:</th>
                                <td>{selectedShopkeeper.name}</td>
                            </tr>
                            <tr>
                                <th>Email:</th>
                                <td>{selectedShopkeeper.email}</td>
                            </tr>
                            <tr>
                                <th>Role:</th>
                                <td>{selectedShopkeeper.role}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return <div className="loading">Loading shopkeepers...</div>;
    }

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="shopkeepers-container">
            <h1>Shopkeepers Management</h1>
            
            {shopkeepers.length === 0 ? (
                <div className="no-shopkeepers">
                    <p>No shopkeepers found</p>
                </div>
            ) : (
                <table className="shopkeepers-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {shopkeepers.map((shopkeeper) => (
                            <tr key={shopkeeper._id}>
                                <td>{shopkeeper.name}</td>
                                <td>{shopkeeper.email}</td>
                                <td className="action-buttons">
                                    <button 
                                        onClick={() => handleViewDetails(shopkeeper)}
                                        title="View Details"
                                    >
                                        <FaEye />
                                    </button>
                                    <button 
                                        title="Delete Shopkeeper"
                                        onClick={() => handleDeleteShopkeeper(shopkeeper._id)}
                                    >
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {renderShopkeeperDetails()}
        </div>
    );
}