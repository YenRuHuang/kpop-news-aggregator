#!/usr/bin/env node

const { ZeaburService } = require('./backend/src/services/zeaburService.js');
const { Logger } = require('./backend/src/utils/logger.js');

async function checkZeaburLogs() {
  const logger = new Logger('ZeaburLogs');
  const zeabur = new ZeaburService('sk-3fhsgpa5aoxais4lg33ix5vvetdev');
  
  try {
    const projectId = '687ddb510d798e8989250028';
    const serviceId = '687ddb520d798e898925002a';
    
    logger.info('🔍 Checking Zeabur deployment status and logs...');

    // Get service status
    const serviceQuery = `
      query GetService($serviceID: ObjectID!) {
        service(serviceID: $serviceID) {
          _id
          name
          template
          status
          gitRepo {
            url
            branch
            rootDirectory
          }
          deployments(first: 5) {
            edges {
              node {
                _id
                status
                createdAt
                finishedAt
                exitCode
                error
              }
            }
          }
        }
      }
    `;

    const serviceResult = await zeabur.graphqlQuery(serviceQuery, {
      serviceID: serviceId
    });

    const service = serviceResult.service;
    console.log('\n📊 Service Status:');
    console.log(`  Name: ${service.name}`);
    console.log(`  Status: ${service.status}`);
    console.log(`  Template: ${service.template}`);
    if (service.gitRepo) {
      console.log(`  Repository: ${service.gitRepo.url}`);
      console.log(`  Branch: ${service.gitRepo.branch}`);
      console.log(`  Root Directory: ${service.gitRepo.rootDirectory}`);
    }

    console.log('\n📜 Recent Deployments:');
    service.deployments.edges.forEach((edge, index) => {
      const deployment = edge.node;
      console.log(`  ${index + 1}. ID: ${deployment._id}`);
      console.log(`     Status: ${deployment.status}`);
      console.log(`     Created: ${new Date(deployment.createdAt).toLocaleString()}`);
      if (deployment.finishedAt) {
        console.log(`     Finished: ${new Date(deployment.finishedAt).toLocaleString()}`);
      }
      if (deployment.exitCode !== null) {
        console.log(`     Exit Code: ${deployment.exitCode}`);
      }
      if (deployment.error) {
        console.log(`     Error: ${deployment.error}`);
      }
      console.log('');
    });

    // Get deployment logs
    const latestDeployment = service.deployments.edges[0]?.node;
    if (latestDeployment) {
      logger.info('📋 Fetching deployment logs...');
      
      const logsQuery = `
        query GetDeploymentLogs($deploymentID: ObjectID!) {
          deploymentLogs(deploymentID: $deploymentID) {
            log
            timestamp
          }
        }
      `;

      try {
        const logsResult = await zeabur.graphqlQuery(logsQuery, {
          deploymentID: latestDeployment._id
        });

        console.log('\n📋 Latest Deployment Logs:');
        console.log('=====================================');
        if (logsResult.deploymentLogs && logsResult.deploymentLogs.length > 0) {
          logsResult.deploymentLogs.forEach(logEntry => {
            console.log(`[${new Date(logEntry.timestamp).toLocaleTimeString()}] ${logEntry.log}`);
          });
        } else {
          console.log('No logs available');
        }
        console.log('=====================================\n');
      } catch (logError) {
        console.log('Could not fetch deployment logs:', logError.message);
      }
    }

    // Get service runtime logs if available
    try {
      const runtimeLogsQuery = `
        query GetServiceLogs($serviceID: ObjectID!) {
          serviceLogs(serviceID: $serviceID, last: 50) {
            log
            timestamp
          }
        }
      `;

      const runtimeLogsResult = await zeabur.graphqlQuery(runtimeLogsQuery, {
        serviceID: serviceId
      });

      console.log('\n🖥️ Runtime Logs:');
      console.log('=====================================');
      if (runtimeLogsResult.serviceLogs && runtimeLogsResult.serviceLogs.length > 0) {
        runtimeLogsResult.serviceLogs.forEach(logEntry => {
          console.log(`[${new Date(logEntry.timestamp).toLocaleTimeString()}] ${logEntry.log}`);
        });
      } else {
        console.log('No runtime logs available');
      }
      console.log('=====================================\n');
    } catch (runtimeLogError) {
      console.log('Could not fetch runtime logs:', runtimeLogError.message);
    }

    return { success: true };

  } catch (error) {
    logger.error('❌ Failed to check logs:', error.message);
    if (error.response?.data) {
      logger.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  checkZeaburLogs()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n💥 Log check error:', error);
      process.exit(1);
    });
}

module.exports = { checkZeaburLogs };