import React, { useEffect, useState } from 'react'
import './index.css'
import axios from 'axios'
import Nav from '../../../components/Nav'
import { useParams } from 'react-router-dom'
export default function UpdateForm() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: 0,
        price: 0,
        category: '',
        stockStatus: "In Stock",
        rating: 0,
        discount: 0
    })
    const [loading, setLoading] = useState(true)
    const { id } = useParams()
    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BACKEND_API}/api/admin/product/${id}`);
                if (response) setFormData(response.data.product);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        getData();

        // No cleanup needed, return undefined
        return undefined;
    }, []);
    const handleChange = e => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.put(`${import.meta.env.VITE_BACKEND_API}/api/admin/product/${id}`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response) alert("Product updated!")
            else alert("Failed")
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <div className='form' >
            <Nav></Nav>
            <h1>Add Product</h1>
            <form onSubmit={handleSubmit} >

                <div className='formGroup'>
                    <label htmlFor="name">Product Name</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className='formGroup'>

                    <label htmlFor="descriptionn">Description</label>
                    <textarea type="text" name="description" id="descriptionn" value={formData.description} onChange={handleChange} />
                </div>
                <div className='formGroup'>
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} />
                </div>
                <div className='formGroup'>
                    <label htmlFor="price">Price</label>
                    <input type="number" name='price' id='price' value={formData.price} onChange={handleChange} />
                </div>

                <div className='formGroup' >
                    <label htmlFor="category">Category</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange}>
                        <option value="">Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Home">Home</option>
                        <option value="Beauty">Beauty</option>
                        <option value="Sports">Sports</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div className='formGroup'>
                    <label htmlFor="stockStatus">stock Status</label>
                    <select name="stockStatus" id="stockStatus" value={formData.stockStatus} onChange={handleChange}>
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                    </select>
                </div>
                <div className='formGroup'>
                    <label htmlFor="rating">rating</label>
                    <input type="number" name='rating' id='rating' value={formData.rating} onChange={handleChange} />
                </div>
                <div className='formGroup'>
                    <label htmlFor="discount">discount</label>
                    <input type="number" name='discount' id='discount' value={formData.discount} onChange={handleChange} />
                </div>
                <button type='submit' >Update</button>

            </form>
        </div>
    )
}
