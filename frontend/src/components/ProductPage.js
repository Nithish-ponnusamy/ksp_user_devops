import React, { useState, useEffect } from "react";
import { FaRupeeSign, FaSpinner, FaSearch, FaRegHeart, FaHeart, FaTags, FaShoppingCart, FaStar, FaPalette, FaTimes, FaCircle, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence, useAnimation, useScroll } from "framer-motion";
import useProducts from "../hooks/useProducts";
import { fallbackImageBase64 } from '../assets/fallback';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll()
  
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-2 bg-gradient-to-r from-teal-500 via-blue-600 to-purple-600 origin-left z-50"
      style={{ scaleX: scrollYProgress }}
    />
  )
}

const ColorPalette = ({ availableColors, selectedColors, toggleColor }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Common yarn colors with their hex values
  const colorMap = {
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Green': '#008000',
    'Yellow': '#FFFF00',
    'Purple': '#800080',
    'Pink': '#FFC0CB',
    'Orange': '#FFA500',
    'Brown': '#A52A2A',
    'Black': '#000000',
    'White': '#FFFFFF',
    'Gray': '#808080',
    'Beige': '#F5F5DC',
    'Teal': '#008080',
    'Navy': '#000080',
    'Navy Blue': '#000080',
    'Sky Blue': '#87CEEB',
    'Dark Green': '#006400',
    'Light Pink': '#FFB6C1',
    'Dark Milange': '#666666',
    'Light Milange': '#AAAAAA',
    'Steel Grey': '#71797E',
    'Maroon': '#800000',
    'Rose': '#FF007F',
    'Lavander': '#E6E6FA',
    'Majentha': '#FF00FF',
    'Nut Brown': '#5C4033',
    'Onion': '#CC7722',
    'Violet': '#8F00FF',
    'Water Green': '#73C2FB',
    'Peacock Green': '#00A693',
    'F Green': '#009E60',
    'T Blue': '#0087BD',
    'Baby Pink': '#F4C2C2',
    'L Rose': '#E8909C',
    'kavee': '#A0522D',
    'p Green': '#98FB98',
    'Water Blue': '#AEC6CF',
    'G Yellow': '#FFD700',
    'L Yellow': '#FFFFE0',
    'F Orange': '#FF5F1F',
    'C Orange': '#FF7F50',
    'H White': '#F8F8FF',
    'R Green': '#009900',
  };

  // Map color names to their hex values
  const getColorHex = (colorName) => {
    if (!colorName) return '#CCCCCC';
    
    // Try direct mapping first
    if (colorMap[colorName]) return colorMap[colorName];
    
    // Try case-insensitive search
    const lowerColorName = colorName.toLowerCase();
    const colorKey = Object.keys(colorMap).find(key => 
      key.toLowerCase() === lowerColorName
    );
    
    return colorKey ? colorMap[colorKey] : '#CCCCCC'; // Default gray if not found
  };

  // Create a preview of colors for the collapsed chart
  const colorPreview = availableColors.slice(0, 5).map(color => (
    <div 
      key={color}
      className="w-5 h-5 rounded-full border border-gray-300"
      style={{ backgroundColor: getColorHex(color) }}
    />
  ));

  return (
    <motion.div 
      className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <FaPalette className="text-xl text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-800">Filter by Color</h3>
          
          {selectedColors.length > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
              {selectedColors.length} selected
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          {!isExpanded && selectedColors.length === 0 && (
            <div className="flex items-center gap-1">
              {colorPreview}
              {availableColors.length > 5 && (
                <span className="text-xs text-gray-500 font-medium">+{availableColors.length - 5} more</span>
              )}
            </div>
          )}
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-100 p-2 rounded-full"
          >
            <FaChevronDown className="text-gray-600" />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pt-6 border-t border-gray-100 mt-4">
              {availableColors.length === 0 ? (
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">No color information available for the products</p>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {availableColors.map((color) => (
                    <motion.button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`relative h-16 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all border-2 ${
                        selectedColors.includes(color) ? 'border-blue-500 shadow-lg scale-110' : 'border-gray-200'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div 
                        className="w-8 h-8 rounded-full mb-1 border border-gray-300 shadow-sm"
                        style={{ backgroundColor: getColorHex(color) }}
                      />
                      {selectedColors.includes(color) && (
                        <motion.div 
                          className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring" }}
                        >
                          <FaTimes className="text-white text-xs" />
                        </motion.div>
                      )}
                      <span className="text-xs font-medium text-center w-full truncate px-1">
                        {color}
                      </span>
                    </motion.button>
                  ))}
                </div>
              )}

              {selectedColors.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-600">Active filters:</span>
                  {selectedColors.map(color => (
                    <motion.span
                      key={color}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring" }}
                    >
                      {color}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleColor(color);
                        }}
                        className="ml-1 text-blue-700 hover:text-blue-900"
                      >
                        <FaTimes size={12} />
                      </button>
                    </motion.span>
                  ))}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      selectedColors.forEach(color => toggleColor(color));
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
                  >
                    Clear all
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isExpanded && selectedColors.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {selectedColors.map(color => (
            <motion.span
              key={color}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring" }}
            >
              {color}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleColor(color);
                }}
                className="ml-1 text-blue-700 hover:text-blue-900"
              >
                <FaTimes size={12} />
              </button>
            </motion.span>
          ))}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              selectedColors.forEach(color => toggleColor(color));
            }}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-300 transition-colors"
          >
            Clear all
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

const ProductPage = ({ addToCart, isAuthenticated }) => {
  const {
    products: filteredProducts,
    searchTerm,
    setSearchTerm,
    sortBy,
    setSortBy,
    loading,
    error,
    selectedColors,
    setSelectedColors,
    availableColors
  } = useProducts();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const controls = useAnimation();
  const [imageError, setImageError] = useState({});
  const [wishlistItems, setWishlistItems] = useState(new Set());
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedProduct) {
      controls.start("visible");
    }
  }, [controls, selectedProduct]);

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      // Save product to localStorage and redirect to login
      localStorage.setItem('pendingCartProduct', JSON.stringify(product));
      navigate('/login');
      return;
    }
    
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Check for pending cart product after authentication
  useEffect(() => {
    if (isAuthenticated) {
      const pendingProduct = localStorage.getItem('pendingCartProduct');
      if (pendingProduct) {
        try {
          const product = JSON.parse(pendingProduct);
          setSelectedProduct(product);
          setShowModal(true);
          // Clear the pending product
          localStorage.removeItem('pendingCartProduct');
        } catch (err) {
          console.error('Error parsing pending cart product:', err);
        }
      }
    }
  }, [isAuthenticated]);

  const confirmAddToCart = () => {
    if (quantity > 0) {
      addToCart({ ...selectedProduct, quantity });
      setShowModal(false);
      setQuantity(1);
    }
  };

  const handleImageError = (productId) => {
    setImageError(prev => ({
      ...prev,
      [productId]: true
    }));
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => {
      if (prev.includes(color)) {
        return prev.filter(c => c !== color);
      } else {
        return [...prev, color];
      }
    });
  };

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      setWishlistLoading(true);
      const response = await axios.get("http://10.111.224.158:5000/api/user/wishlist", {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Convert wishlist items to a Set of productIds for easy lookup
      const wishlistSet = new Set(
        (response.data.wishlist || []).map(item => item.productId)
      );
      setWishlistItems(wishlistSet);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setWishlistLoading(false);
    }
  };

  const toggleWishlist = async (e, product) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Authentication token not found");

      const productId = product.id;
      
      if (wishlistItems.has(productId)) {
        // Remove from wishlist
        await axios.delete(`http://10.111.224.158:5000/api/user/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(productId);
          return newSet;
        });
      } else {
        // Add to wishlist
        await axios.post("http://10.111.224.158:5000/api/user/wishlist", {
          productId,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description,
          category: product.category
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setWishlistItems(prev => {
          const newSet = new Set(prev);
          newSet.add(productId);
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  const renderProductImage = (product) => {
    if (!product.image || imageError[product.id]) {
      return (
        <motion.div 
          className="w-full h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center rounded-lg"
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src={fallbackImageBase64} 
            alt="Not available"
            className="w-28 h-28 opacity-50"
          />
          <span className="text-gray-500 text-sm mt-2 font-medium">Image not available</span>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative w-full h-52 overflow-hidden rounded-t-lg"
      >
        <img
          src={product.image.startsWith('data:') ? product.image : `data:image/jpeg;base64,${product.image}`}
          alt={product.name}
          className="w-full h-52 object-cover transition-all duration-500 hover:scale-110 group-hover:scale-110"
          loading="lazy"
          onError={() => handleImageError(product.id)}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent rounded-t-lg" />
      </motion.div>
    );
  };

  const renderProductCard = (product) => (
    <motion.div
      key={product.id}
      className="relative border rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:translate-y-[-5px] cursor-pointer bg-white/95 backdrop-blur-sm group"
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        {renderProductImage(product)}
        
        <motion.button
          onClick={(e) => toggleWishlist(e, product)}
          className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {wishlistLoading ? (
            <FaSpinner className="text-gray-400 text-xl animate-spin" />
          ) : wishlistItems.has(product.id) ? (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 20 }}>
              <FaHeart className="text-red-500 text-xl" />
            </motion.div>
          ) : (
            <FaRegHeart className="text-gray-600 text-xl" />
          )}
        </motion.button>

        {product.isNew && (
          <motion.div 
            className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            New
          </motion.div>
        )}

        {product.discount > 0 && (
          <motion.div 
            className="absolute bottom-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold rounded-full shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
          >
            {product.discount}% OFF
          </motion.div>
        )}
      </div>

      <div className="p-6 text-gray-900">
        <div className="flex items-center gap-2 mb-3">
          <FaTags className="text-blue-600" />
          <span className="text-sm bg-blue-100 text-blue-600 font-medium px-2 py-1 rounded-full">
            {product.category}
          </span>
          
          {/* Add color indicator if product has color */}
          {(product.color || product.colorName || product.yarn_color) && (
            <div className="flex items-center gap-1 ml-2">
              <FaCircle 
                className="text-sm" 
                style={{ 
                  color: getColorHex(product.color || product.colorName || product.yarn_color) 
                }} 
              />
              <span className="text-sm font-medium">
                {product.color || product.colorName || product.yarn_color}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < (product.rating || 4) ? "text-yellow-400" : "text-gray-300"} />
          ))}
          <span className="text-xs text-gray-500 ml-2">({product.reviews || Math.floor(Math.random() * 100) + 5} reviews)</span>
        </div>

        <h2 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-purple-500 to-blue-500 text-transparent bg-clip-text group-hover:scale-105 transition-transform">
          {product.name}
        </h2>
        
        <p className="text-gray-700 mb-4 transition-all duration-300">
          {product.description}
        </p>
        
        <div className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
          <motion.span 
            className={`w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}
          ></motion.span>
          <span className={product.stock > 0 ? 'text-green-700' : 'text-red-700'}>
            {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
          </span>
        </div>
        
        <div className="flex justify-between items-center mt-6">
          <motion.div 
            className="text-2xl font-bold"
            whileHover={{ scale: 1.05 }}
          >
            <FaRupeeSign className="inline-block mr-1 text-teal-600" />
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text">
              {product.price.toFixed(2)}
            </span>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToCart(product);
            }}
            disabled={product.stock === 0}
            className={`px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 ${
              product.stock === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700'
            } text-white transition-colors duration-200`}
          >
            <FaShoppingCart />
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );

  // Helper function to get color hex values - same as in ColorPalette component
  const getColorHex = (colorName) => {
    if (!colorName) return '#CCCCCC';
    
    const colorMap = {
      'Red': '#FF0000',
      'Blue': '#0000FF',
      'Green': '#008000',
      'Yellow': '#FFFF00',
      'Purple': '#800080',
      'Pink': '#FFC0CB',
      'Orange': '#FFA500',
      'Brown': '#A52A2A',
      'Black': '#000000',
      'White': '#FFFFFF',
      'Gray': '#808080',
      'Beige': '#F5F5DC',
      'Teal': '#008080',
      'Navy': '#000080',
      'Navy Blue': '#000080',
      'Sky Blue': '#87CEEB',
      'Dark Green': '#006400',
      'Light Pink': '#FFB6C1',
      'Dark Milange': '#666666',
      'Light Milange': '#AAAAAA',
      'Steel Grey': '#71797E',
      'Maroon': '#800000',
      'Rose': '#FF007F',
      'Lavander': '#E6E6FA',
      'Majentha': '#FF00FF',
    };
    
    // Try direct mapping first
    if (colorMap[colorName]) return colorMap[colorName];
    
    // Try case-insensitive search
    const lowerColorName = colorName.toLowerCase();
    const colorKey = Object.keys(colorMap).find(key => 
      key.toLowerCase() === lowerColorName
    );
    
    return colorKey ? colorMap[colorKey] : '#CCCCCC'; // Default gray if not found
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="text-5xl text-blue-600 mb-4"
        >
          <FaSpinner />
        </motion.div>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-2xl text-gray-700 font-medium"
        >
          Loading amazing products...
        </motion.p>
      </div>
    );

  if (error)
    return (
      <div className="text-center py-12 px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 10 }}
          className="bg-red-50 border-l-4 border-red-500 p-8 rounded-lg shadow-lg mx-auto max-w-2xl"
        >
          <h2 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-gray-700">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors duration-300"
          >
            Try Again
          </button>
        </motion.div>
      </div>
    );

  return (
    <div className="min-h-screen py-10 bg-gradient-to-br from-gray-50 to-blue-50">
      <ScrollProgressBar />
      
      <motion.div 
        className="container mx-auto px-4 mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-6xl font-bold mb-4 text-center bg-gradient-to-r from-teal-400 via-blue-500 to-purple-500 text-transparent bg-clip-text"
          whileHover={{ scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          Our Premium Products
        </motion.h1>
        <motion.p
          className="text-center text-xl text-gray-600 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Discover our collection of high-quality products designed for you
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="container mx-auto px-4 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-gray-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="relative md:w-2/3">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="p-4 pl-12 border border-gray-200 rounded-xl w-full focus:ring-2 focus:ring-blue-400 shadow-md bg-white text-black transition-all duration-300 hover:shadow-lg outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3 md:w-1/3">
            <select
              className="p-4 border border-gray-200 rounded-xl flex-grow focus:ring-2 focus:ring-blue-400 shadow-md bg-white hover:shadow-lg transition-all duration-300 outline-none cursor-pointer"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Sort Products</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSearchTerm('');
                setSelectedColors([]);
              }}
              className="px-6 py-2 border border-gray-200 rounded-xl bg-white hover:bg-gray-50 text-gray-700 hover:shadow-lg transition-all duration-300"
            >
              Clear
            </motion.button>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="container mx-auto px-4 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <ColorPalette 
          availableColors={availableColors} 
          selectedColors={selectedColors} 
          toggleColor={toggleColor} 
        />
      </motion.div>
      
      {filteredProducts.length === 0 && (
        <motion.div 
          className="text-center text-gray-500 text-xl mt-12 bg-white/80 backdrop-blur-md p-8 rounded-xl shadow-md max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaSearch className="text-5xl text-gray-400 mb-4 mx-auto" />
          <h3 className="text-2xl font-semibold mb-2">No products found</h3>
          <p>Try adjusting your search or filter to find what you're looking for.</p>
        </motion.div>
      )}
      
      <motion.div 
        className="container mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <AnimatePresence>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
            {filteredProducts.map((product) => renderProductCard(product))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full border border-gray-200"
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text flex items-center gap-2">
                <FaShoppingCart /> Add to Cart
              </h2>
              <p className="text-gray-700 mb-6">
                How many units of <span className="font-semibold text-blue-600">{selectedProduct?.name}</span> would
                you like to add?
              </p>
              <div className="bg-gray-50 p-4 rounded-xl mb-6">
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={selectedProduct?.stock || 99}
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)}
                    className="w-20 p-2 text-center border border-gray-300 rounded-lg text-xl font-medium focus:ring-2 focus:ring-blue-400 outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(Math.min(selectedProduct?.stock || 99, quantity + 1))} 
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowModal(false)}
                  className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 transition-all duration-300 hover:shadow-lg"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={confirmAddToCart}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductPage;
