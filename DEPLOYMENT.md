# Zeabur Deployment Instructions

## Automated Deployment Script

This project includes an automated deployment script that creates a Zeabur project and service for the Kpop News Aggregator.

### Usage

```bash
# Deploy to Zeabur
npm run deploy

# Or run directly
node deploy-to-zeabur.js
```

### What the Script Does

The deployment script automatically:
1. **Creates a new Zeabur project** in the Jakarta region
2. **Creates a Git-based service** within the project
3. **Provides configuration instructions** for manual setup

### Configuration

The deployment script uses:
- **Repository**: https://github.com/murs666/kpop-news-aggregator
- **API Key**: sk-3fhsgpa5aoxais4lg33ix5vvetdev
- **Region**: Jakarta, Indonesia (cgk1)
- **Service Name**: kpop-news-api

### Manual Configuration Steps

After running the script, you'll need to complete the deployment manually:

1. **Go to the Zeabur Dashboard**: https://dash.zeabur.com/
2. **Navigate to your project** (name will be displayed in script output)
3. **Click on the service**: kpop-news-api
4. **Configure the GitHub repository**:
   - Repository: `https://github.com/murs666/kpop-news-aggregator`
   - Branch: `main`
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Root Directory: `.` (project root)
5. **Set environment variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `8080`
6. **Deploy the service** by clicking the deploy button

### Project Structure

```
kpop-news-aggregator/
├── package.json                    # Root package with start script
├── backend/                       # Express.js API
│   ├── package.json              # Backend dependencies
│   └── src/
│       ├── app.js                # Main application entry
│       ├── services/
│       │   └── zeaburService.js  # Zeabur API integration
│       ├── utils/
│       │   └── logger.js         # Simple logging utility
│       ├── config/
│       │   └── index.js          # Configuration settings
│       ├── routes/
│       └── ...
├── frontend/                     # React + TypeScript
│   ├── package.json
│   ├── dist/                    # Built frontend assets
│   └── src/
└── deploy-to-zeabur.js          # Automated deployment script
```

### Expected Script Output

```
🚀 Starting Kpop News Aggregator deployment...
📦 Creating new project...
✅ Project created successfully!
📱 Project ID: [project-id]
📝 Project Name: kpop-news-aggregator-[timestamp]
🌍 Region: Jakarta, Indonesia
🔧 Creating service from GitHub repository...
✅ Service created successfully!
🔧 Service ID: [service-id]
📝 Service Name: kpop-news-api

🎉 Zeabur project and service created successfully!

🌐 Dashboard: https://dash.zeabur.com/projects/[project-id]
📱 Project: kpop-news-aggregator-[timestamp] ([project-id])
🔧 Service: kpop-news-api ([service-id])

👆 Follow the manual configuration steps above to complete the deployment.
```

### Troubleshooting

- **API Connection Issues**: Ensure the API key is valid and has proper permissions
- **GraphQL Errors**: The script handles common GraphQL validation errors automatically
- **Project Already Exists**: The script creates uniquely named projects to avoid conflicts
- **Service Configuration**: Manual configuration is required due to Zeabur API limitations

### After Deployment

Once you complete the manual configuration:
1. Your application will be automatically built and deployed
2. A unique URL will be generated (e.g., `https://your-app.zeabur.app`)
3. You can monitor deployment progress in the Zeabur dashboard
4. Logs and metrics are available in the service console

### Build and Runtime Configuration

- **Node.js Version**: Latest LTS
- **Build Process**: Builds frontend assets to `dist/` folder
- **Start Process**: Runs Express server from `backend/src/app.js`
- **Port**: Application runs on port 8080 in production
- **Environment**: Configured for production with appropriate security settings