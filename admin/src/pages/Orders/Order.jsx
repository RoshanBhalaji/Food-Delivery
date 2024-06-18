import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Order.css';

const Order = ({ url }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/list`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error("Error fetching orders. Please try again later.");
    }
  };
  const statusHandler=async(e,orderId)=>{
    const response=await axios.post(url+"/api/order/status",{orderId,
      status:e.target.value
    })
    if(response.data.success){
      await fetchAllOrders();
    }
  }

  useEffect(() => {
    fetchAllOrders();
  }, []);

  return (
    <div className="order-container">
      <h1>Orders</h1>
      <ToastContainer /> {/* ToastContainer for displaying notifications */}
      <div className="order-list">
        {orders.length > 0 ? (
          orders.map(order => (
            <div key={order._id} className="order-item">
              <div className="order-details">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Amount:</strong> ${order.amount.toFixed(2)}</p>
                <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Payment:</strong> {order.payment ? 'Paid' : 'Pending'}</p>
                <div className="order-address">
                  <p><strong>Address:</strong></p>
                  <p>{order.address.firstname} {order.address.lastname}</p>
                  <p>{order.address.email}</p>
                  <p>{order.address.phone}</p>
                  <p>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.zip}</p>
                </div>
                <div className="order-items">
                  <p><strong>Items:</strong></p>
                  <ul>
                    {order.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        {item.name} x {item.quantity}
                      </li>
                    ))}
                  </ul>
                  <p><strong>No. of Items:</strong> {order.items.length}</p>
                </div>
                <select onChange={(e)=>statusHandler(e,order._id) } value={order.status}>
                  <option value="Food Processing">Food Proceesing</option>
                  <option value="Out For delivery">Out for delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <p>No orders found.</p>
        )}
      </div>
    </div>
  );
};

export default Order;
