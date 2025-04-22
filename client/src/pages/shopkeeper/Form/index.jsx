import React, { useState } from 'react'
import './index.css'
import axios from 'axios'
import Nav from '../../../components/Nav'
import { useSelector } from 'react-redux';
export default function Form() {
    const {userID } = useSelector(state => state.auth)
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        quantity: 0,
        price: 0,
        image: '',
        category: '',
        stockStatus: "In Stock",
        rating: 0,
        discount: 0,
        shopkeeperID: userID
    })
    const [imageFile, setImageFile] = useState('')
    const handleChange = e => {
        if (e.target.name === 'image') {
            setImageFile(e.target.files[0]);
            setFormData({
                ...formData,
                [e.target.name]: e.target.files[0]?.name || ''
            })
        }
        else setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {

            const data = new FormData()
            data.append('name', formData.name)
            data.append('description', formData.description)
            data.append('quantity', formData.quantity)
            data.append('price', formData.price)
            data.append('category', formData.category)
            data.append('stockStatus', formData.stockStatus)
            data.append('rating', formData.rating)
            data.append('discount', formData.discount)
            data.append('shopkeeperID', formData.shopkeeperID)
            if (formData.image) {
                data.append('image', imageFile)
            }
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_API}/api/admin/create`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (response) alert("Product added!")
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
                    <input type="text" name="name" id="name" onChange={handleChange} />
                </div>
                <div className='formGroup'>

                    <label htmlFor="descriptionn">Description</label>
                    <textarea type="text" name="description" id="descriptionn" onChange={handleChange} />
                </div>
                <div className='formGroup'>
                    <label htmlFor="quantity">Quantity</label>
                    <input type="number" name="quantity" id="quantity" onChange={handleChange} />
                </div>
                <div className='formGroup'>
                    <label htmlFor="price">Price</label>
                    <input type="number" name='price' id='price' onChange={handleChange} />
                </div>
                <div className='formGroup'>
                    <label htmlFor="image">Image</label>
                    <input type="file" name='image' id='image' onChange={handleChange} />
                </div>
                <div className='formGroup' >
                    <label htmlFor="category">Category</label>
                    <select name="category" id="category" value={formData.category} onChange={handleChange}>
                        <option value="">Category</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Groceries">Groceries</option>
                        <option value="Vegetables">Vegetables</option>
                        <option value="Food">Food</option>
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
                    <input type="number" name='rating' id='rating' onChange={handleChange} />
                </div>
                <div className='formGroup'>
                    <label htmlFor="discount">discount</label>
                    <input type="number" name='discount' id='discount' onChange={handleChange} />
                </div>
                <button type='submit' >Submit</button>

            </form>
        </div>
    )
}
