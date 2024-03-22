const HomeSettings = require('../Models/Settings');

class HomeSettingsService {
    async createSettings(settingsData) {
        try {
            const existingSettings = await HomeSettings.findOne({ ownerId: settingsData.ownerId });
            if (existingSettings) {
                throw new Error('Settings for this owner already exist.');
            }
            const settings = new HomeSettings(settingsData);
            await settings.save();
            return settings;
        } catch (error) {
            throw error;
        }
    }

    async getSettings() {
        return await HomeSettings.find();
    }

    async updateSettings(id, settingsData) {
        try {
            // Optional: Check if ownerId in settingsData conflicts with another document
            const updatedSettings = await HomeSettings.findByIdAndUpdate(id, settingsData, { new: true });
            return updatedSettings;
        } catch (error) {
            throw error;
        }
    }

    async deleteSettings(id) {
        try {
            return await HomeSettings.findByIdAndDelete(id);
        } catch (error) {
            throw error;
        }
    }
}

module.exports = new HomeSettingsService();
