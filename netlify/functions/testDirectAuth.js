const axios = require('axios');

exports.handler = async function () {
    console.log('testDirectAuth.js körs...');

    const clientId = process.env.FORTNOX_CLIENT_ID;
    const clientSecret = process.env.FORTNOX_CLIENT_SECRET;

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
                required: ['FORTNOX_CLIENT_ID', 'FORTNOX_CLIENT_SECRET']
            }),
        };
    }

    try {
        console.log('Testing direct authentication...');
        console.log('Client ID:', clientId);
        console.log('Client Secret:', clientSecret);

        // Try to access a simple endpoint using Client ID and Secret
        const response = await axios.get('https://api.fortnox.se/3/settings/company', {
            headers: {
                'Client-Secret': clientSecret,
                'Accept': 'application/json',
            },
        });

        console.log('Direct authentication successful!');

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true,
                message: 'Direct authentication successful!',
                companyInfo: response.data,
                note: 'Your Client ID and Secret are working correctly. You can use this method for API calls.'
            }),
        };
    } catch (error) {
        console.error('Direct authentication failed:', error.response?.data || error.message);
        
        return {
            statusCode: error.response?.status || 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ 
                error: 'Direct authentication failed',
                details: error.response?.data || error.message,
                status: error.response?.status,
                note: 'This suggests you might need an Access Token. Contact Fortnox support for guidance.'
            }),
        };
    }
}; 