module.exports = function override(config, env) {
  // Add webpack-dev-server configuration
  config.devServer = {
    ...config.devServer,
    // Replace deprecated onBeforeSetupMiddleware and onAfterSetupMiddleware with setupMiddlewares
    setupMiddlewares: (middlewares, devServer) => {
      // Your custom middleware setup can go here if needed
      
      // This is equivalent to the deprecated onBeforeSetupMiddleware
      if (devServer.app) {
        // Add your middleware before the default middlewares here
      }
      
      // Return middlewares to be used by webpack-dev-server
      return middlewares;
    }
  };
  
  return config;
};