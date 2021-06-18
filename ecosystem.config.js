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
        bucket: "sportyeah-test",
      },
      env_test: {
        NODE_ENV: "test",
        bucket: "sportyeah-test",
      },
      env_production_sportyeah: {
        NODE_ENV: "production",
        app: "sportyeah",
        bucket: "sportyeah",
      },

      env_production_kecuki: {
        NODE_ENV: "production",
        app: "kecuki",
        bucket: "kecuki",
      },
      env_test_sportyeah: {
        NODE_ENV: "test",
        app: "sportyeah",
        bucket: "sportyeah-test",
      },

      env_test_kecuki: {
        NODE_ENV: "production",
        app: "kecuki",
        bucket: "kecuki-test",
      },
    },
  ],
};
