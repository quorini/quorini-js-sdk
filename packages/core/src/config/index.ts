// This will allow the React project to configure the values based on their environment variables
interface Config {
    projectId: string,
    env?: 'production' | 'development',
    gqlPaths?: {
        queries: Record<string, string>,
        mutations: Record<string, string>,
    },
}
  
const QClient = (() => {
    let config = {} as Config;

    const privateProdUrls = {
        apiUrl: "https://api.quorini.io",
        authApiUrl: "https://auth.quorini.io",
    };

    /**
     * privateDevUrls should be used in SDK developing or testing. 
     */
    
    // const privateDevUrls = {
    //     apiUrl: "https://h5ti6dtzyl.execute-api.us-west-2.amazonaws.com/development",
    //     authApiUrl: "https://hth72i9z93.execute-api.us-west-2.amazonaws.com/development",
    // };
    

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
            // return privateDevUrls; // When enable privateDevUrls, this code line should be enabled as well.
        },
    };
})();

// Export QClient for use in other parts of the SDK
export { QClient };
  