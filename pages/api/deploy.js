import { createDeployment } from '../../lib/deployment';
import { getBotById } from '../../lib/bots';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { botId, ...config } = req.body;
    
    // Validate bot exists
    const bot = getBotById(botId);
    if (!bot) {
      return res.status(400).json({ message: 'Invalid bot ID' });
    }
    
    // Create deployment
    const deployment = await createDeployment(botId, config);
    
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
