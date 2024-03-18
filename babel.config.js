module.exports = (api) => {
    api.cache(true); // Enable caching
  
    return {
      presets: [
        [
          "@babel/preset-env",
          {
            // Preset options
          },
        ],
        "@babel/preset-react",
      ],
      plugins: [
        // Add any Babel plugins here
        'macros'
      ],
    };
  };
  