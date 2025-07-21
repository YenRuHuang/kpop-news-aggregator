#!/usr/bin/env node

const { ZeaburService } = require('./backend/src/services/zeaburService.js');
const { Logger } = require('./backend/src/utils/logger.js');

async function finalizeZeaburDeployment() {
  const logger = new Logger('FinalDeploy');
  const zeabur = new ZeaburService('sk-3fhsgpa5aoxais4lg33ix5vvetdev');
  
  try {
    logger.info('🚀 Configuring Zeabur with GitHub repository...');
    
    const projectId = '687ddb510d798e8989250028';
    const serviceId = '687ddb520d798e898925002a';
    const repoUrl = 'https://github.com/YenRuHuang/kpop-news-aggregator';
    
    // Configure GitHub repository
    logger.info('📡 Setting up GitHub repository configuration...');
    const configMutation = `
      mutation UpdateService($serviceID: ObjectID!, $gitRepo: String!, $branch: String!, $rootDirectory: String!) {
        updateService(serviceID: $serviceID, gitRepo: $gitRepo, branch: $branch, rootDirectory: $rootDirectory) {
          _id
          name
          template
        }
      }
    `;

    const configResult = await zeabur.graphqlQuery(configMutation, {
      serviceID: serviceId,
      gitRepo: repoUrl,
      branch: 'main',
      rootDirectory: '.'
    });

    logger.info('✅ GitHub repository configured!');

    // Set environment variables
    logger.info('🌱 Setting environment variables...');
    
    const envMutation = `
      mutation SetEnvironmentVariable($serviceID: ObjectID!, $key: String!, $value: String!) {
        setEnvironmentVariable(serviceID: $serviceID, key: $key, value: $value) {
          key
          value
        }
      }
    `;

    // Set NODE_ENV
    await zeabur.graphqlQuery(envMutation, {
      serviceID: serviceId,
      key: 'NODE_ENV',
      value: 'production'
    });

    // Set PORT
    await zeabur.graphqlQuery(envMutation, {
      serviceID: serviceId,
      key: 'PORT',
      value: '8080'
    });

    logger.info('✅ Environment variables configured!');

    // Deploy the service
    logger.info('🚀 Triggering deployment...');
    
    const deployMutation = `
      mutation DeployService($serviceID: ObjectID!) {
        deployService(serviceID: $serviceID) {
          _id
          status
        }
      }
    `;

    const deployResult = await zeabur.graphqlQuery(deployMutation, {
      serviceID: serviceId
    });

    logger.info('✅ Deployment triggered successfully!');
    
    console.log('\n🎉 KPOP NEWS AGGREGATOR DEPLOYMENT COMPLETED! 🎉\n');
    console.log('📊 Final Summary:');
    console.log(`  📱 GitHub Repository: ${repoUrl}`);
    console.log(`  🌐 Zeabur Dashboard: https://dash.zeabur.com/projects/${projectId}`);
    console.log(`  🔧 Service ID: ${serviceId}`);
    console.log('  📦 Build: Automated with npm install + build');
    console.log('  🚀 Runtime: Node.js production server');
    console.log('\n⏳ Your Kpop News Aggregator is now deploying...');
    console.log('🎵 Live website will be available in 2-3 minutes!');
    console.log(`\n👀 Monitor deployment: https://dash.zeabur.com/projects/${projectId}`);
    console.log('\n🎯 Features going live:');
    console.log('  • Automated RSS news aggregation from Soompi, AllKPop');
    console.log('  • Intelligent K-pop content detection');
    console.log('  • Real-time search and filtering');
    console.log('  • Responsive design for all devices');
    console.log('  • Modern React + TypeScript frontend');

    return { success: true };

  } catch (error) {
    logger.error('❌ Final configuration failed:', error.message);
    if (error.response?.data) {
      logger.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  finalizeZeaburDeployment()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n💥 Final deployment error:', error);
      process.exit(1);
    });
}

module.exports = { finalizeZeaburDeployment };