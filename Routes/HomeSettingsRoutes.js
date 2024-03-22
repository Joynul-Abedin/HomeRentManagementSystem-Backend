const express = require('express');
const router = express.Router();
const HomeSettingsService = require('../Services/HomeSettingsServices');

router.post('/', async (req, res) => {
    try {
        const settings = await HomeSettingsService.createSettings(req.body);
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const settings = await HomeSettingsService.getSettings();
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedSettings = await HomeSettingsService.updateSettings(req.params.id, req.body);
        res.json(updatedSettings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await HomeSettingsService.deleteSettings(req.params.id);
        res.send('Settings deleted successfully.');
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
