const express = require('express');
const { urlencoded, json } = require('body-parser');
const connectDB = require('./Database/database');
const authRouter = require('./Routes/UserRoute');
const tenantRoutes = require('./Routes/TenantRoutes'); // Adjust the path as necessary


// const cors = require('cors');

const app = express();
connectDB();
app.use(urlencoded({ extended: true }));
// app.use(express.json());

app.use(json());
app.use('/api/users', authRouter);
app.use('/api/tenants', tenantRoutes);

// Enable CORS for all routes
// app.use(cors());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
