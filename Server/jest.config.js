// jest.config.js
module.exports = {
    transform: {
      "^.+\\.[tj]sx?$": "babel-jest"
    },
    moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
    verbose: true, // Detailed logs
    collectCoverage: true, // Check if specific files aren’t covered due to transformation issues
  };
  