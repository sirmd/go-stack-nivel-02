export default {
  jwt: {
    secret: process.env.APP_SECRET || 'segredo',
    expiresIn: '1d',
  },
};
