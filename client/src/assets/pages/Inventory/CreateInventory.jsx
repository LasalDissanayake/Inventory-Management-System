import React, { useState } from 'react';
import Spinner from '../../components/Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Footer from "./../../components/Footer";
import NavBar from "./../../components/NavBar";

const CreateInventory = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasedPrice, setPurchasedPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = 'Name is required';
      isValid = false;
    }
    if (!location.trim()) {
      errors.location = 'Location is required';
      isValid = false;
    }
    if (!quantity.trim() || isNaN(quantity) || parseInt(quantity) <= 0) {
      errors.quantity = 'Quantity must be a positive number';
      isValid = false;
    }
    if (!purchasedPrice.trim() || isNaN(purchasedPrice) || parseFloat(purchasedPrice) <= 0) {
      errors.purchasedPrice = 'Purchased Price must be a positive number';
      isValid = false;
    }
    if (!sellPrice.trim() || isNaN(sellPrice) || parseFloat(sellPrice) <= 0 || parseFloat(sellPrice) < parseFloat(purchasedPrice)) {
      errors.sellPrice = 'Sell Price must be equal to or greater than Purchased Price';
      isValid = false;
    }
    if (!supplierName.trim()) {
      errors.supplierName = 'Supplier Name is required';
      isValid = false;
    }
    if (!supplierPhone.trim() || !/^0\d{9}$/.test(supplierPhone)) {
      errors.supplierPhone = 'Supplier Phone must start with 0 and be a 10-digit number';
      isValid = false;
    }
    if (!supplierEmail.trim()) {
      errors.supplierEmail = 'Supplier email is required';
      isValid = false;
    }

    if (!isValid) {
      Swal.fire({
        icon: 'error',
        title: 'Problem with Inventory creation',
        html: Object.values(errors).map(error => `<p>${error}</p>`).join(''),
      });
    }

    setErrors(errors);
    return isValid;
  };

  const checkInventoryItem = async (itemNameUpperCase) => {
    try {
      const response = await axios.get(`http://localhost:7788/inventory?Name=${itemNameUpperCase}`);
      return response.data.length > 0;
    } catch (error) {
      console.error('Error checking inventory:', error);
      return false;
    }
  };

  const handleSaveInventory = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const itemNameUpperCase = name.toUpperCase();
    const itemExists = await checkInventoryItem(itemNameUpperCase);

    if (itemExists) {
      Swal.fire({
        icon: 'error',
        title: 'Inventory item with the same name already exists',
        text: 'Please choose a different name or update the existing item',
      });
      setLoading(false);
      return;
    }

    const data = {
      Name: itemNameUpperCase,
      Location: location,
      Quantity: quantity,
      PurchasedPrice: purchasedPrice,
      SellPrice: sellPrice,
      SupplierName: supplierName,
      SupplierPhone: supplierPhone,
      SupplierEmail: supplierEmail,
    };

    try {
      await axios.post('http://localhost:7788/inventory', data);
      Swal.fire({
        icon: 'success',
        title: 'Inventory item created successfully',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
      setTimeout(() => {
        setLoading(false);
        navigate('/');
      }, 1500);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Inventory item already exists',
        text: 'Please check the item name or update the existing item',
      });
      console.error(error);
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setSupplierPhone(value);
  };

  const handleEmailChange = (event) => {
    const email = event.target.value;
    setSupplierEmail(email);

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrors({ ...errors, supplierEmail: 'Please enter a valid email address' });
    } else {
      setErrors({ ...errors, supplierEmail: '' });
    }
  };

  return (
    <div>
      <div className="navbar">
        <NavBar />
      </div>
      <div className="bg-PrimaryColor min-h-screen flex justify-center items-center p-4 pt-24"> {/* Add pt-24 to provide space for header */}
      <div className="bg-SecondaryColor p-8 rounded-lg shadow-2xl max-w-2xl w-full">

          <h2 className="text-dark text-2xl font-bold mb-6">Add Spare Part</h2>
          {/* Name input field */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}
          </div>
          {/* Location input field */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Location</label>
            <select
              className="w-full p-2 border border-dark rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select Location</option>
              <option value="Vault">Vault</option>
              <option value="Carton/Shelf">Carton/Shelf</option>
              <option value="Drawer">Drawer</option>
              <option value="Box">Box</option>
              <option value="Cabinet">Cabinet</option>
              <option value="Locker">Locker</option>
              <option value="Tray">Tray</option>
              <option value="Rack">Rack</option>
              <option value="Bin">Bin</option>
              <option value="Compartment">Compartment</option>
              <option value="Container">Container</option>
              <option value="Barrel">Barrel set</option>
            </select>
            {errors.location && <p style={styles.error}>{errors.location}</p>}
          </div>
          {/* Quantity input field */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Quantity</label>
            <input
              type="number"
              className="w-full p-2 border border-dark rounded"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
            {errors.quantity && <p style={styles.error}>{errors.quantity}</p>}
          </div>
          {/* Purchased Price input field */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Purchased Price</label>
            <input
              type="number"
              className="w-full p-2 border border-dark rounded"
              value={purchasedPrice}
              onChange={(e) => setPurchasedPrice(e.target.value)}
            />
            {errors.purchasedPrice && <p style={styles.error}>{errors.purchasedPrice}</p>}
          </div>
          {/* Sell Price input field */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Sell Price</label>
            <input
              type="number"
              className="w-full p-2 border border-dark rounded"
              value={sellPrice}
              onChange={(e) => setSellPrice(e.target.value)}
            />
            {errors.sellPrice && <p style={styles.error}>{errors.sellPrice}</p>}
          </div>
          {/* Supplier Name input field */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Supplier Name</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={supplierName}
              onChange={(e) => setSupplierName(e.target.value)}
            />
            {errors.supplierName && <p style={styles.error}>{errors.supplierName}</p>}
          </div>
          {/* Supplier Phone input field */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Supplier Phone</label>
            <input
              type="text"
              className="w-full p-2 border border-dark rounded"
              value={supplierPhone}
              onChange={handlePhoneChange}
            />
            {errors.supplierPhone && <p style={styles.error}>{errors.supplierPhone}</p>}
          </div>
          {/* Supplier Email input field */}
          <div className="mb-4">
            <label className="text-dark block mb-2">Supplier Email</label>
            <input
              type="email"
              className="w-full p-2 border border-dark rounded"
              value={supplierEmail}
              onChange={handleEmailChange}
            />
            {errors.supplierEmail && <p style={styles.error}>{errors.supplierEmail}</p>}
          </div>
          <button
            onClick={handleSaveInventory}
            className="bg-dark text-white p-2 rounded hover:bg-gray-700 transition duration-300"
          >
            {loading ? <Spinner /> : 'Save Inventory'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const styles = {
  error: {
    color: 'red',
    fontSize: '0.875rem',
  },
};

export default CreateInventory;
