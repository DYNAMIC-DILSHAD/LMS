import {app} from './app'
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './utils/db'




// create server

app.listen(process.env.PORT, () => {
    console.log(`port is running on port ${process.env.PORT}`)
    connectDB()
})

