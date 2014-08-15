module.exports = {
  data: {
    link_only  : true,
    description: 'System related description.'
  },

  info    : require('../system/info'),
  settings: require('../system/settings'),
  tunables: require('../system/tunables'),
  logging : require('../system/logging')
  // TODO: ipsets
};