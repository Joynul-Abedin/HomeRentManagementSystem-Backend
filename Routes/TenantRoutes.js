const express = require('express');
const router = express.Router();
const TenantService = require('../Services/TenantService');

// Create a new tenant
router.post('/', async (req, res) => {
  try {
    const tenant = await TenantService.createTenant(req.body);
    res.json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get a tenant by ID
router.get('/:id', async (req, res) => {
  try {
    const tenant = await TenantService.getTenantById(req.params.id);
    if (!tenant) {
      return res.status(404).send('Tenant not found');
    }
    res.json(tenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a tenant
router.put('/:id', async (req, res) => {
  try {
    const updatedTenant = await TenantService.updateTenant(req.params.id, req.body);
    res.json(updatedTenant);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a tenant
router.delete('/:id', async (req, res) => {
  try {
    await TenantService.deleteTenant(req.params.id);
    res.send('Tenant deleted');
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// List all tenants
router.get('/', async (req, res) => {
  try {
    const tenants = await TenantService.listTenants();
    res.json(tenants);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// In your tenant routes file

router.get('/current-payment/:id', async (req, res) => {
  try {
    console.log(req.params.id);
    const { tenant, payment } = await TenantService.getTenantAndPaymentDetails(req.params.id);

    console.log("tenant", tenant);
    console.log("payment", payment);
    console.log("payment rent", payment.payment.rent);

    // const responseHtml = `
    //   <html>
    //   <head><title>Tenant Payment Details</title></head>
    //   <body>
    //     <h1>Tenant Details</h1>
    //     <p>Name: ${tenant.name}</p>
    //     <h2>Payment Details for ${new Date().toLocaleString('default', { month: 'long' })}</h2>
    //     <p>Rent: ${payment.payment.rent}</p>
    //     <p>Electric Bill: ${payment.payment.electricBill}</p>
    //     <p>Gas Bill: ${payment.payment.gasBill}</p>
    //     <p>Water Bill: ${payment.payment.waterBill}</p>
    //     <p>Other Bill: ${payment.payment.otherBill}</p>
    //     <p>Total Payable: ${payment.payment.totalPayable}</p>
    //     <p>Amount Paid: ${payment.payment.amountPaid}</p>
    //     <p>Remaining: ${payment.payment.remaining}</p>
    //     <p>Is Paid: ${payment.payment.isPaid ? 'Yes' : 'No'}</p>
    //   </body>
    //   </html>
    // `;

    const responseHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Tenant Payment Details</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            background-color: #fff;
            padding: 20px;
            max-width: 800px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        h1, h2 {
            color: #444;
        }
        .details {
            background-color: #f9f9f9;
            padding: 15px;
            margin-bottom: 20px;
            border-left: 4px solid #007BFF;
        }
        p {
            line-height: 1.6;
        }
        .is-paid {
            color: #28a745;
            font-weight: bold;
        }
        .not-paid {
            color: #dc3545;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Tenant Details</h1>
        <p>Name: ${tenant.name}</p>
        <h2>Payment Details for ${new Date().toLocaleString('default', { month: 'long' })}</h2>
        <div class="details">
            <p>Rent: ৳${payment.payment.rent.toFixed(2)}</p>
            <p>Electric Bill: ৳${payment.payment.electricBill.toFixed(2)}</p>
            <p>Gas Bill: ৳${payment.payment.gasBill.toFixed(2)}</p>
            <p>Water Bill: ৳${payment.payment.waterBill.toFixed(2)}</p>
            <p>Other Bill: ৳${payment.payment.otherBill.toFixed(2)}</p>
            <p>Total Payable: ৳${payment.payment.totalPayable.toFixed(2)}</p>
            <p>Amount Paid: ৳${payment.payment.amountPaid.toFixed(2)}</p>
            <p>Remaining: ৳${payment.payment.remaining.toFixed(2)}</p>
            <p>Is Paid: <span class="৳{payment.payment.isPaid ? 'is-paid' : 'not-paid'}">${payment.payment.isPaid ? 'Yes' : 'No'}</span></p>
        </div>
    </div>
</body>
</html>
`;

// Ensure the values are properly defined in your 'payment' object before rendering.


    res.send(responseHtml);
  } catch (error) {
    res.status(400).send(`<html><body><p>Error: ${error.message}</p></body></html>`);
  }
});


module.exports = router;
