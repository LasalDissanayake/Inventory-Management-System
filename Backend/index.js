import express from "express";
import mongoose from "mongoose";
import cors from 'cors';

// Importing custom configurations
import { PORT, mongoDBURL } from './config.js';

// Importing routes
import Inventory_Route from './Routes/Inventory_Route.js';


const app = express();
app.use(express.json());
app.use(cors());

// Using routes for endpoints

app.use('/inventory', Inventory_Route);

// Connecting to the MongoDB database
mongoose.connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port: ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });