const express = require('express');
const { urlencoded, json } = require('body-parser');
const connectDB = require('./Database/database');
const authRouter = require('./Routes/UserRoute');
const tenantRoutes = require('./Routes/TenantRoutes');
const paymentRoutes = require('./Routes/PaymentRoute');


// const cors = require('cors');

const app = express();
connectDB();
app.use(urlencoded({ extended: true }));
// app.use(express.json());

app.use(json());
app.use('/api/users', authRouter);
app.use('/api/tenants', tenantRoutes);
app.use('/api/tenant/payments', paymentRoutes);

// Enable CORS for all routes
// app.use(cors());

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
