import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState({});

  //   Fetch All Products
  const fetchProducts = async () => {
    setProducts(dummyProducts);
  };

  // Add Product to Cart
  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Added to cart");
  };

  // Update cart items
  const updateCartItems = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  // Remove item from cart
  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Removed from cart");
    setCartItems(cartData);
  };

  //   Get cart items count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  //   Get cart items total price
  const getCartAmount = () => {
    let totalPrice = 0;
    for (const item in cartItems) {
      let itemInfo = products.find((product) => product._id === item);
      if (cartItems[item] > 0) {
        totalPrice += itemInfo.offerPrice * cartItems[item];
      }
    }
    return Math.floor(totalPrice * 100) / 100;
  };

  const placeOrder = () => {
    setCartItems({});
    toast.success("Order placed successfully");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = {
    navigate,
    user,
    setUser,
    showUserLogin,
    setShowUserLogin,
    products,
    setProducts,
    currency,
    addToCart,
    updateCartItems,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartCount,
    getCartAmount,
    placeOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
