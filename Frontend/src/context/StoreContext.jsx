import { createContext, useEffect, useState } from "react";
import axios from 'axios'; // CHANGED: Added axios import

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "https://food-delivery-rny3.onrender.com";
    const [token, setToken] = useState('');
    const [food_list, setFoodlist] = useState([]); // Correctly initializing food_list state

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            const storedToken = localStorage.getItem("token");
            if (storedToken) {
                setToken(storedToken);
                await loadCartData(storedToken);
            }
        }
        loadData();
    }, []);
    const addToCart = async (itemId) => {
        // Simplified state update logic
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1 // Improved logic for adding items to cart
        }));

        if(token){
            await axios.post(url+'/api/cart/add',{itemId},{headers:{token}})
        }

    };

    const removeFromCart =  async(itemId) => {
        setCartItems((prev) => {
            const newCartItems = { ...prev };
            if (newCartItems[itemId] > 1) {
                newCartItems[itemId] -= 1;
            } else {
                delete newCartItems[itemId];
            }
            return newCartItems; // Cleaned up logic for removing items from cart
        });
        if(token){
            await axios.post(url+'/api/cart/remove',{itemId},{headers:{token}})
        }

    };

    const getTotalCartAmount = () => {
        // Simplified calculation logic
        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            const itemInfo = food_list.find((product) => product._id === itemId);
            return total + (itemInfo ? itemInfo.price * quantity : 0); // Simplified calculation of total amount
        }, 0);
    };

    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list"); // CHANGED: Added await to axios call
            setFoodlist(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error); // CHANGED: Added error handling
        }
    };
     const loadCartData=async (token)=>{
        const response=await axios.post(url+"/api/cart/get",{},{headers:{token}})
        setCartItems(response.data.cartData)
     }

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
