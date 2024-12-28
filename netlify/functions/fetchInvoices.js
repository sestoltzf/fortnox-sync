const axios = require('axios');

exports.handler = async function () {
    const tokenResponse = await axios.get('https://fortnox-at.netlify.app/.netlify/functions/getAccessToken');
    const accessToken = tokenResponse.data.accessToken;

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
        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
