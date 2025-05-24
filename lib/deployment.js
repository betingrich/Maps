import { generateDeploymentId } from '../utils/helpers';

// In-memory store for deployments (replace with database in production)
const deployments = {};

function simulateDeployment(deploymentId) {
  const deployment = deployments[deploymentId];
  if (!deployment) return;

  const steps = [
    { delay: 1000, message: 'Validating session ID...' },
    { delay: 1500, message: 'Creating deployment environment...' },
    { delay: 2000, message: 'Downloading bot source code...' },
    { delay: 2500, message: 'Installing dependencies...' },
    { delay: 3000, message: 'Configuring environment variables...' },
    { delay: 2000, message: 'Starting bot process...' }
  ];

  let totalDelay = 0;
  steps.forEach((step, index) => {
    totalDelay += step.delay;
    setTimeout(() => {
      if (!deployments[deploymentId]) return;
      
      deployment.logs.push(`${new Date().toISOString()} - ${step.message}`);
      deployment.updatedAt = new Date().toISOString();
      
      if (index === steps.length - 1) {
        deployment.status = 'running';
        deployment.logs.push(`${new Date().toISOString()} - Deployment completed successfully!`);
      }
    }, totalDelay);
  });
}

export const deploymentFunctions = {
  createDeployment: async (botId, config) => {
    const deploymentId = generateDeploymentId();
    const timestamp = new Date().toISOString();

    const deployment = {
      id: deploymentId,
      botId,
      status: 'initializing',
      createdAt: timestamp,
      updatedAt: timestamp,
      logs: [`${timestamp} - Deployment initialized`],
      config
    };

    deployments[deploymentId] = deployment;
    simulateDeployment(deploymentId);
    return deployment;
  },

  getDeployment: (id) => {
    return deployments[id] || null;
  }
};
