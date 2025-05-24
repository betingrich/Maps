import { getDeployment } from '../../../lib/deployment';

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const deployment = getDeployment(id);
    
    if (!deployment) {
      return res.status(404).json({ message: 'Deployment not found' });
    }
    
    res.status(200).json(deployment);
  } catch (error) {
    console.error('Error fetching deployment:', error);
    res.status(500).json({ 
      message: 'Error fetching deployment', 
      error: error.message 
    });
  }
}
