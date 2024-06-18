import React, { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);
  const navigate =useNavigate()

  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: ""
  });

  const onchangeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Create order items based on cartItems
    let orderItems = food_list.map(item => {
      if (cartItems[item._id] > 0) {
        return {
          ...item,
          quantity: cartItems[item._id] // Corrected to use correct property name
        };
      }
      return null;
    }).filter(item => item !== null);

    // Prepare order data to send to the server
    let orderData = {
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2 // Assuming $2 delivery fee
    };

    try {
      // Send orderData to the server with token in headers
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token }
      });

      if (response.data.success) {
        const { session_url } = response.data;
        // Redirect to session_url upon successful order placement
        window.location.replace(session_url);
      } else {
        alert("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("An error occurred while placing your order. Please try again later.");
    }
  };

  useEffect(()=>{
    if(!token)
      {
        navigate('/cart')

    }
    else if(getTotalCartAmount()===0)
      {
        navigate('/cart ')
      }
  },[token])

  return (
    <form className="place-order" onSubmit={handlePlaceOrder}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" name="firstname" placeholder="First name" value={data.firstname} onChange={onchangeHandler} required />
          <input type="text" name="lastname" placeholder="Last name" value={data.lastname} onChange={onchangeHandler} required />
        </div>
        <input type="email" name="email" placeholder="Email address" value={data.email} onChange={onchangeHandler} required />
        <input type="text" name="street" placeholder="Street" value={data.street} onChange={onchangeHandler} required />
        <div className="multi-fields">
          <input type="text" name="city" placeholder="City" value={data.city} onChange={onchangeHandler} required />
          <input type="text" name="state" placeholder="State" value={data.state} onChange={onchangeHandler} required />
        </div>
        <div className="multi-fields">
          <input type="text" name="zipcode" placeholder="Zip code" value={data.zipcode} onChange={onchangeHandler} required />
          <input type="text" name="country" placeholder="Country" value={data.country} onChange={onchangeHandler} required />
        </div>
        <input type="text" name="phone" placeholder="Phone" value={data.phone} onChange={onchangeHandler} required />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <p>${getTotalCartAmount() + (getTotalCartAmount() === 0 ? 0 : 2)}</p>
            </div>
            <hr />
          </div>
          <button type="submit">Proceed To Checkout</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
