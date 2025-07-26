const axios = require('axios');

exports.handler = async function (event, context) {
    console.log('generateAccessToken.js körs...');

    const clientId = process.env.FORTNOX_CLIENT_ID;
    const clientSecret = process.env.FORTNOX_CLIENT_SECRET;

    console.log('Checking environment variables...');
    console.log('FORTNOX_CLIENT_ID:', clientId ? 'Set' : 'Missing');
    console.log('FORTNOX_CLIENT_SECRET:', clientSecret ? 'Set' : 'Missing');

    if (!clientId || !clientSecret) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ 
                error: 'Miljövariabler saknas',
                message: 'Kontrollera att FORTNOX_CLIENT_ID och FORTNOX_CLIENT_SECRET är satta.',
                required: ['FORTNOX_CLIENT_ID', 'FORTNOX_CLIENT_SECRET'],
                debug: {
                    clientId: clientId ? 'Set' : 'Missing',
                    clientSecret: clientSecret ? 'Set' : 'Missing'
                }
            }),
        };
    }

    try {
        console.log('Genererar Access Token...');
        console.log('Client ID:', clientId);
        console.log('Client Secret:', clientSecret);

        // For private integrations, you need to call Fortnox's token generation endpoint
        // This is different from OAuth - it's a direct API call
        const response = await axios.post('https://api.fortnox.se/3/access-token', {
            // The exact payload depends on Fortnox's API documentation
            // This might need to be adjusted based on their requirements
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Client-Secret': clientSecret,
                'Accept': 'application/json',
            },
        });

        const { access_token } = response.data;

        console.log('Access Token genererad framgångsrikt');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true,
                message: 'Access Token genererad framgångsrikt!',
                accessToken: access_token,
                note: 'Kopiera denna token och sätt den som FORTNOX_ACCESS_TOKEN i dina miljövariabler.'
            }),
        };
    } catch (error) {
        console.error('Fel vid generering av Access Token:', error.response?.data || error.message);
        
        return {
            statusCode: error.response?.status || 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ 
                error: 'Kunde inte generera Access Token',
                details: error.response?.data || error.message,
                status: error.response?.status,
                note: 'Kontrollera Fortnox API-dokumentation för rätt endpoint och payload.'
            }),
        };
    }
}; 