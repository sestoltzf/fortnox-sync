const axios = require('axios');

exports.handler = async function () {
    const accessToken = process.env.FORTNOX_ACCESS_TOKEN;
    const clientSecret = process.env.FORTNOX_CLIENT_SECRET;

    if (!accessToken || !clientSecret) {
        return {
            statusCode: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ 
                error: 'Miljövariabler saknas',
                message: 'Kontrollera att FORTNOX_ACCESS_TOKEN och FORTNOX_CLIENT_SECRET är satta i Netlify.',
                required: ['FORTNOX_ACCESS_TOKEN', 'FORTNOX_CLIENT_SECRET']
            }),
        };
    }

    try {
        // Test with a simple API call to get company info
        const response = await axios.get('https://api.fortnox.se/3/settings/company', {
            headers: {
                'Access-Token': accessToken,
                'Client-Secret': clientSecret,
                'Accept': 'application/json',
            },
        });

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({
                success: true,
                message: 'API-anslutning fungerar!',
                companyInfo: response.data,
                accessToken: accessToken ? 'Set' : 'Missing',
                clientSecret: clientSecret ? 'Set' : 'Missing'
            }),
        };
    } catch (error) {
        console.error('API Test Error:', error.response?.data || error.message);
        
        return {
            statusCode: error.response?.status || 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify({ 
                error: 'API-anslutning misslyckades',
                details: error.response?.data || error.message,
                status: error.response?.status
            }),
        };
    }
}; 