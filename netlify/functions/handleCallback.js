const axios = require('axios');

exports.handler = async function (event, context) {
    console.log('handleCallback.js körs...'); // Kontrollera att funktionen körs

    // Hämta query parameters från URL
    const queryParams = event.queryStringParameters;
    console.log('Query parameters mottagna:', queryParams);

    const authorizationCode = queryParams?.code;
    const state = queryParams?.state;

    // Kontrollera om Authorization Code finns
    if (!authorizationCode) {
        console.log('Authorization Code saknas!');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Authorization Code saknas i förfrågan' }),
        };
    }

    // Kontrollera om state finns och matchar
    const expectedState = 'myuniquestate123'; // Detta måste matcha det du skickar i din OAuth-URL
    if (!state || state !== expectedState) {
        console.log('State saknas eller matchar inte!', { state, expectedState });
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Ogiltigt eller saknat state-värde' }),
        };
    }

    console.log('Authorization Code mottagen:', authorizationCode);
    console.log('State mottaget och verifierat:', state);

    try {
        // Byt Authorization Code mot Access Token
        console.log('Skickar förfrågan till Fortnox för att byta Authorization Code mot Access Token...');
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

        const { access_token, refresh_token } = response.data;

        console.log('Access Token mottagen:', access_token);
        console.log('Refresh Token mottagen:', refresh_token);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Token mottagen och sparad!',
                accessToken: access_token,
                refreshToken: refresh_token,
            }),
        };
    } catch (error) {
        console.error('Fel vid tokenhämtning:', {
            data: error.response?.data,
            status: error.response?.status,
            message: error.message,
        });

        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ error: error.response?.data || error.message }),
        };
    }
};
