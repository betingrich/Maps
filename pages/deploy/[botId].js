import { useState } from 'react';
import { useRouter } from 'next/router';
import { getBotById } from '../../lib/bots';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const DeploymentSchema = Yup.object().shape({
  SESSION_ID: Yup.string()
    .required('Session ID is required')
    .min(10, 'Session ID too short'),
  MODE: Yup.string()
    .oneOf(['public', 'self'], 'Invalid mode')
    .required('Mode is required'),
  PREFIX: Yup.string()
    .max(3, 'Prefix too long')
});

export default function DeployBot() {
  const router = useRouter();
  const { botId } = router.query;
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentId, setDeploymentId] = useState(null);

  const bot = getBotById(botId);
  if (!bot) {
    router.push('/');
    return null;
  }

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

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800">
              Deploy {bot.name}
            </h1>
          </div>
          
          <Formik
            initialValues={{
              SESSION_ID: '',
              MODE: bot.defaultConfig.MODE || 'public',
              PREFIX: bot.defaultConfig.PREFIX || '.',
              ...bot.defaultConfig
            }}
            validationSchema={DeploymentSchema}
            onSubmit={handleDeploy}
          >
            {({ values }) => (
              <Form className="p-6">
                {/* Form fields here */}
                <button
                  type="submit"
                  disabled={isDeploying}
                  className={`px-6 py-3 rounded-md text-white font-medium ${
                    isDeploying ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isDeploying ? 'Deploying...' : 'Deploy Bot'}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
                  }
