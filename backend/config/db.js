import mongoose from 'mongoose';// mongoose: librairie
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);//showing which host MongoDB is connected (localhost)

    }catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit the process with failure ( 0 means success )
    }
}
