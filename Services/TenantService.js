// const Tenant = require('../Models/Tenant');
// const QRCode = require('qrcode');
// const PaymentService = require('./PaymntService');

// class TenantService {
//   async createTenant(tenantData) {
//     const existingTenant = await Tenant.findOne({ nidNo: tenantData.nidNo });
//     if (existingTenant) {
//       throw new Error('This Tenant already exists');
//     }

//     const tenant = new Tenant(tenantData);
//     await tenant.save();

//     const qrCodeData = `https://hrms-f96y.onrender.com/api/tenants/current-payment/${tenant._id}`;
//     tenant.qrCode = await QRCode.toDataURL(qrCodeData);

//     await tenant.save();

//     const { password: _, ...userWithoutPassword } = tenant.toObject();
//     return userWithoutPassword;
//   }
//   // In TenantService.js

//   async getTenantAndPaymentDetails(tenantId) {
//     const tenant = await this.getTenantById(tenantId);
//     if (!tenant) {
//       throw new Error('Tenant not found');
//     }
//     const payment = await PaymentService.getPaymentDetailsForMonth(tenant.id);
//     console.log("payment from tenantService", payment);
//     return { tenant, payment };
//   }



//   async getTenantById(tenantId) {
//     return await Tenant.findById(tenantId);
//   }

//   async updateTenant(tenantId, tenantData) {
//     return await Tenant.findByIdAndUpdate(tenantId, tenantData, { new: true });
//   }

//   async deleteTenant(tenantId) {
//     return await Tenant.findByIdAndDelete(tenantId);
//   }

//   async listTenants() {
//     return await Tenant.find({});
//   }
// }

// module.exports = new TenantService();


const mongoose = require('mongoose');
const Tenant = require('../Models/Tenant');
const Payment = require('../Models/Payment');
const QRCode = require('qrcode');

class TenantService {
  // Add a new tenant and generate a QR code for them
  async createTenant(tenantData) {
    const existingTenant = await Tenant.findOne({ nidNo: tenantData.nidNo });
    if (existingTenant) {
      throw new Error('This Tenant already exists');
    }

    const tenant = new Tenant(tenantData);
    await tenant.save();

    // Generate QR code with tenant ID
    const qrCodeData = `https://hrms-f96y.onrender.com/api/tenants/current-payment/${tenant._id}`;
    tenant.qrCode = await QRCode.toDataURL(qrCodeData);
    await tenant.save();

    return tenant.toObject();
  }

  // Get a single tenant by ID along with their payment details for the current month
  async getTenantAndPaymentDetails(tenantId) {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }

    const paymentDetails = await Payment.findOne({ tenant: tenant._id, month: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } });
    return { tenant: tenant.toObject(), paymentDetails };
  }

  async getTenantById(tenantId) {
    return await Tenant.findById(tenantId);
  }

  // async updateTenant(tenantId, tenantData) {
  //   return await Tenant.findByIdAndUpdate(tenantId, tenantData, { new: true });
  // }

  // async deleteTenant(tenantId) {
  //   return await Tenant.findByIdAndDelete(tenantId);
  // }

  // async listTenants() {
  //   return await Tenant.find({});
  // }
  // Update tenant details
  async updateTenant(tenantId, tenantData) {
    const updatedTenant = await Tenant.findByIdAndUpdate(tenantId, tenantData, { new: true });
    if (!updatedTenant) {
      throw new Error('Tenant not found');
    }
    return updatedTenant.toObject();
  }

  // Delete a tenant and their associated payments
  async deleteTenant(tenantId) {
    const deletedTenant = await Tenant.findByIdAndDelete(tenantId);
    if (!deletedTenant) {
      throw new Error('Tenant not found or already deleted');
    }

    await Payment.deleteMany({ tenant: deletedTenant._id });
    return { message: 'Tenant and their payments deleted successfully' };
  }

  // List all tenants
  async listTenants() {
    const tenants = await Tenant.find({});
    return tenants.map(tenant => tenant.toObject());
  }
}

module.exports = new TenantService();
