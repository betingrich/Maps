import { validateSession, validateBotConfig, sanitizeConfig } from '../../utils/validation';
import { formatEnvVars } from '../../utils/helpers';

// In your deployment handler:
const handleDeploy = async (values) => {
  setIsDeploying(true);
  
  try {
    const response = await fetch('/api/deploy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        botId,
        ...values
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setDeploymentId(data.id);
      router.push(`/deployment/${data.id}`);
    } else {
      throw new Error(data.message || 'Deployment failed');
    }
  } catch (error) {
    alert(error.message);
  } finally {
    setIsDeploying(false);
  }
};
