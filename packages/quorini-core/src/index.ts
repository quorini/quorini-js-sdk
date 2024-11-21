// This will allow the React project to configure the values based on their environment variables
interface Config {
    projectId?: string;
    mutations?: any;
}
  
const QClient = (() => {
    let config: Config = {};
    let mode: 'dev' | 'prod' = 'dev'; // Default mode is `dev`

    const privateUrls = {
        dev: {
            apiUrl: "https://nq3o4t9ax0.execute-api.us-west-2.amazonaws.com/development",
            authApiUrl: "https://vlpw2q6zt5.execute-api.us-west-2.amazonaws.com/development",
            apiCustomerUrl: "https://h5ti6dtzyl.execute-api.us-west-2.amazonaws.com/development",
            authApiCustomerUrl: "https://hth72i9z93.execute-api.us-west-2.amazonaws.com/development",
        },
        prod: {
            apiUrl: "https://api.quorini.app",
            authApiUrl: "https://auth.quorini.app",
            apiCustomerUrl: "https://api.quorini.io",
            authApiCustomerUrl: "https://auth.quorini.io",
        }
    };

    return {
        // Public configuration method for React projects to pass their environment variables
        configure(externalConfig: Config, envMode: 'dev' | 'prod' = 'prod') {
            config = { ...externalConfig };
            mode = envMode;
        },
    
        // Retrieve public configuration
        getConfig() {
            return config;
        },
    
        // Internal method to retrieve private values based on mode
        getPrivate(key: keyof typeof privateUrls['dev']) {
            return privateUrls[mode][key];
        },

        // Method to retrieve the current mode (optional, for debugging or logging)
        getMode() {
            return mode;
        },
    };
})();

// Export QClient for use in other parts of the SDK
export { QClient };
  