import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import InventoryReport from './InventoryReport';
import logo from '../../images/logo.jpg';
import backgroundImage from '../../images/t.jpg';
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
                html: `Quantity of the following items are at a low level<ul>${itemListWithSupplier}</ul>`,
                footer: `<button id="sendEmailBtn" class="btn btn-primary">Send an Email</button>`
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

        <div>
            <div className="navbar">
                <NavBar />
            </div>
            <div className="min-h-screen p-8">


                <h1 className="text-3xl mb-8 font-bold">Manage Spare Parts</h1>
                <input
                    type="text"
                    placeholder="Search parts..."
                    className="w-full mb-6 p-3 border rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="flex justify-end mb-4">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        onClick={() => window.location.href = '/inventory/create'}>
                        Add Inventory
                    </button>
                    <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4">
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
                                <tr key={inventoryItem._id} style={{ background: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                    <td className="p-4 border-b border-gray-300">{index + 1}</td>
                                    <td className="p-4 border-b border-gray-300">{inventoryItem.Name}</td>
                                    <td className="p-4 border-b border-gray-300">{inventoryItem.Location}</td>
                                    <td className="p-4 border-b border-gray-300">{inventoryItem.Quantity}</td>
                                    <td className="p-4 border-b border-gray-300">{inventoryItem.PurchasedPrice}</td>
                                    <td className="p-4 border-b border-gray-300">{inventoryItem.SellPrice}</td>
                                    <td className="p-4 border-b border-gray-300">{inventoryItem.SupplierName}</td>
                                    <td className="p-4 border-b border-gray-300">{inventoryItem.SupplierPhone}</td>
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

                {/* Footer */}

                <Footer />
            </div>
        </div>
    );
};

export default InventoryDashboard;
