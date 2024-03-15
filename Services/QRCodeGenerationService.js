const toDataURL = require('qrcode').toDataURL;

app.get('/tenant/qrcode/:id', async (req, res) => {
  const tenantId = req.params.id;
  
  const qrCodeUrl = `http://yourapp.com/tenant/${tenantId}`;
  toDataURL(qrCodeUrl, (err, url) => {
    if (err) return res.status(500).send('Error generating QR code');
    res.send({ qrCode: url });
  });
});
