const axios = require('axios');

exports.handler = async function () {
    const clientId = process.env.FORTNOX_CLIENT_ID;
    const clientSecret = process.env.FORTNOX_CLIENT_SECRET;
    const refreshToken = process.env.FORTNOX_REFRESH_TOKEN;

    if (!refreshToken) {
        console.error('Refresh Token saknas. Starta OAuth-processen först.');
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Refresh Token saknas. Starta OAuth-processen först.' }),
        };
    }

    console.log('Startar förnyelse av Access Token');

    try {
        const response = await axios.post(
            'https://apps.fortnox.se/oauth-v1/token',
            new URLSearchParams({
                grant_type: 'refresh_token',
                client_id: clientId,
                client_secret: clientSecret,
                refresh_token: refreshToken,
            }).toString(),
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        const { access_token, refresh_token } = response.data;

        console.log('Ny Access Token:', access_token);
        console.log('Ny Refresh Token:', refresh_token);

        return {
            statusCode: 200,
            body: JSON.stringify({ accessToken: access_token, refreshToken: refresh_token }),
        };
    } catch (error) {
        console.error('Fel vid förnyelse av Access Token:', error.response?.data || error.message);

        return {
            statusCode: error.response?.status || 500,
            body: JSON.stringify({ error: error.response?.data || error.message }),
        };
    }
};
