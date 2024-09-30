import React, { useState, useEffect } from "react";
import Spinner from "../../components/Spinner";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import NavBar from "../../components/NavBar"; // Ensure to import NavBar
import Footer from "../../components/Footer"; // Ensure to import Footer
import backgroundImage from '../../images/t.png'; // Make sure to import your background image

const EditInventory = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState('');
  const [purchasedPrice, setPurchasedPrice] = useState('');
  const [sellPrice, setSellPrice] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [supplierPhone, setSupplierPhone] = useState('');
  const [supplierEmail, setSupplierEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [errors, setErrors] = useState({});


  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:7788/inventory/${id}`)
      .then((response) => {
        const data = response.data;
        setName(data.Name);
        setLocation(data.Location);
        setQuantity(data.Quantity);
        setPurchasedPrice(data.PurchasedPrice);
        setSellPrice(data.SellPrice);
        setSupplierName(data.SupplierName);
        setSupplierPhone(data.SupplierPhone);
        setSupplierEmail(data.SupplierEmail);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error happened. Please check console.',
        });
        console.log(error);
      });
  }, [id]);

  const handleEditInventory = () => {
    // Frontend validation
    const negativeFields = [];

    if (!name || !quantity || !purchasedPrice || !sellPrice || !supplierName || !supplierPhone || !supplierEmail) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please fill in all required fields.',
      });
      return;
    }

    if (isNaN(quantity) || isNaN(purchasedPrice) || isNaN(sellPrice)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Quantity, purchased price, and sell price must be valid numbers.',
      });
      return;
    }

    if (quantity < 0) negativeFields.push('Quantity');
    if (purchasedPrice < 0) negativeFields.push('Purchased Price');
    if (sellPrice < 0) negativeFields.push('Sell Price');

    if (sellPrice < purchasedPrice) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Sell price must be equal to or greater than the purchased price.',
      });
      return;
    }

    if (negativeFields.length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: `The following fields cannot be negative: <br>${negativeFields.join('<br>')}`,
      });
      return;
    }

    // Email validation
    const emailPattern = /^\S+@\S+\.\S+$/;
    if (!emailPattern.test(supplierEmail)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please enter a valid email address for the supplier.',
      });
      return;
    }

    // Phone number validation
    if (!supplierPhone.startsWith('0') || supplierPhone.length !== 10 || !/^\d+$/.test(supplierPhone)) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Phone number must start with 0 and have exactly 10 digits.',
      });
      return;
    }

    // Convert name to uppercase
    const uppercaseName = name.toUpperCase();

    // Proceed with editing inventory
    const data = {
      Name: uppercaseName,
      Location: location,
      Quantity: quantity,
      PurchasedPrice: purchasedPrice,
      SellPrice: sellPrice,
      SupplierName: supplierName,
      SupplierPhone: supplierPhone,
      SupplierEmail: supplierEmail,
    };

    setLoading(true);

    axios
      .put(`http://localhost:7788/inventory/${id}`, data)
      .then(() => {
        setLoading(false);
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Inventory data updated successfully!',
        }).then(() => {
          navigate('/');
        });
      })
      .catch((error) => {
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'An error happened. Please check console.',
        });
        console.log(error);
      });
  };

  return (
    <div>
      <NavBar />

      <div style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="bg-PrimaryColor min-h-screen flex justify-center items-center p-4 pt-24"> {/* Add pt-24 to provide space for header */}
          <div className="bg-SecondaryColor p-8 rounded-lg shadow-2xl max-w-2xl w-full" style={{ backgroundColor: '#fafffd' }}> {/* Change form color here */}
            <h2 className="text-dark text-2xl font-bold mb-6">Edit Inventory Item</h2>
            {loading ? (
              <Spinner />
            ) : (
              <>
                <div className="mb-4">
                  <label className="text-dark block mb-2">Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-dark rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
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
                <div className="mb-4">
                  <label className="text-dark block mb-2">Quantity</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-dark rounded"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-dark block mb-2">Purchased Price</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-dark rounded"
                    value={purchasedPrice}
                    onChange={(e) => setPurchasedPrice(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-dark block mb-2">Sell Price</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-dark rounded"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-dark block mb-2">Supplier Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-dark rounded"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-dark block mb-2">Supplier Phone</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-dark rounded"
                    value={supplierPhone}
                    onChange={(e) => {
                      const inputPhone = e.target.value;
                      if (inputPhone === '' || (inputPhone.length <= 10 && /^\d+$/.test(inputPhone))) {
                        setSupplierPhone(inputPhone);
                      }
                    }}
                  />
                </div>
                <div className="mb-4">
                  <label className="text-dark block mb-2">Supplier Email</label>
                  <input
                    type="email"
                    className="w-full p-2 border border-dark rounded"
                    value={supplierEmail}
                    onChange={(e) => setSupplierEmail(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
                    onClick={handleEditInventory}
                  >
                    Save
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
      </div>
      );
};

      export default EditInventory;
