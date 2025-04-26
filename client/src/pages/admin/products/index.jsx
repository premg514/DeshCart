import React, { useCallback, useEffect, useState } from "react";
import Nav from "../../../components/AdminNav";
import "./product.css";
import { useNavigate } from "react-router-dom";
import { RiPencilFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";

export default function AdminProducts() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [pagenum, setPagenum] = useState(1);
  const [loading, setLoading] = useState(true);
  const [trigger, settrigger] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const productresponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/admin/products/1`
        );
        if (productresponse) setData(productresponse.data.products);
        const usersResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_API}/api/admin/users`
        );
        if (usersResponse) setUsers(usersResponse.data.users);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();

    // No cleanup needed, return undefined
    return undefined;
  }, [trigger]);

  const itemsPerPage = 3;
  const initial = (pagenum - 1) * itemsPerPage;
  const end = pagenum * itemsPerPage;
  const splicedata = data.slice(initial, end);
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_API}/api/admin/product/${productId}`
      );
      alert("Item Deleted!");
      settrigger(!trigger);
    } catch (e) {
      console.log(e);
    }
  };

  const findShopkeeper = (id) => {
    const shopkeeper = users.filter((each) => each._id == id);
    return shopkeeper[0].name;
  };
  return (
    <div className="products">
      <Nav />

      <div className="container">
        <div className="top-container">
          <h1>Products</h1>
        </div>

        <div className="bottom-container">
          {loading ? (
            <div className="loading-container">
              <p>Loading products...</p>
            </div>
          ) : data.length === 0 ? (
            <div className="no-products">
              <p>No products available</p>
            </div>
          ) : (
            splicedata.map((product) => (
              <div key={product._id} className="product">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-content">
                  <div className="icons">
                    <MdDelete
                      fontSize={50}
                      color="red"
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
                      <span className="detail-label">Category:</span>
                      <span className="detail-value">{product.category}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Rating:</span>
                      <span className="detail-value">{product.rating}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Discount:</span>
                      <span className="detail-value">{product.discount}%</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-label">Shop Keeper:</span>
                      <span className="detail-value">
                        {findShopkeeper(product.shopkeeperID)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {!loading && data.length > 0 && (
          <div className="pagination-container">
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
  );
}
