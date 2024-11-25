// This will allow the React project to configure the values based on their environment variables
interface Config {
    projectId?: string;
    mutations?: any;
}
  
const QClient = (() => {
    let config: Config = {};
    let mode: 'dev' | 'prod' = 'dev'; // Default mode is `dev`
    
    // here we work only with customer url

    // it should be same style as frontend, you can check in PR
    // ${process.env.REACT_APP_CUSTOMER_AUTH_API}/${ctx.projectId}/log-in${ctx.gqlSimulator.env !== "production" ? `?env=${ctx.gqlSimulator.env}` : ""}

    const privateUrls = {
        dev: {
            apiUrl: "https://h5ti6dtzyl.execute-api.us-west-2.amazonaws.com/",
            authApiUrl: "https://hth72i9z93.execute-api.us-west-2.amazonaws.com/development",
        },
        prod: {
            apiUrl: "https://api.quorini.io" + {config.projectId} ,
            authApiUrl: "https://auth.quorini.io"  + {config.projectId},
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
  