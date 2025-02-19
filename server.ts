import {app} from './app'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './utils/db'

// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});




// create server

app.listen(process.env.PORT, () => {
    console.log(`port is running on port ${process.env.PORT}`)
    connectDB()
})

