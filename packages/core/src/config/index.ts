// This will allow the React project to configure the values based on their environment variables
interface Config {
    projectId: string,
    env?: 'production' | 'development',
    gqlPaths?: {
        queries: Record<string, string>,
        mutations: Record<string, string>,
    }
}
  
const QClient = (() => {
    let config = {} as Config;

    const privateProdUrls = {
        apiUrl: "https://api.quorini.io",
        authApiUrl: "https://auth.quorini.io",
    }

    return {
        // Public configuration method for React projects to pass their environment variables
        configure(externalConfig: Config) {
            config = { ...externalConfig };
        },
    
        // Retrieve public configuration
        getConfig() {
            return config;
        },
    
        // Internal method to retrieve private values based on mode
        getPrivate() {
            return privateProdUrls;
        },
    };
})();

// Export QClient for use in other parts of the SDK
export { QClient };
  