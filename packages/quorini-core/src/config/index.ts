// This will allow the React project to configure the values based on their environment variables
interface Config<T> {
    projectId: string,
    env?: 'production' | 'development',
    signupInputType: T,
}
  
const QClient = (() => {
    let config = {} as Config<any>;

    const privateDevUrls = {
        apiUrl: "https://h5ti6dtzyl.execute-api.us-west-2.amazonaws.com/development",
        authApiUrl: "https://hth72i9z93.execute-api.us-west-2.amazonaws.com/development",
    };

    const privateProdUrls = {
        apiUrl: "https://api.quorini.io",
        authApiUrl: "https://auth.quorini.io",
    }

    return {
        // Public configuration method for React projects to pass their environment variables
        configure(externalConfig: Config<any>) {
            config = { ...externalConfig };
        },
    
        // Retrieve public configuration
        getConfig() {
            return config;
        },
    
        // Internal method to retrieve private values based on mode
        getPrivate() {
            let privateUrls = privateProdUrls;
            if (config.env && config.env === 'development') {
                privateUrls = privateDevUrls;
            }
            return privateUrls;
        },
    };
})();

// Export QClient for use in other parts of the SDK
export { QClient };
  