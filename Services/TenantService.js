const Tenant = require('../Models/Tenant');
const QRCode = require('qrcode');
const PaymentService = require('./PaymntService');

class TenantService {
  async createTenant(tenantData) {
    const existingTenant = await Tenant.findOne({ nidNo: tenantData.nidNo });
    if (existingTenant) {
      throw new Error('This Tenant already exists');
    }

    const tenant = new Tenant(tenantData);
    await tenant.save();

    const qrCodeData = `https://hrms-f96y.onrender.com/api/tenants/current-payment/${tenant._id}`;
    tenant.qrCode = await QRCode.toDataURL(qrCodeData);

    await tenant.save();

    const { password: _, ...userWithoutPassword } = tenant.toObject();
    return userWithoutPassword;
  }
  // In TenantService.js

  async getTenantAndPaymentDetails(tenantId) {
    const tenant = await this.getTenantById(tenantId);
    if (!tenant) {
      throw new Error('Tenant not found');
    }
    const payment = await PaymentService.getPaymentDetailsForMonth(tenant.id);
    console.log("payment from tenantService", payment);
    return { tenant, payment };
  }



  async getTenantById(tenantId) {
    return await Tenant.findById(tenantId);
  }

  async updateTenant(tenantId, tenantData) {
    return await Tenant.findByIdAndUpdate(tenantId, tenantData, { new: true });
  }

  async deleteTenant(tenantId) {
    return await Tenant.findByIdAndDelete(tenantId);
  }

  async listTenants() {
    return await Tenant.find({});
  }
}

module.exports = new TenantService();
