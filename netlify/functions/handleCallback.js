const axios = require('axios');

exports.handler = async function (event, context) {
    const queryParams = event.queryStringParameters;

    // Hämta Authorization Code och State från URL-parametrarna
    const authorizationCode = queryParams.code;
    const state = queryParams.state;

    // Kontrollera om Authorization Code finns
    if (!authorizationCode) {
        return {
            statusCode: 400,
            body: 'Authorization Code saknas i förfrågan',
        };
    }

    // Kontrollera om state finns och matchar det vi skickade
    if (!state || state !== 'myuniquestate123') { // Byt ut 'myuniquestate123' till ditt faktiska state-värde
        return {
            statusCode: 400,
            body: 'Ogiltigt eller saknat state-värde',
        };
    }

    console.log('Authorization Code mottagen:', authorizationCode);

    try {
        // Byt Authorization Code mot Access Token
        const response = await axios.post(
            'https://apps.fortnox.se/oauth-v1/token',
            new URLSearchParams({
                grant_type: 'authorization_code',
                code: authorizationCode,
                client_id: process.env.FORTNOX_CLIENT_ID,
                client_secret: process.env.FORTNOX_CLIENT_SECRET,
                redirect_uri: process.env.FORTNOX_REDIRECT_URI,
            }).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        // Logga Access Token och Refresh Token
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
