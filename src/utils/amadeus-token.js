import axios from "axios";

export const getAmadeusToken = async () => {
    try {
        const clientId = process.env.AMADEUS_CLIENT_ID;
        const clientSecret = process.env.AMADEUS_CLIENT_SECRET;
        
        // Ensure required environment variables are set
        if (!clientId || !clientSecret) {
            throw new Error("Amadeus Client ID or Secret is not set in environment variables.");
        }

        // Define the request payload
        const payload = new URLSearchParams();
        payload.append("grant_type", "client_credentials");
        payload.append("client_id", clientId);
        payload.append("client_secret", clientSecret);

        // Make the POST request to the Amadeus authentication endpoint
        const response = await axios.post(
            "https://test.api.amadeus.com/v1/security/oauth2/token",
            payload,
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const { access_token, expires_in } = response.data;

        console.log("Access token retrieved:", access_token);
        console.log(`Token expires in ${expires_in} seconds.`);

        return access_token; // Return the token for further use
    } catch (error) {
        // Log detailed error information
        const errorMessage = error.response?.data || error.message;
        console.error("Error retrieving Amadeus token:", errorMessage);

        // Optionally, throw a specific error for easier handling upstream
        throw new Error("Failed to authenticate with Amadeus API.");
    }
};
