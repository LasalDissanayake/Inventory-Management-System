import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from '../../components/BackButton';
import { useParams, Link, useLocation } from 'react-router-dom';
import Spinner from '../../components/Spinner';
import Footer from "./../../components/Footer";
import NavBar from "./../../components/NavBar";
import backgroundImage from '../../images/t.png'; // Make sure to import your background image

const ReadOneInventory = () => {
  const [inventory, setInventory] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:7788/inventory/${id}`)
      .then((response) => {
        setInventory(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const newQuantity = searchParams.get('newQuantity');
    if (newQuantity !== null && inventory !== null) {
      const updatedInventory = { ...inventory, Quantity: newQuantity };
      setInventory(updatedInventory);
      axios
        .put(`http://localhost:7788/inventory/${id}`, updatedInventory)
        .then(() => console.log('Quantity updated in database'))
        .catch((error) =>
          console.error('Error updating quantity in database:', error)
        );
    }
  }, [location.search, id, inventory]);

  const handleRetrieveItems = () => {
    // Logic for retrieving items from the inventory goes here
    // For example:
    console.log('Retrieving items from inventory...');
  };

  if (loading) {
    return <Spinner />;
  }

  if (!inventory) {
    return <p>Data is loading...</p>;
  }

  return (
    <div>
      <div className="navbar">
        <NavBar />
      </div>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="bg-primary min-h-screen flex justify-center items-center p-4 pt-24">
           {/* Back button positioned to the left */}
           <div className="absolute left-[22%] top-[50%] p-4 ">
              <BackButton destination={`/`} />
            </div>
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-2xl w-full relative">
           
            
            <div className="text-center text-2xl mb-6 text-black">Show Inventory</div>
            <div className="space-y-4 text-black">
              <div>
                <span className="font-bold text-blue-500">Item Number:</span>
                <span>{inventory._id}</span>
              </div>
              <div>
                <span className="font-bold text-blue-500">Name:</span>
                <span>{inventory.Name}</span>
              </div>
              <div>
                <span className="font-bold text-blue-500">Location:</span>
                <span>{inventory.Location}</span>
              </div>
              <div>
                <span className="font-bold text-blue-500">Quantity:</span>
                <span>{inventory.Quantity}</span>
              </div>
              <div>
                <span className="font-bold text-blue-500">Purchased Price:</span>
                <span>{inventory.PurchasedPrice}</span>
              </div>
              <div>
                <span className="font-bold text-blue-500">Sell Price:</span>
                <span>{inventory.SellPrice}</span>
              </div>
              <div>
                <span className="font-bold text-blue-500">Supplier Name:</span>
                <span>{inventory.SupplierName}</span>
              </div>
              <div>
                <span className="font-bold text-blue-500">Supplier Phone:</span>
                <span>{inventory.SupplierPhone}</span>
              </div>
              <div>
                <span className="font-bold text-blue-500">Supplier Email:</span>
                <span>{inventory.SupplierEmail}</span>
              </div>
              <div>
                <span className="font-bold text-blue-500">Create Time:</span>
                <span>{new Date(inventory.createdAt).toString()}</span>
              </div>
              <div>
                <span className="font-bold text-blue-500">Last Update Time:</span>
                <span>{new Date(inventory.updatedAt).toString()}</span>
              </div>
              <div className="flex justify-between">
                <Link
                  to={`/inventory/addItem/${id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Add Item
                </Link>
                <Link
                  to={`/inventory/retrieveItem/${id}`}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                  Retrieve Item
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};
      const styles = {
        container: {
        backgroundSize: 'cover',
      backgroundPosition: 'center',
      minHeight: '100vh',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#fff',
      overflow: 'hidden', // Prevent scroll
  },
      heading: {
        textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '30px',
      color: '#fff',
  },
      
      
      label: {
        fontWeight: 'bold',
      color: 'red',
      width: '100%',
      padding: '1px',
      textTransform: 'uppercase',
  },
      value: {
        color: 'white',
  },
      serviceHistory: {
        marginTop: '30px',
  },
      table: {
        width: '100%',
      borderCollapse: 'collapse',
  },
      tableHead: {
        background: '#333',
      color: 'red',
      textAlign: 'center',
      border: '1px solid red',
  },
      tableHeader: {
        padding: '10px',
      textAlign: 'left',
      color: 'red',
      border: '1px solid red',
  },
      tableRowEven: {
        background: '#2f2f2f',
  },
      tableRowOdd: {
        background: '#1f1f1f',
  },
      tableCell: {
        padding: '10px',
      textAlign: 'left',
      border: '1px solid red',
  },
};


      export default ReadOneInventory;
