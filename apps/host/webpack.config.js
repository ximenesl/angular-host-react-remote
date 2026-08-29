const { shareAll, withModuleFederation } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederation({
  remotes: {
    cartRemote: 'cartRemote@http://localhost:4201/remoteEntry.js',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
