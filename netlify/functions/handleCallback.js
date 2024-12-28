const axios = require('axios');

exports.handler = async function (event, context) {
    const queryParams = event.queryStringParameters;

    // Hämta Authorization Code och State från URL-parametrarna
    const authorizationCode = queryParams.code;
    const state = queryParams.state;

    // Kontrollera om Authorization Code finns
    if (!authorizationCode) {
        console.error('Authorization Code saknas i förfrågan');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Authorization Code saknas i förfrågan' }),
        };
    }

    // Kontrollera om state finns och matchar det vi skickade
    const expectedState = 'myuniquestate123'; // Byt ut mot ditt faktiska state-värde
    if (!state || state !== expectedState) {
        console.error('Ogiltigt eller saknat state-värde');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Ogiltigt eller saknat state-värde' }),
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

        const { access_token, refresh_token } = response.data;

        // Logga Access Token och Refresh Token
        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);

        return {
            statusCode: 200,
            body: JSON.stringify({
                accessToken: access_token,
                refreshToken: refresh_token,
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
