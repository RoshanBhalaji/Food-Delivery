import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios'; // Make sure to import axios
import './Verify.css';
import { StoreContext } from '../../context/StoreContext';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success'); // Assuming 'success' is the query parameter for verification
  const orderId = searchParams.get('orderId'); // Extract orderId from query parameters
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null); // State to manage errors

  const verifyPayment = async () => {
    try {
      const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
      if (response.data.success) {
        navigate('/myorders');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while verifying the payment.');
      navigate('/');
    } finally {
      setLoading(false); // Set loading to false regardless of success or error
    }
  };

  useEffect(() => {
    verifyPayment();
  }, []); // Empty dependency array to run only once

  return (
    <div className="verify">
      {loading ? (
        <div className="spinner">Loading...</div> // Simple spinner text
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <div className="success-message">Verification Complete</div>
      )}
    </div>
  );
};

export default Verify;
