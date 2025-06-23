
const webRTCConfig = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302'
    },
    {
      urls: 'stun:stun1.l.google.com:19302'
    },
    {
      urls: 'stun:stun2.l.google.com:19302'
    },
    {
      urls: 'stun:stun3.l.google.com:19302'
    },
    {
      urls: 'stun:stun4.l.google.com:19302'
    }
  ],
  iceCandidatePoolSize: 10
};

// For production,add TURN servers
const productionConfig = {
  iceServers: [
    ...webRTCConfig.iceServers,
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'your-username',
      credential: 'your-password'
    }
  ],
  iceCandidatePoolSize: 10
};

module.exports = {
  development: webRTCConfig,
  production: process.env.NODE_ENV === 'production' ? productionConfig : webRTCConfig
};
