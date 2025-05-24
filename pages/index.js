import Link from 'next/link';
import { getAllBots } from '../lib/bots';

export default function Home() {
  const bots = getAllBots();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-indigo-700 mb-2">Baileys Bot Deployer</h1>
          <p className="text-lg text-gray-600">
            Deploy your favorite WhatsApp bots with ease
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bots.map((bot) => (
            <Link key={bot.name} href={`/deploy/${bot.name.toLowerCase().replace(' ', '-')}`}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
                <img 
                  src={bot.image} 
                  alt={bot.name} 
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-2">{bot.name}</h2>
                  <p className="text-gray-600 mb-4">{bot.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                      {bot.defaultConfig.MODE}
                    </span>
                    <span className="text-sm text-gray-500">Prefix: {bot.defaultConfig.PREFIX}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
    }
