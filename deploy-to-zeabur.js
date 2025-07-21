#!/usr/bin/env node

const { ZeaburService } = require('./backend/src/services/zeaburService.js');
const { Logger } = require('./backend/src/utils/logger.js');

/**
 * Deploy Kpop News Aggregator to Zeabur
 */
async function deployToZeabur() {
  const logger = new Logger('KpopNewsDeploy');
  const zeabur = new ZeaburService('sk-3fhsgpa5aoxais4lg33ix5vvetdev');
  
  try {
    logger.info('🚀 Starting Kpop News Aggregator deployment...');
    
    // Step 1: Create a new project
    logger.info('📦 Creating new project...');
    const createProjectMutation = `
      mutation CreateProject($name: String!, $region: String!) {
        createProject(name: $name, region: $region) {
          _id
          name
          region {
            id
            name
          }
        }
      }
    `;

    const projectResult = await zeabur.graphqlQuery(createProjectMutation, {
      name: `kpop-news-aggregator-${Date.now()}`,
      region: 'cgk1' // Jakarta region
    });

    logger.info('✅ Project created successfully!');
    logger.info(`📱 Project ID: ${projectResult.createProject._id}`);
    logger.info(`📝 Project Name: ${projectResult.createProject.name}`);
    logger.info(`🌍 Region: ${projectResult.createProject.region.name}`);

    // Step 2: Create a service with Git template
    logger.info('🔧 Creating service from GitHub repository...');
    const createServiceMutation = `
      mutation CreateService($projectID: ObjectID!, $name: String!, $template: ServiceTemplate!) {
        createService(projectID: $projectID, name: $name, template: $template) {
          _id
          name
          template
        }
      }
    `;

    const serviceResult = await zeabur.graphqlQuery(createServiceMutation, {
      projectID: projectResult.createProject._id,
      name: 'kpop-news-api',
      template: 'GIT' // Git template for GitHub repository
    });

    logger.info('✅ Service created successfully!');
    logger.info(`🔧 Service ID: ${serviceResult.createService._id}`);
    logger.info(`📝 Service Name: ${serviceResult.createService.name}`);

    logger.info('🎉 Basic deployment setup completed!');
    logger.info('\n📊 Deployment Summary:');
    logger.info(`  📱 Project ID: ${projectResult.createProject._id}`);
    logger.info(`  📝 Project Name: ${projectResult.createProject.name}`);
    logger.info(`  🔧 Service ID: ${serviceResult.createService._id}`);
    logger.info(`  📝 Service Name: ${serviceResult.createService.name}`);

    logger.info('\n📋 Manual Configuration Steps:');
    logger.info('  1. Go to https://dash.zeabur.com/');
    logger.info(`  2. Navigate to your project: ${projectResult.createProject.name}`);
    logger.info(`  3. Click on the service: ${serviceResult.createService.name}`);
    logger.info('  4. Configure the GitHub repository:');
    logger.info('     - Repository: https://github.com/murs666/kpop-news-aggregator');
    logger.info('     - Branch: main');
    logger.info('     - Build Command: npm run build');
    logger.info('     - Start Command: npm start');
    logger.info('     - Root Directory: . (project root)');
    logger.info('  5. Set environment variables:');
    logger.info('     - NODE_ENV: production');
    logger.info('     - PORT: 8080');
    logger.info('  6. Deploy the service');

    logger.info('\n🌐 Zeabur Dashboard URL:');
    logger.info(`  https://dash.zeabur.com/projects/${projectResult.createProject._id}`);

    return {
      success: true,
      projectId: projectResult.createProject._id,
      projectName: projectResult.createProject.name,
      serviceId: serviceResult.createService._id,
      serviceName: serviceResult.createService.name,
      dashboardUrl: `https://dash.zeabur.com/projects/${projectResult.createProject._id}`
    };

  } catch (error) {
    logger.error('❌ Deployment failed:', error.message);
    if (error.response?.data) {
      logger.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    return {
      success: false,
      error: error.message
    };
  }
}

// Handle script execution
if (require.main === module) {
  deployToZeabur()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Zeabur project and service created successfully!');
        console.log(`\n🌐 Dashboard: ${result.dashboardUrl}`);
        console.log(`📱 Project: ${result.projectName} (${result.projectId})`);
        console.log(`🔧 Service: ${result.serviceName} (${result.serviceId})`);
        console.log('\n👆 Follow the manual configuration steps above to complete the deployment.');
        process.exit(0);
      } else {
        console.log('\n❌ Deployment failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 Deployment script error:', error);
      process.exit(1);
    });
}

module.exports = { deployToZeabur };