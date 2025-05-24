export const BOTS = {
  'joel-xmd': {
    name: 'Joel XMD',
    description: 'Multipurpose WhatsApp Bot',
    repo: 'https://github.com/joeljamestech2/JOEL-XMD',
    image: '/images/joel-xmd.jpg',
    defaultConfig: {
      MODE: 'public',
      PREFIX: '.',
      AUTO_STATUS_SEEN: 'true',
      ALWAYS_ONLINE: 'true',
      AUTOLIKE_STATUS: 'true',
      AUTOLIKE_EMOJI: '🫨'
    }
  },
  'demon-slayer': {
    name: 'Demon Slayer',
    description: 'Feature-rich WhatsApp Bot',
    repo: 'https://github.com/Demon-Slayer2/DEMONS-SLAYER-XMD',
    image: '/images/demon-slayer.jpg',
    defaultConfig: {
      MODE: 'public',
      PREFIX: '.',
      AUTOLIKE_STATUS: 'true',
      AUTOLIKE_EMOJI: '🫨',
      AUTO_REACT: 'true',
      AUTO_REPLY_STATUS: 'true'
    }
  },
  'cloud-ai': {
    name: 'Cloud AI',
    description: 'AI-powered WhatsApp Bot',
    repo: 'https://github.com/DEVELOPER-BERA/CLOUD-AI',
    image: '/images/cloud-ai.jpg',
    defaultConfig: {
      MODE: 'self',
      PREFIX: '!',
      AUTO_REACT: 'true',
      AUTO_BIO: 'true',
      ALWAYS_ONLINE: 'true'
    }
  }
};

export const getBotById = (id) => BOTS[id] || null;
export const getAllBots = () => Object.values(BOTS);
