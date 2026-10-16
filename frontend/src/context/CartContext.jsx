import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
   // Load initial cart from local storage so it survives page refreshes!
   const [cart, setCart] = useState(() => {
      const savedCart = localStorage.getItem('vegetalia_cart');
      return savedCart ? JSON.parse(savedCart) : [];
   });

   // Save to local storage whenever cart changes
   useEffect(() => {
      localStorage.setItem('vegetalia_cart', JSON.stringify(cart));
   }, [cart]);

   const addToCart = (newItem) => {
      setCart((prevCart) => {
         // If item already exists, just increase its quantity
         const existingItem = prevCart.find(item => item._id === newItem._id);
         if (existingItem) {
            return prevCart.map(item =>
               item._id === newItem._id ? { ...item, quantity: item.quantity + 1 } : item
            );
         }
         return [...prevCart, { ...newItem, quantity: 1 }];
      });
   };

   // --- NEW: Functions for the + and - buttons ---
   const updateQuantity = (itemId, newQuantity) => {
      setCart(prevCart =>
         prevCart.map(item =>
            item._id === itemId ? { ...item, quantity: newQuantity } : item
         )
      );
   };

   const removeFromCart = (itemId) => {
      setCart(prevCart => prevCart.filter(item => item._id !== itemId));
   };

   const clearCart = () => {
      setCart([]);
   };

   return (
      <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart }}>
         {children}
      </CartContext.Provider>
   );
};