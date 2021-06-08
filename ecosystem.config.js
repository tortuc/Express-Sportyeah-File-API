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
      // env_production_sportyeah: {
      //   NODE_ENV: "production",
      //   app:"sportyeah"

      // },
      // env_production_kecuki: {
      //   NODE_ENV: "production",
      //   app:"kecuki"

      // },
    },
  ],
};
