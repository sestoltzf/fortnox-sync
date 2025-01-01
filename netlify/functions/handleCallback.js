const axios = require('axios');
require('dotenv').config();

exports.handler = async function (event, context) {
    console.log('handleCallback.js körs...');

    // Hämta query parameters från URL
    const queryParams = event.queryStringParameters;
    console.log('Query parameters mottagna:', queryParams);

    const authorizationCode = queryParams?.code;
    const state = queryParams?.state;

    // Kontrollera om Authorization Code finns
    if (!authorizationCode) {
        console.error('Authorization Code saknas!');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Authorization Code saknas i förfrågan' }),
        };
    }

    // Kontrollera om state finns och matchar
    const expectedState = 'myuniquestate123'; // Detta måste matcha det du skickar i din OAuth-URL
    if (!state || state !== expectedState) {
        console.error('State saknas eller matchar inte!', { state, expectedState });
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Ogiltigt eller saknat state-värde' }),
        };
    }

    console.log('Authorization Code mottagen:', authorizationCode);
    console.log('State mottaget och verifierat:', state);

    // Kontrollera miljövariabler
    console.log('Kontrollerar miljövariabler...');
    console.log('FORTNOX_CLIENT_ID:', process.env.FORTNOX_CLIENT_ID);
    console.log('FORTNOX_CLIENT_SECRET:', process.env.FORTNOX_CLIENT_SECRET);
    console.log('FORTNOX_REDIRECT_URI:', process.env.FORTNOX_REDIRECT_URI);

    if (!process.env.FORTNOX_CLIENT_ID || !process.env.FORTNOX_CLIENT_SECRET || !process.env.FORTNOX_REDIRECT_URI) {
        console.error('Miljövariabler saknas! Kontrollera .env-filen eller Netlify-miljövariabler.');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Miljövariabler saknas. Kontrollera konfigurationen.' }),
        };
    }

    try {
        // Förbered POST-förfrågan till Fortnox
        console.log('Förbereder POST-data...');
        const postData = new URLSearchParams({
            grant_type: 'authorization_code',
            code: authorizationCode,
            client_id: process.env.FORTNOX_CLIENT_ID,
            client_secret: process.env.FORTNOX_CLIENT_SECRET,
            redirect_uri: process.env.FORTNOX_REDIRECT_URI,
        }).toString();

        console.log('POST-data som skickas till Fortnox:');
        console.log('  grant_type: authorization_code');
        console.log('  code:', authorizationCode);
        console.log('  client_id:', process.env.FORTNOX_CLIENT_ID);
        console.log('  client_secret:', process.env.FORTNOX_CLIENT_SECRET);
        console.log('  redirect_uri:', process.env.FORTNOX_REDIRECT_URI);

        // Skicka POST-förfrågan
        const response = await axios.post(
            'https://apps.fortnox.se/oauth-v1/token',
            postData,
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        const { access_token, refresh_token } = response.data;

        console.log('Access Token mottagen:', access_token);
        console.log('Refresh Token mottagen:', refresh_token);

        // Returnera tokens
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Token mottagen och sparad!',
                accessToken: access_token,
                refreshToken: refresh_token,
            }),
        };
    } catch (error) {
        // Fånga och logga fel
        console.error('Fel vid tokenhämtning:', {
            data: error.response?.data,
            status: error.response?.status,
            message: error.message,
        });

        // Logga hela felobjektet för ytterligare insikt
        if (error.toJSON) {
            console.error('Hela felobjektet från Fortnox:', error.toJSON());
        }

        // Returnera felet till klienten
        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ error: error.response?.data || error.message }),
        };
    }
};
