import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        
        if (!process.env.MONGO_URL) {
            console.error("DEBUG: MONGO_URL is undefined. Check your Render Environment Variables.");
        } else {
           
            const maskedURI = process.env.MONGO_URL.replace(/:([^@]+)@/, ":****@");
            console.log(`DEBUG: Attempting to connect to: ${maskedURI}`);
        }

        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`ERROR: ${error.message}`);
       
        process.exit(1);
    }
}
