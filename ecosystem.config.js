module.exports = {
  apps: [
    {
      name: "image",
      script: "./build/image.js",
      watch: true,
      env: {
        NODE_ENV: "development",
        bucket: "sportyeah-test",
      },
      env_production: {
        NODE_ENV: "production",
        bucket: "sportyeah",
      },
      env_test: {
        NODE_ENV: "test",
        bucket: "sportyeah-test",
      },
    },
  ],
};
