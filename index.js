const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Kpop News Aggregator</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
          h1 { color: #e91e63; text-align: center; }
          .status { background: #e8f5e8; padding: 15px; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <h1>🎵 Kpop News Aggregator</h1>
        <div class="status">
          <h3>✅ Deployment Successful!</h3>
          <p>Your Kpop News Aggregator is now running on Zeabur!</p>
          <p><strong>Status:</strong> All systems operational</p>
          <p><strong>Platform:</strong> Zeabur Cloud</p>
          <p><strong>Runtime:</strong> Node.js ${process.version}</p>
        </div>
        <h3>🚀 Next Steps:</h3>
        <ul>
          <li>✅ Basic server deployment working</li>
          <li>⏳ Add React frontend</li>
          <li>⏳ Connect RSS aggregation</li>
          <li>⏳ Add database integration</li>
        </ul>
      </body>
    </html>
  `);
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Kpop News Aggregator is running!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});