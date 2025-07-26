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

        // Try different possible endpoints for Access Token generation
        // Based on the API documentation, we might need to use a different approach
        
        console.log('Attempting to generate Access Token...');
        
        // Option 1: Try the integration developer endpoint
        try {
            const response = await axios.post('https://api.fortnox.se/api/integration-developer/access-token', {
                clientId: clientId,
                clientSecret: clientSecret
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            
            const { access_token } = response.data;
            console.log('Access Token generated via integration-developer endpoint');
            
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
            console.log('Integration developer endpoint failed, trying alternative...');
            
            // Option 2: Try direct API call with client credentials
            const response = await axios.post('https://api.fortnox.se/3/auth/token', {
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });
            
            const { access_token } = response.data;
            console.log('Access Token generated via auth/token endpoint');
            
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
        }

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