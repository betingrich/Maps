import { useState } from 'react';
import { useRouter } from 'next/router';

export default function DeployBot() {
  const router = useRouter();
  const { botId } = router.query;
  
  const [formData, setFormData] = useState({
    SESSION_ID: '',
    MODE: 'public',
    AUTO_STATUS_SEEN: true,
    AUTOLIKE_STATUS: true,
    AUTOLIKE_EMOJI: '🫨',
    AUTO_REACT: false,
    AUTO_REPLY_STATUS: false,
    AUTO_READ: false,
    AUTO_TYPING: false,
    AUTO_RECORDING: false,
    ALWAYS_ONLINE: true,
    AUTO_BIO: false,
    AUTO_BLOCK: false,
    REJECT_CALL: false,
    WELCOME: false,
    ANTILINK: false,
    PREFIX: '.'
  });

  const [deploymentLogs, setDeploymentLogs] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeploymentLogs(prev => [...prev, 'Starting deployment process...']);
    
    try {
      // Validate session ID first
      setDeploymentLogs(prev => [...prev, 'Validating session ID...']);
      const validationResponse = await validateSession(formData.SESSION_ID);
      
      if (!validationResponse.valid) {
        throw new Error('Invalid session ID');
      }
      
      setDeploymentLogs(prev => [...prev, 'Session validated successfully']);
      
      // Prepare deployment
      setDeploymentLogs(prev => [...prev, 'Preparing deployment package...']);
      const deploymentConfig = {
        botId,
        ...formData,
        // Convert all boolean values to strings for environment variables
        ...Object.fromEntries(
          Object.entries(formData).map(([key, value]) => 
            [key, typeof value === 'boolean' ? value.toString() : value]
          )
        )
      };
      
      // Start deployment
      setDeploymentLogs(prev => [...prev, 'Initiating deployment...']);
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deploymentConfig),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setDeploymentLogs(prev => [...prev, 'Deployment successful!']);
        setDeploymentUrl(result.url);
      } else {
        throw new Error(result.message || 'Deployment failed');
      }
    } catch (error) {
      setDeploymentLogs(prev => [...prev, `Error: ${error.message}`]);
      console.error('Deployment error:', error);
    } finally {
      setIsDeploying(false);
    }
  };

  // Mock session validation - replace with actual implementation
  const validateSession = async (sessionId) => {
    // In a real implementation, you would validate the session ID
    // against WhatsApp's servers or your own validation service
    return { valid: sessionId.length > 10 };
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800">
              Deploy {botId?.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </h1>
            <p className="text-gray-600">Configure your bot settings below</p>
          </div>
          
          <div className="md:flex">
            {/* Configuration Form */}
            <div className="md:w-1/2 p-6 border-r">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session ID
                  </label>
                  <textarea
                    name="SESSION_ID"
                    value={formData.SESSION_ID}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Paste your session ID here"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mode
                    </label>
                    <select
                      name="MODE"
                      value={formData.MODE}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="public">Public</option>
                      <option value="self">Self</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prefix
                    </label>
                    <input
                      type="text"
                      name="PREFIX"
                      value={formData.PREFIX}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="."
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">Bot Features</h3>
                  
                  <div className="space-y-3">
                    {[
                      { name: 'AUTO_STATUS_SEEN', label: 'Auto Status Seen' },
                      { name: 'AUTOLIKE_STATUS', label: 'Auto Like Status' },
                      { name: 'AUTO_REACT', label: 'Auto React' },
                      { name: 'ALWAYS_ONLINE', label: 'Always Online' },
                      { name: 'AUTO_BLOCK', label: 'Auto Block (212 numbers)' },
                      { name: 'REJECT_CALL', label: 'Reject Calls' },
                      { name: 'WELCOME', label: 'Welcome Messages' },
                      { name: 'ANTILINK', label: 'Anti-Link' },
                    ].map((feature) => (
                      <div key={feature.name} className="flex items-center">
                        <input
                          type="checkbox"
                          id={feature.name}
                          name={feature.name}
                          checked={formData[feature.name]}
                          onChange={handleChange}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={feature.name} className="ml-2 block text-sm text-gray-700">
                          {feature.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className={`w-full py-3 px-4 rounded-md text-white font-medium ${isDeploying ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isDeploying ? 'Deploying...' : 'Deploy Bot'}
                </button>
              </div>
            </div>
            
            {/* Deployment Logs */}
            <div className="md:w-1/2 p-6 bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Deployment Logs</h3>
              
              <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-md h-96 overflow-y-auto">
                {deploymentLogs.length > 0 ? (
                  deploymentLogs.map((log, index) => (
                    <div key={index} className="mb-1">
                      <span className="text-gray-500">$ </span>
                      {log}
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">
                    Deployment logs will appear here...
                  </div>
                )}
              </div>
              
              {deploymentUrl && (
                <div className="mt-4 p-4 bg-green-50 rounded-md">
                  <p className="text-green-800">
                    Deployment successful! Your bot is running at:
                  </p>
                  <a
                    href={deploymentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-green-600 hover:text-green-700 underline"
                  >
                    {deploymentUrl}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
    }
