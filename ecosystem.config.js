module.exports = {
  apps: [
    {
      name: "image",
      script: "./build/image.js",
      watch: true,
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
