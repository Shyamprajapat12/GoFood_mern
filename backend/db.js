const mongoose = require('mongoose');
const mongoURI = "mongodb+srv://gofood:Shyam123@cluster0.axe4nre.mongodb.net/GoFood?retryWrites=true&w=majority&appName=Cluster0";
const mongoDB = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB");
        const food_items =await mongoose.connection.db.collection("food_items");
        const data= await food_items.find({}).toArray();
        const foodCategory = await mongoose.connection.db.collection("foodCategory");
        const catData= await foodCategory.find({}).toArray(); 
        global.food_items = data;
        global.foodCategory = catData;

        
    } catch (error) {

        console.error("Error connecting to MongoDB:", error);
    }
}; 

module.exports = mongoDB;