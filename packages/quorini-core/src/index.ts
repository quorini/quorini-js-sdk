// This will allow the React project to configure the values based on their environment variables
interface Config {
    apiUrl?: string;
    authApiUrl?: string;
    apiCustomerUrl?: string;
    authApiCustomerUrl?: string;
}
  
// QClient is the object that other parts of the SDK or React app will use
const QClient = {
    config: {} as Config,  // This will hold the configuration values provided by the React project

    // This method will allow the React project to pass their environment variables to QClient
    configure(config: Config) {
        this.config = { ...config };  // Save the configuration passed from the React project
    },

    // Retrieve the configured values
    getConfig() {
        return this.config;
    }
};

// Export QClient for use in other parts of the SDK
export { QClient };
  