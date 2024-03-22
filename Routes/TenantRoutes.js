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


    const responseHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tenant Payment Details</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f0f2f5;
                color: #333;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
            }
            .container {
                background-color: #fff;
                padding: 40px;
                border-radius: 10px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                width: 100%;
                max-width: 600px;
            }
            h1, h2 {
                color: #444;
                text-align: center;
            }
            .details {
                background-color: #e7eff9;
                padding: 20px;
                margin: 20px 0;
                border-left: 5px solid #007BFF;
            }
            p {
                margin: 10px 0;
            }
            .is-paid {
                color: #28a745;
                font-weight: bold;
            }
            .not-paid {
                color: #dc3545;
                font-weight: bold;
            }
            footer {
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Tenant Payment Details</h1>
            <div class="details">
                <h2>Tenant Information</h2>
                <p>Name: ${tenant.name}</p>
                <p>Room No: ${tenant.room}</p>
                <p>Rent: ${tenant.rent}</p>
                <p>Move In Date: ${tenant.moveInDate}</p>
                <p>Deposit: ${tenant.deposit}</p>
            </div>
            <div class="details">
                <h2>Payment Information for ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>
                <p>Rent: ৳${payment.payment.rent.toFixed(2)}</p>
                <p>Electric Bill: ৳${payment.payment.electricBill.toFixed(2)}</p>
                <p>Gas Bill: ৳${payment.payment.gasBill.toFixed(2)}</p>
                <p>Water Bill: ৳${payment.payment.waterBill.toFixed(2)}</p>
                <p>Other Bill: ৳${payment.payment.otherBill.toFixed(2)}</p>
                <p>Total Payable: ৳${payment.payment.totalPayable.toFixed(2)}</p>
                <p>Amount Paid: ৳${payment.payment.amountPaid.toFixed(2)}</p>
                <p>Remaining: ৳${payment.payment.remaining.toFixed(2)}</p>
                <p>Is Paid: <span class="${payment.payment.isPaid ? 'is-paid' : 'not-paid'}">${payment.payment.isPaid ? 'Yes' : 'No'}</span></p>
            </div>
            <footer>
                <p>Thank you for using our services.</p>
            </footer>
        </div>
    </body>
    </html>
    `;
    res.send(responseHtml);
  } catch (error) {
    res.status(400).send(`<html><body><p>Error: ${error.message}</p></body></html>`);
  }
});


module.exports = router;
