import { createContext, useState } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
   const [cart, setCart] = useState([]);

   // Function to add a product to the cart
   const addToCart = (product) => {
      setCart((prevCart) => {
         // Check if item is already in cart to increase quantity instead of duplicating
         const existingItem = prevCart.find(item => item.productId === product.productId);
         if (existingItem) {
            return prevCart.map(item =>
               item.productId === product.productId
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
            );
         }
         return [...prevCart, { ...product, quantity: 1 }];
      });
   };

   const clearCart = () => setCart([]);

   return (
      <CartContext.Provider value={{ cart, addToCart, clearCart }}>
         {children}
      </CartContext.Provider>
   );
}