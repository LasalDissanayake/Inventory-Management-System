import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import InventoryReport from './InventoryReport';

import emailjs from 'emailjs-com';
import Footer from "./../../components/Footer";
import NavBar from "./../../components/NavBar";

const InventoryDashboard = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const componentRef = useRef();

    // Function to fetch inventory items based on search query
    const handleSearch = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:7788/inventory?search=${searchQuery}`
            );
            setInventory(response.data.data);
            setLoading(false);
            setError(null);
        } catch (error) {
            console.error("Error fetching Inventory Items:", error);
            setError("An error occurred while fetching the inventory for the search query.");
            setLoading(false);
        }
    };

    // Send an email
    const sendEmailToSupplier = (itemName, email) => {
        const emailConfig = {
            serviceID: 'service_p1zv9rh',
            templateID: 'template_pua7ayd',
            userID: 'v53cNBlrti0pL_RxD'
        };

        emailjs.send(
            emailConfig.serviceID,
            emailConfig.templateID,
            {
                to_email: email,
                message: `Dear Supplier,\n\nWe would like to inform you that the quantity of the item "${itemName}" in our inventory provided by you is low. Please consider restocking.\n\nBest regards,\nNadeeka Auto Service`
            },
            emailConfig.userID
        ).then(
            () => Swal.fire('Email Sent!', 'The supplier has been notified.', 'success'),
            (error) => console.error('Failed to send email:', error)
        );
    };

    // Fetch inventory items on component mount
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

    // Apply search filter to inventory items
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
            'SupplierEmail',
            'Operations'
        ];

        return searchableFields.some(field =>
            String(inventoryItem[field]).toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    // Filter inventory based on search query
    const filteredInventory = inventory.filter(applySearchFilter);

    // Alert when quantity of any item is below 15
    useEffect(() => {
        const itemsBelow15 = filteredInventory.filter(item => item.Quantity <= 15);
        if (itemsBelow15.length > 0) {
            const itemListWithSupplier = itemsBelow15.map(item => `<li>${item.Name} Provided By ${item.SupplierEmail}</li>`).join('');
            Swal.fire({
                icon: "warning",
                title: "Warning",
                html: `Quantity of the following items are at a low level:<ul>${itemListWithSupplier}</ul>`,
                showCancelButton: true,
                confirmButtonText: "Send an Email",
                cancelButtonText: "Cancel",
            }).then((result) => {
                if (result.isConfirmed) {
                    itemsBelow15.forEach(item => {
                        sendEmailToSupplier(item.Name, item.SupplierEmail);
                    });
                }
            });
        }
    }, [filteredInventory]);

    // Handle delete item
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
                                text: "Your item has been deleted.",
                                icon: "success"
                            }).then(() => {
                                handleSearch();  // Refresh the inventory list
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

    return (

        <div className='flex flex-col min-h-screen'>
        {/* Fixed NavBar at the top */}
        <NavBar className='fixed top-0 left-0 right-0 z-50 bg-white shadow-md' /> 
        
        {/* Add padding to ensure content starts below NavBar */}
        <div className='flex-grow bg-gray-100 pt-16'>
            <h1 className="text-3xl mb-8 font-bold">Manage Inventory Items</h1>
            
            <div className="flex items-center justify-between bg-white h-16 px-4 shadow">
                <div className="flex space-x-4">
                    <button
                        type="button"
                        className="text-green-700 hover:text-white border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:hover:bg-green-600 dark:focus:ring-green-800"
                        onClick={() => window.location.href = '/inventory/create'}>
                        Add Inventory
                    </button>
                    <button
                        type="button"
                        className="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900">
                        <InventoryReport filteredInventory={filteredInventory} />
                    </button>
                </div>
                
                <form className="flex items-center max-w-sm">
                    <label htmlFor="simple-search" className="sr-only">Search</label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm12 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm0 0V6a3 3 0 0 0-3-3H9m1.5-2-2 2 2 2" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            id="simple-search"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-100 dark:border-gray-200 dark:placeholder-gray-700 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                            placeholder="Search parts..."  
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="p-2.5 ms-2 text-sm font-medium text-white bg-blue-700 rounded-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                        <span className="sr-only">Search</span>
                    </button>
                </form>
            </div>
    
            {/* Table or Spinner */}
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
                        <th className="p-4 text-left font-semibold border-b border-gray-300">Supplier Email</th>
                        <th className="p-4 text-left font-semibold border-b border-gray-300">Operations</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredInventory.map((inventoryItem, index) => (
                        <tr key={inventoryItem._id} style={{ background: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                            <td className="p-4 border-b border-gray-300">{index + 1}</td>
                            <td className="p-4 border-b border-gray-300">{inventoryItem.Name}</td>
                            <td className="p-4 border-b border-gray-300">{inventoryItem.Location}</td>
                            <td className="p-4 border-b border-gray-300">{inventoryItem.Quantity}</td>
                            <td className="p-4 border-b border-gray-300">{inventoryItem.PurchasedPrice}</td>
                            <td className="p-4 border-b border-gray-300">{inventoryItem.SellPrice}</td>
                            <td className="p-4 border-b border-gray-300">{inventoryItem.SupplierName}</td>
                            <td className="p-4 border-b border-gray-300">{inventoryItem.SupplierPhone}</td>
                            <td className="p-4 border-b border-gray-300">{inventoryItem.SupplierEmail}</td>
                            <td className="p-4 border-b border-gray-300">
                                <Link to={`/inventory/edit/${inventoryItem._id}`} className="mr-2">
                                    <AiOutlineEdit className="inline-block text-blue-500 hover:text-blue-700" />
                                </Link>
                                <button onClick={() => handleDelete(inventoryItem._id)} className="mr-2">
                                    <MdOutlineDelete className="inline-block text-red-500 hover:text-red-700" />
                                </button>
                                <Link to={`/inventory/get/${inventoryItem._id}`}>
                                    <BsInfoCircle className="inline-block text-green-500 hover:text-green-700" />
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            )}
        </div>
    
        {/* Fixed Footer at the bottom */}
        <Footer className='fixed bottom-0 left-0 right-0 bg-gray-800 text-white text-center py-2' />
    </div>
    

    );
};

export default InventoryDashboard;
