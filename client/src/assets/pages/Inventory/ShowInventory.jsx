import React, { useState, useEffect, useRef } from 'react';
import axios from "axios";
import Spinner from "../../components/Spinner";
import { Link } from "react-router-dom";
import { BsInfoCircle } from "react-icons/bs";
import { AiOutlineEdit } from "react-icons/ai";
import { MdOutlineAddBox, MdOutlineDelete } from "react-icons/md";
import { useReactToPrint } from 'react-to-print';
import Swal from 'sweetalert2';
import InventoryReport from "./InventoryReport.jsx";

import backgroundImage from '../../images/t.png';

const ShowInventory = () => {
  // State and refs initialization
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const componentRef = useRef();

  // Function to handle search
  const handleSearch = async (e) => {
    setSearchQuery(e.target.value);
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:7788/inventory?search=${e.target.value}`
      );
      setInventory(response.data.data);
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error("Error fetching Inventory Items:", error);
      setError(
        "An error occurred while fetching the Inventory Items for the search query."
      );
      setLoading(false);
    }
  };

  // Initial fetch of inventory data
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:7788/inventory")
      .then((response) => {
        setInventory(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, []);

  // Function to generate PDF
  const generatePDF = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Inventory List',
    onAfterPrint: () => alert('Data saved in PDF'),
  });

  // Function to filter inventory based on search query
  const applySearchFilter = (inventoryItem) => {
    if (!inventoryItem) return false;
    const searchableFields = [
      'No',
      'Name',
      'Location',
      'Quantity',
      'PurchasedPrice',
      'SellPrice',
      'SupplierName',
      'SupplierPhone',
      'Operations'
    ];

    return searchableFields.some(field =>
      String(inventoryItem[field]).toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Filtered inventory based on search query
  const filteredInventory = inventory.filter(applySearchFilter);

  // Alert when quantity of any item is below 15
  useEffect(() => {
    const itemsBelow15 = filteredInventory.filter(item => item.Quantity <= 15);
    if (itemsBelow15.length > 0) {
      const itemNamesList = itemsBelow15.map(item => `<li>${item.Name}</li>`).join('');
      Swal.fire({
        icon: "warning",
        title: "warning",
        html: `Quantity of the following items are in low level<ul>${itemNamesList}</ul>`,
      });
    }
  }, [filteredInventory]);

  // Function to handle delete item
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:7788/inventory/${id}`)
          .then(response => {
            if (response.status === 200) {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success"
              }).then(() => {
                // Refresh the inventory list after successful deletion
                handleSearch({ target: { value: searchQuery } });
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: "Failed to delete item.",
                icon: "error"
              });
            }
          })
          .catch(error => {
            console.error("Error deleting item:", error);
            Swal.fire({
              title: "Error!",
              text: "Failed to delete item.",
              icon: "error"
            });
          });
      }
    });
  };

  // Inline styles for components
  const styles = {
    container: {
      color: 'black',
      border: '3px solid white',
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    navButton: {
      backgroundColor: 'red',
      color: 'white',
      padding: '0.5rem 2rem',
      borderRadius: '5px',
      width: '220px',
      textDecoration: 'none',
      height: '50px',
      marginTop: '15px'
    },
    logo: {
      width: '100%',
      height: '200px',
      border: '2px solid red'
    },
    table: {
      width: '300px',
      margin: '0 auto',
      padding: '20px',
      background: 'lightgray',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      fontFamily: 'Arial, sans-serif',
      color: '#fff',
      background: '#1f1f1f'
    },
    tableHead: {
      background: '#333',
      color: 'red',
      textAlign: 'center',
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
      borderLeft: '1px solid red', // Adding left border
      borderRight: '1px solid red',
      background: '#1f1f1f',
      color: 'white',
    },
    subHeading: {
      marginTop: '20px',
      fontSize: '2 rem',
      fontWeight: 'bold',
      marginBottom: '20px',
      color: '#fff',
      textAlign: 'center',
      textTransform: 'uppercase',
    },
  };

  return (
    <div className="bg-PrimaryColor min-h-screen p-8">
      <h1 className="text-extra-dark text-3xl mb-8 font-bold">
        Manage Spare Parts
      </h1>
      <input
        type="text"
        placeholder="Search parts..."
        className="w-full mb-6 p-3 border border-dark rounded-md focus:outline-none focus:ring-2 focus:ring-dark transition"
        value={searchQuery}
        onChange={handleSearch}
      />
      <div className="flex justify-end mb-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => window.location.href = '/inventory/create'}>
          Add Inventory
        </button>
        <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4" >
          <InventoryReport filteredInventory={filteredInventory} />
        </div>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <table className="min-w-full bg-white border border-gray-200 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gradient-to-r from-blue-500 to-teal-400 text-white">
              <th className="p-4 text-left font-semibold border-b border-gray-300">No</th>
              <th className="p-4 text-left font-semibold border-b border-gray-300">Name</th>
              <th className="p-4 text-left font-semibold border-b border-gray-300">Location</th>
              <th className="p-4 text-left font-semibold border-b border-gray-300">Quantity</th>
              <th className="p-4 text-left font-semibold border-b border-gray-300">Purchased Price</th>
              <th className="p-4 text-left font-semibold border-b border-gray-300">Sell Price</th>
              <th className="p-4 text-left font-semibold border-b border-gray-300">Supplier Name</th>
              <th className="p-4 text-left font-semibold border-b border-gray-300">Supplier Phone</th>
              <th className="p-4 text-left font-semibold border-b border-gray-300">Operations</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((inventoryItem, index) => (
              <tr key={inventoryItem._id} className="h-8" style={{ background: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{inventoryItem.Name}</td>
                <td className="p-4">{inventoryItem.Location}</td>
                <td className="p-4">{inventoryItem.Quantity}</td>
                <td className="p-4">{inventoryItem.PurchasedPrice}</td>
                <td className="p-4">{inventoryItem.SellPrice}</td>
                <td className="p-4">{inventoryItem.SupplierName}</td>
                <td className="p-4">{inventoryItem.SupplierPhone}</td>
                <td className="p-4 flex space-x-2">
                  <Link to={`/inventory/edit/${inventoryItem._id}`} className="text-blue-500 hover:text-blue-700">
                    <AiOutlineEdit size={20} />
                  </Link>
                  <button onClick={() => handleDelete(inventoryItem._id)} className="text-red-500 hover:text-red-700">
                    <MdOutlineDelete size={20} />
                  </button>
                  <Link to={`/inventory/${inventoryItem._id}`} className="text-gray-500 hover:text-gray-700">
                    <BsInfoCircle size={20} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="mt-8">
        <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={generatePDF}>
          Download Report as PDF
        </button>
      </div>
    </div>
  );
};

export default ShowInventory;
