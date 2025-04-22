import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import axios from 'axios';
import Nav from '../../../components/UserNav';
import './index.css';
import SplitText from "./SplitText";
// Lazy load the Product component
const Product = lazy(() => import('../../../components/Product/Product'));

//images
import shop from '../../../assets/shop.jpg'
import grocery from '../../../assets/grocery.jpeg'
import electronics from '../../../assets/electronics.jpg'
import { Link } from 'react-router-dom';

// Create a LazyImage component for image lazy loading
const LazyImage = ({ src, alt, className }) => {
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div ref={imgRef} className={`lazy-image-container ${className || ''}`}>
      {isInView ? (
        <img src={src} alt={alt} className={className} />
      ) : (
        <div className="image-placeholder"></div>
      )}
    </div>
  );
};

const carouselData = [
  {
    id: 1,
    image: shop, // Using placeholder
    title: "New Collection 2025",
    description: "Discover our latest arrivals with cutting-edge design and unmatched quality.",
    buttonText: "Shop Now",
    buttonClass: "blue-button"
  },
  {
    id: 2,
    image: grocery, // Using placeholder 
    title: "Groceries",
    description: "you can buy groceries as well.",
    buttonText: "Shop Now",
    color: "#e74c3c"
  },
  {
    id: 3,
    image: electronics, // Using placeholder
    title: "Premium Electronics",
    description: "Cutting-edge technology at your fingertips. Explore our electronics collection.",
    buttonText: "Discover More",
    buttonClass: "green-button"
  }
];
const tabs = ["AllCategories", "Electronics", "Clothing", "Groceries", "Food", "Home", "Vegetables", "Beauty", "Sports", "Other"]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState("AllCategories");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const autoplayTimeRef = useRef(null);
  const intervalTime = 3000; // 5 seconds per slide
  const productsRef = useRef(null);

  // Fetch products with filters
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('page', currentPage);
      params.append('limit', productsPerPage);
      
      if (searchTerm.trim() !== "") {
        params.append('search', searchTerm.trim());
      }
      
      if (activeTab !== "AllCategories") {
        params.append('category', activeTab);
      }
      
      const url = `${import.meta.env.VITE_BACKEND_API}/api/admin/products/1?${params.toString()}`;
      const productResponse = await axios.get(url);
      
      setProducts(productResponse.data.products);
      setTotalPages(productResponse.data.pagination.totalPages);
      setTotalProducts(productResponse.data.pagination.total);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch products');
      setLoading(false);
      console.error('Error fetching products:', err);
    }
  };

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [currentPage, activeTab]);

  // Fetch products when search term changes, but with a slight delay
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setCurrentPage(1); // Reset to first page on new search
      fetchProducts();
    }, 500);
    
    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  const resetAutoplay = () => {
    if (autoplayTimeRef.current) {
      clearInterval(autoplayTimeRef.current);
    }

    autoplayTimeRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselData.length);
    }, intervalTime);

    return () => {
      clearInterval(autoplayTimeRef.current);
    };
  };

  useEffect(() => {
    const cleanup = resetAutoplay();
    return cleanup;
  }, [currentSlide]);

  useEffect(() => {
    if (isHovered) {
      if (autoplayTimeRef.current) {
        clearInterval(autoplayTimeRef.current);
      }
    } else {
      resetAutoplay();
    }

    return () => {
      if (autoplayTimeRef.current) {
        clearInterval(autoplayTimeRef.current);
      }
    };
  }, [isHovered]);

  // Add lazy loading for carousel images - load only the current and adjacent slides
  const shouldLoadCarouselImage = (index) => {
    return index === currentSlide || 
           index === (currentSlide + 1) % carouselData.length || 
           index === (currentSlide - 1 + carouselData.length) % carouselData.length;
  };

  const handlePrev = () => {
    setCurrentSlide(prev => (prev === 0 ? carouselData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide(prev => (prev + 1) % carouselData.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to products section
    if (productsRef.current) {
      productsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Generate page numbers for pagination
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Create loading fallback for Suspense
  const ProductLoading = () => (
    <div className="product-loading-skeleton">
      <div className="skeleton-image"></div>
      <div className="skeleton-title"></div>
      <div className="skeleton-price"></div>
      <div className="skeleton-button"></div>
    </div>
  );

  return (
    <div className='homePage'>
      <Nav />
      <div className='page'>
        <SplitText
          text="Welcome to ShopEase"
          className="text-5xl font-semibold text-center"
          delay={150}
          animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
          animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
          easing="easeOutCubic"
          threshold={0.2}
          rootMargin="-50px"
        />

        {/* Hero Carousel */}
        <div
          className="hero-section"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div
            className="carousel-container"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {carouselData.map((slide, index) => (
              <div key={slide.id} className="slide">
                {shouldLoadCarouselImage(index) ? (
                  <LazyImage src={slide.image} alt={slide.title} className="slide-image" />
                ) : (
                  <div className="slide-image-placeholder"></div>
                )}
                <div className="slide-content">
                  <h2 className="slide-title">{slide.title}</h2>
                  <p className="slide-description">{slide.description}</p>
                  <button className={`slide-button ${slide.buttonClass}`}>
                    {slide.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Dots */}
          <div className="dots-container">
            {carouselData.map((_, index) => (
              <div
                key={index}
                className={`dot ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {/* Arrow Navigation */}
          <div
            className="arrow-button arrow-left"
            onClick={handlePrev}
          >
            &#10094;
          </div>
          <div
            className="arrow-button arrow-right"
            onClick={handleNext}
          >
            &#10095;
          </div>
        </div>

        {/* Products Section */}
        <div className='products-section' ref={productsRef}>
          <h2 className="section-title">Our Products</h2>
          
          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />
            <button className="search-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </button>
          </div>
          
          <div className='tab-container'>
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading products...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => fetchProducts()}>Retry</button>
            </div>
          ) : products.length > 0 ? (
            <>
              <div className="products-grid">
                {products.map(product => (
                  <Suspense key={product._id} fallback={<ProductLoading />}>
                    <Product product={product} />
                  </Suspense>
                ))}
              </div>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <button 
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="pagination-button"
                  >
                    &laquo;
                  </button>
                  
                  {pageNumbers.map(number => (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                    >
                      {number}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="pagination-button"
                  >
                    &raquo;
                  </button>
                </div>
              )}
              
              <div className="results-info">
                Showing {products.length} of {totalProducts} products
              </div>
            </>
          ) : (
            <div className="no-products-message">
              <p>No products found matching your criteria.</p>
              {searchTerm && (
                <button className="clear-search" onClick={() => setSearchTerm("")}>
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}