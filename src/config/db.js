const mongoose = require("mongoose")

const mongoDbUrl='mongodb+srv://anuraghr02:9896579273@cluster0.dndrvoy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const connectDb=()=>{
    return mongoose.connect(mongoDbUrl)
}

module.exports={connectDb}

