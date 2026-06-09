const authConfig = {
  providers: [
    {
      domain: process.env.VITE_CONVEX_SITE_URL,
      applicationID: "convex"
    }
  ]
};

export default authConfig;
