const axios = require('axios');

exports.handler = async function (event, context) {
    const queryParams = event.queryStringParameters;

    // Hämta Authorization Code från URL-parametern
    const authorizationCode = queryParams.code;

    if (!authorizationCode) {
        return {
            statusCode: 400,
            body: 'Authorization Code saknas i förfrågan',
        };
    }

    console.log('Authorization Code:', authorizationCode);

    try {
        // Byt Authorization Code mot Access Token
        const response = await axios.post('https://apps.fortnox.se/oauth-v1/token', null, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            params: {
                grant_type: 'authorization_code',
                code: authorizationCode,
                client_id: process.env.FORTNOX_CLIENT_ID,
                client_secret: process.env.FORTNOX_CLIENT_SECRET,
                redirect_uri: process.env.FORTNOX_REDIRECT_URI,
            },
        });

        // Logga och returnera Access Token och Refresh Token
        console.log('Access Token:', response.data.access_token);
        console.log('Refresh Token:', response.data.refresh_token);

        return {
            statusCode: 200,
            body: JSON.stringify({
                accessToken: response.data.access_token,
                refreshToken: response.data.refresh_token,
            }),
        };
    } catch (error) {
        console.error('Fel vid tokenhämtning:', error.response?.data || error.message);

        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ error: error.response?.data || error.message }),
        };
    }
};
