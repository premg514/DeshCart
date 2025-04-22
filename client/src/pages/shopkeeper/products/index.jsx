import React, { useCallback, useEffect, useState } from 'react'
import Nav from '../../../components/Nav'
import './index.css'
import { useNavigate } from 'react-router-dom';
import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from 'axios';

import { useSelector } from 'react-redux';

export default function Products() {
    const {userID } = useSelector(state => state.auth)
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [pagenum, setPagenum] = useState(1)
    const [loading, setLoading] = useState(true)
    const [trigger, settrigger] = useState(false)

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true)
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/products/${userID}`);
                if (response) setData(response.data.products);
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false)
            }
        };

        getData();

        // No cleanup needed, return undefined
        return undefined;
    }, [trigger]);

    const itemsPerPage = 3
    const initial = (pagenum - 1) * itemsPerPage
    const end = pagenum * itemsPerPage
    const splicedata = data.slice(initial, end)
    const totalPages = Math.ceil(data.length / itemsPerPage)

    const handleDeleteProduct = async (productId) => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_BACKEND_API}/api/admin/product/${productId}`)
            alert("Item Deleted!")
            settrigger(!trigger)
        } catch (e) {
            console.log(e);

        }
    }

    const handleEditProduct = (productId) => {
        navigate(`/shopkeeper/update-product/${productId}`)
    }

    return (
        <div className='products'>
            <Nav />

            <div className='container'>
                <div className='top-container'>
                    <h1>Products</h1>
                    <button className="add-button" onClick={() => navigate('/shopKeeper/add-product')}>Add Product <FaPlus /></button>
                </div>

                <div className='bottom-container'>
                    {loading ? (
                        <div className="loading-container">
                            <p>Loading products...</p>
                        </div>
                    ) : data.length === 0 ? (
                        <div className="no-products">
                            <p>No products available</p>
                            <button className="add-button" onClick={() => navigate('/shopKeeper/add-product')}>Add Product</button>
                        </div>
                    ) : (
                        splicedata.map((product) => (
                            <div key={product._id} className='product'>
                                <div className="product-image">
                                    <img src={product.image} alt={product.name} />
                                </div>
                                <div className='product-content'>
                                    <div className='icons'>
                                        <RiPencilFill
                                            fontSize={30}
                                            color='blue'
                                            className="action-icon edit-icon"
                                            onClick={() => handleEditProduct(product._id)}
                                        />
                                        <MdDelete
                                            fontSize={30}
                                            color='red'
                                            className="action-icon delete-icon"
                                            onClick={() => handleDeleteProduct(product._id)}
                                        />
                                    </div>
                                    <h4 className="product-name">{product.name}</h4>
                                    <p className="product-description">{product.description}</p>
                                    <div className="product-details">
                                        <div className="detail-item">
                                            <span className="detail-label">Quantity:</span>
                                            <span className="detail-value">{product.quantity}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Price:</span>
                                            <span className="detail-value">{product.price}/-</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className={`stock-status ${product.stockStatus ? 'In Stock' : 'out-of-stock'}`}>
                                                {product.stockStatus ? "In Stock" : "Out of Stock"}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Rating:</span>
                                            <span className="detail-value">{product.rating}</span>
                                        </div>
                                        <div className="detail-item">
                                            <span className="detail-label">Discount:</span>
                                            <span className="detail-value">{product.discount}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {!loading && data.length > 0 && (
                    <div className='pagination-container'>
                        <button
                            className="pagination-button"
                            onClick={() => setPagenum(pagenum - 1)}
                            disabled={pagenum === 1}
                        >
                            <IoIosArrowBack />
                        </button>
                        <div className="page-indicator">
                            <span className="current-page">{pagenum}</span>
                            <span className="total-pages">of {totalPages}</span>
                        </div>
                        <button
                            className="pagination-button"
                            onClick={() => setPagenum(pagenum + 1)}
                            disabled={pagenum >= totalPages}
                        >
                            <IoIosArrowForward />
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}