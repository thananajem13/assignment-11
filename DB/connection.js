
import mongoose from "mongoose";


export const connectDB = async() => {
    return await mongoose.connect(process.env.DBURI)
        .then((res) => { console.log('DB Connected');})
        .catch((err) => { console.log(`Fail to  connect on DB ${err}`)})

}