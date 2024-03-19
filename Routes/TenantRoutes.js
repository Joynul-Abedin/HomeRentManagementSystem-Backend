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

module.exports = router;
