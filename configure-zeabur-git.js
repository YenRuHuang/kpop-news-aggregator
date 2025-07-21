#!/usr/bin/env node

const { ZeaburService } = require('./backend/src/services/zeaburService.js');
const { Logger } = require('./backend/src/utils/logger.js');

/**
 * Configure Zeabur service with GitHub repository
 */
async function configureZeaburGit() {
  const logger = new Logger('ZeaburGitConfig');
  const zeabur = new ZeaburService('sk-3fhsgpa5aoxais4lg33ix5vvetdev');
  
  try {
    logger.info('🔧 Configuring Zeabur service with GitHub repository...');
    
    // Project and service IDs from previous deployment
    const projectId = '687ddb510d798e8989250028';
    const serviceId = '687ddb520d798e898925002a';
    
    // Configure GitHub repository
    logger.info('📡 Setting up GitHub repository configuration...');
    const configMutation = `
      mutation ConfigureGitService($serviceID: ObjectID!, $gitConfig: GitConfig!) {
        configureGitService(serviceID: $serviceID, gitConfig: $gitConfig) {
          _id
          name
          template
          gitRepo {
            url
            branch
            rootDirectory
          }
        }
      }
    `;

    const gitConfig = {
      url: 'https://github.com/murs666/kpop-news-aggregator',
      branch: 'main',
      rootDirectory: '.',
      buildCommand: 'npm run install:all && npm run build',
      startCommand: 'npm start'
    };

    const configResult = await zeabur.graphqlQuery(configMutation, {
      serviceID: serviceId,
      gitConfig: gitConfig
    });

    logger.info('✅ GitHub repository configured successfully!');
    logger.info(`📝 Service: ${configResult.configureGitService.name}`);
    logger.info(`🔗 Repository: ${configResult.configureGitService.gitRepo.url}`);
    logger.info(`🌿 Branch: ${configResult.configureGitService.gitRepo.branch}`);

    // Set environment variables
    logger.info('🌱 Setting environment variables...');
    const envMutation = `
      mutation SetEnvironmentVariables($serviceID: ObjectID!, $environmentID: ObjectID!, $variables: [EnvironmentVariableInput!]!) {
        setEnvironmentVariables(serviceID: $serviceID, environmentID: $environmentID, variables: $variables) {
          key
          value
        }
      }
    `;

    const envVariables = [
      { key: 'NODE_ENV', value: 'production' },
      { key: 'PORT', value: '8080' }
    ];

    // Get environment ID (production environment)
    const envQuery = `
      query GetServiceEnvironments($serviceID: ObjectID!) {
        service(serviceID: $serviceID) {
          environments {
            _id
            name
          }
        }
      }
    `;

    const envQueryResult = await zeabur.graphqlQuery(envQuery, {
      serviceID: serviceId
    });

    const prodEnv = envQueryResult.service.environments.find(env => env.name === 'production');
    
    if (prodEnv) {
      await zeabur.graphqlQuery(envMutation, {
        serviceID: serviceId,
        environmentID: prodEnv._id,
        variables: envVariables
      });
      
      logger.info('✅ Environment variables set successfully!');
    }

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
    logger.info(`📊 Deployment Status: ${deployResult.deployService.status}`);

    logger.info('\n🎉 Zeabur configuration completed!');
    logger.info('\n📊 Summary:');
    logger.info(`  📱 Project ID: ${projectId}`);
    logger.info(`  🔧 Service ID: ${serviceId}`);
    logger.info(`  🔗 Repository: ${gitConfig.url}`);
    logger.info(`  🌿 Branch: ${gitConfig.branch}`);
    logger.info(`  📦 Build Command: ${gitConfig.buildCommand}`);
    logger.info(`  🚀 Start Command: ${gitConfig.startCommand}`);
    logger.info('\n🌐 Dashboard URL:');
    logger.info(`  https://dash.zeabur.com/projects/${projectId}`);

    return {
      success: true,
      projectId,
      serviceId,
      dashboardUrl: `https://dash.zeabur.com/projects/${projectId}`
    };

  } catch (error) {
    logger.error('❌ Configuration failed:', error.message);
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
  configureZeaburGit()
    .then(result => {
      if (result.success) {
        console.log('\n🎉 Zeabur Git configuration completed successfully!');
        console.log(`\n🌐 Monitor deployment: ${result.dashboardUrl}`);
        console.log('\n⏳ Your Kpop News Aggregator will be available shortly...');
        process.exit(0);
      } else {
        console.log('\n❌ Configuration failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('\n💥 Configuration script error:', error);
      process.exit(1);
    });
}

module.exports = { configureZeaburGit };