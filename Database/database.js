const { connect } = require('mongoose');

const connectDB = async () => {
    try {
        await connect('mongodb+srv://shokalash21016:1vsiwKvI96BnKq6W@cluster0.chb2moc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;