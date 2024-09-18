import dotenv from 'dotenv'
dotenv.config();
import mongoose, { Connection } from "mongoose";
import { DB_NAME } from '../constant';
// import { Express } from "express";

const DB_URI: string = process.env.URI || '';
const connectDB = async () => {
    try {
        await mongoose.connect(`${DB_URI}/${DB_NAME}`).then((data: any) => {
            console.log(`MONGODB CONNECTION ESTABLISHED ${data.connection.host}`)
        })
    } catch (error: any) {
        console.log(`MONGODB CONNECTION FAILED ${error.message}`)
        setTimeout(connectDB, 5000);
    }
}

export default connectDB


/*
hitesh chaudhary style

const connectDB = async function() {
        try {
            const connectionInstance = await mongoose.connect(`${DB_URI}/${DB_NAME}`);
            console.log("MONGODB connetcion established",connectionInstance.connection.host)
        } catch (error) {
            console.log("Connection Failed : ", error)
            process.exit(1)
        }
    }
*/