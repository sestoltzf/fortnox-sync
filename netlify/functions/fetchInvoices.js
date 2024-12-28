const axios = require('axios');

exports.handler = async function (event, context) {
    try {
        const response = await axios.get('https://api.fortnox.se/3/invoices', {
            headers: {
                Authorization: `Bearer YOUR_ACCESS_TOKEN`,
                Accept: 'application/json',
            },
        });

        return {
            statusCode: 200,
            body: JSON.stringify(response.data),
        };
    } catch (error) {
        return {
            statusCode: error.response.status || 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
