import { deploymentFunctions } from '../../lib/deployment';
import { serverHelpers } from '../../utils/helpers';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { botId, ...config } = req.body;
    
    // In production, you would use serverHelpers here:
    // const deploymentDir = await serverHelpers.createDeploymentDir(process.env.DEPLOYMENTS_DIR, deploymentId);
    // await serverHelpers.executeCommand(`git clone ${repoUrl} ${deploymentDir}`);
    
    const deployment = await deploymentFunctions.createDeployment(botId, config);
    
    res.status(200).json({
      id: deployment.id,
      status: deployment.status,
      message: 'Deployment started successfully',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/deployment/${deployment.id}`
    });
  } catch (error) {
    console.error('Deployment error:', error);
    res.status(500).json({ 
      message: 'Deployment failed', 
      error: error.message 
    });
  }
}
