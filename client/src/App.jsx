import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import React from 'react'
import { Route, Routes } from 'react-router-dom';





import ShowInventory from './assets/pages/Inventory/ShowInventory'
import CreateInventory from './assets/pages/Inventory/CreateInventory'
import EditInventory from './assets/pages/Inventory/EditInventory'
import ReadOneInventory from './assets/pages/Inventory/ReadOneInventory'
import DeleteInventory from './assets/pages/Inventory/DeleteInventory'
import AddExistingInventory from './assets/pages/Inventory/AddItemPage';
import RetrieveExistingInventory from './assets/pages/Inventory/RetrieveItemPage';
import InventoryDashboard from './assets/pages/Inventory/InventoryDashboard';
import InventoryReport from './assets/pages/Inventory/InventoryReport';





const App = () => {
  return (


    <>

      <Routes>
        <Route path='/inventory/edit/:id' element={<EditInventory />}></Route>
        <Route path='/inventory/allInventory' element={<ShowInventory />}></Route>
       
        <Route path='/inventory/create' element={<CreateInventory />}></Route>
        <Route path='/inventory/delete/:id' element={<DeleteInventory />}></Route>
        <Route path='/inventory/get/:id' element={<ReadOneInventory />}></Route>
        <Route path='/inventory/addItem/:id' element={<AddExistingInventory />}></Route>
        <Route path='/inventory/retrieveItem/:id' element={<RetrieveExistingInventory />}></Route>
        <Route path='/' element={<InventoryDashboard />}></Route>
        {/* <Route path='/inventory/InventoryDashboard' element={<InventoryDashboard />}></Route> */}
        <Route path='/inventory/InventoryReport' element={<InventoryReport />}></Route>
       
      </Routes>
    </>
  );


}

export default App;