#!/usr/bin/env node

const { ZeaburService } = require('./backend/src/services/zeaburService.js');

async function simpleZeaburCheck() {
  const zeabur = new ZeaburService('sk-3fhsgpa5aoxais4lg33ix5vvetdev');
  
  try {
    const projectId = '687ddb510d798e8989250028';
    const serviceId = '687ddb520d798e898925002a';
    
    console.log('🔍 Checking Zeabur service status...\n');

    // Simple service status query
    const statusQuery = `
      query {
        services {
          _id
          name
          status
          template
        }
      }
    `;

    const statusResult = await zeabur.graphqlQuery(statusQuery, {});
    
    console.log('📊 All Services:');
    statusResult.services.forEach(service => {
      console.log(`  • ${service.name} (${service._id})`);
      console.log(`    Status: ${service.status}`);
      console.log(`    Template: ${service.template}`);
      console.log('');
    });

    // Find our specific service
    const ourService = statusResult.services.find(s => s._id === serviceId);
    
    if (ourService) {
      console.log('🎯 Our Kpop News Service:');
      console.log(`  Name: ${ourService.name}`);
      console.log(`  Status: ${ourService.status}`);
      console.log(`  Template: ${ourService.template}`);
      console.log('');

      if (ourService.status === 'RUNNING') {
        console.log('✅ Service is RUNNING! Your website should be live!');
      } else if (ourService.status === 'BUILDING') {
        console.log('🔄 Service is BUILDING... Please wait for deployment to complete.');
      } else if (ourService.status === 'FAILED') {
        console.log('❌ Service deployment FAILED. Check logs in dashboard.');
      } else {
        console.log(`⚠️ Service status: ${ourService.status}`);
      }
    } else {
      console.log('❌ Could not find our service in the list');
    }

    console.log('\n🌐 Dashboard URL: https://dash.zeabur.com/projects/687ddb510d798e8989250028');
    console.log('📱 GitHub Repo: https://github.com/YenRuHuang/kpop-news-aggregator');

    return { success: true, service: ourService };

  } catch (error) {
    console.error('❌ Failed to check status:', error.message);
    if (error.response?.data) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    return { success: false, error: error.message };
  }
}

if (require.main === module) {
  simpleZeaburCheck()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n💥 Status check error:', error);
      process.exit(1);
    });
}

module.exports = { simpleZeaburCheck };