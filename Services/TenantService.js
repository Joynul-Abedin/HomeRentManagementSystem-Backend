const Tenant = require('../Models/Tenant');
const QRCode = require('qrcode');

class TenantService {
//   async createTenant(tenantData) {
//     const existingTenant = await Tenant.findOne({ nidNo: tenantData.nidNo });
//     if (existingTenant) {
//       throw new Error('This Tenant is already exists');
//     }
//     const tenant = new Tenant(tenantData);
//     await tenant.save();
//     return tenant;
//   }

async createTenant(tenantData) {
  const existingTenant = await Tenant.findOne({ nidNo: tenantData.nidNo });
  if (existingTenant) {
    throw new Error('This Tenant already exists');
  }

  const tenant = new Tenant(tenantData);
  await tenant.save();

  const qrCodeData = `Tenant ID: ${tenant._id}`; 
  tenant.qrCode = await QRCode.toDataURL(qrCodeData);

  await tenant.save();
  
  const { password: _, ...userWithoutPassword } = tenant.toObject();
  return userWithoutPassword;
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
