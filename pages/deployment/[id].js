import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function DeploymentStatus() {
  const router = useRouter();
  const { id } = router.query;
  const [deployment, setDeployment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchDeployment = async () => {
      try {
        const response = await fetch(`/api/deployment/${id}`);
        const data = await response.json();
        setDeployment(data);
      } catch (error) {
        console.error('Error fetching deployment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDeployment();
    
    // Set up polling for real-time updates
    const interval = setInterval(fetchDeployment, 3000);
    return () => clearInterval(interval);
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading deployment status...</p>
        </div>
      </div>
    );
  }

  if (!deployment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Deployment Not Found</h2>
          <p className="text-gray-600 mb-6">The deployment with ID {id} could not be found.</p>
          <button
            onClick={() => router.push('/')}
            className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-gray-800">Deployment Status</h1>
          <div className="flex items-center mt-2">
            <span className={`inline-block h-3 w-3 rounded-full mr-2 ${
              deployment.status === 'running' ? 'bg-green-500' : 
              deployment.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
            }`}></span>
            <span className="text-gray-600 capitalize">{deployment.status}</span>
          </div>
        </div>
        
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(deployment.config).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-3 rounded">
                <p className="text-sm font-medium text-gray-500">{key}</p>
                <p className="mt-1 text-sm text-gray-900 break-all">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Logs</h2>
          <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-md h-96 overflow-y-auto">
            {deployment.logs.length > 0 ? (
              deployment.logs.map((log, index) => (
                <div key={index} className="mb-1">
                  <span className="text-gray-500">$ </span>
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No logs available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
              }
