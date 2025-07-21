const axios = require('axios');
const { Logger } = require('../utils/logger.js');

/**
 * Zeabur Deployment Service for Kpop News Aggregator
 */
class ZeaburService {
  constructor(apiKey) {
    this.logger = new Logger('ZeaburService');
    this.apiBase = 'https://api.zeabur.com/graphql';
    this.apiKey = apiKey;
    
    if (!this.apiKey) {
      this.logger.warn('ZEABUR_API_KEY not provided');
    }
  }

  /**
   * Initialize Zeabur client
   */
  initialize() {
    if (!this.apiKey) {
      throw new Error('Zeabur API key is required');
    }

    this.client = axios.create({
      baseURL: '',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    this.logger.info('Zeabur service initialized successfully');
  }

  /**
   * GraphQL query executor
   */
  async graphqlQuery(query, variables = {}) {
    if (!this.client) {
      this.initialize();
    }

    try {
      const response = await this.client.post(this.apiBase, {
        query,
        variables
      });

      if (response.data.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(response.data.errors)}`);
      }

      return response.data.data;
    } catch (error) {
      this.logger.error('GraphQL query failed:', error.message);
      throw error;
    }
  }

  /**
   * Create a new project from GitHub repository
   */
  async createProjectFromGitHub(repositoryUrl, projectName = 'kpop-news-aggregator') {
    const mutation = `
      mutation CreateProjectFromGitHub($repositoryUrl: String!, $name: String!) {
        createProjectFromGitHub(repositoryUrl: $repositoryUrl, name: $name) {
          _id
          name
          status
          environments {
            _id
            name
          }
          services {
            _id
            name
            template
            status
          }
        }
      }
    `;

    try {
      const result = await this.graphqlQuery(mutation, { 
        repositoryUrl, 
        name: projectName 
      });
      this.logger.info(`Project created successfully: ${result.createProjectFromGitHub._id}`);
      return result.createProjectFromGitHub;
    } catch (error) {
      this.logger.error('Failed to create project:', error.message);
      throw error;
    }
  }

  /**
   * Deploy service from GitHub
   */
  async deployFromGitHub(repositoryUrl, options = {}) {
    const mutation = `
      mutation DeployFromGitHub($input: DeployFromGitHubInput!) {
        deployFromGitHub(input: $input) {
          _id
          name
          status
          environments {
            _id
            name
            status
            domains {
              domain
              isGenerated
            }
          }
          services {
            _id
            name
            template
            status
          }
        }
      }
    `;

    const input = {
      repositoryUrl,
      name: options.projectName || 'kpop-news-aggregator',
      serviceName: options.serviceName || 'kpop-news-api',
      environmentName: options.environmentName || 'production',
      framework: options.framework || 'nodejs',
      buildCommand: options.buildCommand || 'npm run build',
      startCommand: options.startCommand || 'npm start',
      rootDirectory: options.rootDirectory || '.',
      environmentVariables: options.environmentVariables || {},
      ...options
    };

    try {
      const result = await this.graphqlQuery(mutation, { input });
      this.logger.info(`Deployment initiated: ${result.deployFromGitHub._id}`);
      return result.deployFromGitHub;
    } catch (error) {
      this.logger.error('Failed to deploy from GitHub:', error.message);
      throw error;
    }
  }

  /**
   * Get project information
   */
  async getProject(projectId) {
    const query = `
      query GetProject($projectId: ObjectID!) {
        project(id: $projectId) {
          _id
          name
          description
          createdAt
          updatedAt
          services {
            _id
            name
            template
            status
            environments {
              _id
              name
              status
              domains {
                domain
                isGenerated
              }
            }
          }
        }
      }
    `;

    return await this.graphqlQuery(query, { projectId });
  }

  /**
   * Monitor deployment status
   */
  async monitorDeployment(projectId, options = {}) {
    const maxWaitTime = options.maxWaitTime || 600000; // 10 minutes
    const pollInterval = options.pollInterval || 10000; // 10 seconds
    const startTime = Date.now();

    this.logger.info(`Monitoring deployment for project ${projectId}...`);

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const project = await this.getProject(projectId);
        const services = project.project.services;
        
        let allReady = true;
        let deploymentUrl = null;

        for (const service of services) {
          this.logger.info(`Service ${service.name}: ${service.status}`);
          
          if (service.status === 'FAILED') {
            this.logger.error(`Service ${service.name} deployment failed`);
            return { success: false, status: 'FAILED', project };
          }

          if (service.status !== 'READY') {
            allReady = false;
          } else {
            // Get the deployment URL from the first ready service
            const environment = service.environments?.[0];
            const domain = environment?.domains?.[0]?.domain;
            if (domain && !deploymentUrl) {
              deploymentUrl = `https://${domain}`;
            }
          }
        }

        if (allReady) {
          this.logger.info('All services deployed successfully!');
          return { 
            success: true, 
            status: 'READY', 
            project,
            deploymentUrl 
          };
        }

        // Wait before next check
        await new Promise(resolve => setTimeout(resolve, pollInterval));

      } catch (error) {
        this.logger.error('Error monitoring deployment:', error.message);
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      }
    }

    this.logger.error('Deployment monitoring timed out');
    return { success: false, status: 'TIMEOUT' };
  }

  /**
   * Complete deployment workflow
   */
  async deployProject(repositoryUrl, options = {}) {
    try {
      this.logger.info('Starting deployment workflow...');
      
      // Deploy from GitHub
      const project = await this.deployFromGitHub(repositoryUrl, {
        projectName: 'kpop-news-aggregator',
        serviceName: 'kpop-news-api',
        environmentName: 'production',
        buildCommand: 'npm run build',
        startCommand: 'npm start',
        rootDirectory: '.',
        environmentVariables: {
          NODE_ENV: 'production',
          PORT: '8080'
        },
        ...options
      });

      // Monitor deployment
      const result = await this.monitorDeployment(project._id, options);

      if (result.success) {
        this.logger.info(`Deployment completed successfully!`);
        if (result.deploymentUrl) {
          this.logger.info(`Application URL: ${result.deploymentUrl}`);
        }
        
        return {
          success: true,
          projectId: project._id,
          deploymentUrl: result.deploymentUrl,
          project: result.project
        };
      } else {
        throw new Error(`Deployment failed with status: ${result.status}`);
      }

    } catch (error) {
      this.logger.error('Deployment workflow failed:', error.message);
      throw error;
    }
  }
}

module.exports = { ZeaburService };
module.exports.default = ZeaburService;