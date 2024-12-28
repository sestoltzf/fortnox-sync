const axios = require('axios');

exports.handler = async function () {
    const accessToken = process.env.FORTNOX_ACCESS_TOKEN;

    if (!accessToken) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Access Token saknas. Starta OAuth-processen först.' }),
        };
    }

    try {
        const response = await axios.get('https://api.fortnox.se/3/invoices', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: 'application/json',
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        console.error('Fel vid hämtning av fakturor:', error.response?.data || error.message);

        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ error: error.response?.data || error.message }),
        };
    }
};
