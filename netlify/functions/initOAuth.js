const axios = require('axios');

exports.handler = async function (event, context) {
    console.log('initOAuth.js körs...');

    const clientId = process.env.FORTNOX_CLIENT_ID;
    const redirectUri = process.env.FORTNOX_REDIRECT_URI;
    const state = 'myuniquestate123'; // This should match what's expected in handleCallback.js

    if (!clientId || !redirectUri) {
        console.error('Miljövariabler saknas!');
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                error: 'Miljövariabler saknas. Kontrollera FORTNOX_CLIENT_ID och FORTNOX_REDIRECT_URI.' 
            }),
        };
    }

    // Log the configuration for debugging
    console.log('OAuth Configuration:');
    console.log('  Client ID:', clientId);
    console.log('  Redirect URI:', redirectUri);
    console.log('  State:', state);

    // Construct the OAuth authorization URL
    const authUrl = new URL('https://apps.fortnox.se/oauth-v1/authorize');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('scope', 'invoice'); // Adjust scope as needed

    console.log('Authorization URL:', authUrl.toString());

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
        body: JSON.stringify({
            message: 'OAuth URL genererad',
            authUrl: authUrl.toString(),
            redirectUri: redirectUri,
            state: state
        }),
    };
}; 