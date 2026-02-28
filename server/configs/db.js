import mongoose from "mongoose";    

const connectDB = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Connected to MongoDB");
        })
        let mongodbURI = process.env.MONGODB_URI;

        const projectName = 'resume-builder';
        if(!mongodbURI){
            throw new Error("MONGODB_URI is not defined in environment variables");
        }

        // Remove deprecated mongoose options if present in the URI query
        // (some connection strings include `useNewUrlParser=true` or
        // `useUnifiedTopology=true` which newer drivers reject).
        let sanitizedUri = mongodbURI.replace(/[?&](useNewUrlParser|useUnifiedTopology)(=[^&]*)?/ig, '');
        // clean up leftover characters like trailing ? or &&
        sanitizedUri = sanitizedUri.replace(/[?&]+$/g, '').replace('?&', '?').replace('&&', '&');

        await mongoose.connect(sanitizedUri, {
            dbName: projectName,
        })

    } catch(error) {
        console.error("Error connecting to MongoDb",error)

    }
}

export default connectDB;