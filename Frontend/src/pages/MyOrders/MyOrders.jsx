import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { url, token, userId } = useContext(StoreContext);

  const fetchOrders = async () => {
    try {
      const response = await axios.post(
        `${url}/api/order/userorders`,
        { userId }, // Include userId in the request body
        {
          headers: { token }
        }
      );
      if (response.data.success) {
        setData(response.data.data);
      } else {
        console.error('Failed to fetch orders:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  const getOrderClass = (status) => {
    switch (status) {
      case 'Food Processing':
        return 'processing';
      case 'Out For Delivery':
        return 'out-for-delivery';
      case 'Delivered':
        return 'delivered';
      default:
        return '';
    }
  };

  return (
    <div className="my-orders">
      <h1>My Orders <img src={assets.parcel_icon} alt="" className='icon' /></h1>
      {data.length > 0 ? (
        <ul className="order-list">
          {data.map((order) => (
            <li key={order._id} className={`order-item ${getOrderClass(order.status)}`}>
              <div className="order-details">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Amount:</strong> ${order.amount.toFixed(2)}</p>
                <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                <p className={`order-status ${getOrderClass(order.status)}`}><strong>Status:</strong> {order.status}</p>
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
                  {order.items.map((item, itemIndex) => (
                    <p key={itemIndex}>
                      {item.name} x {item.quantity}
                    </p>
                  ))}
                </div>
                <button onClick={fetchOrders}>Track Order</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
};

export default MyOrders;
