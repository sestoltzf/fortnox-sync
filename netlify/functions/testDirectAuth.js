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

        // Try different authentication methods
        console.log('Trying different authentication methods...');
        
        // Method 1: Try with Client-Secret only
        try {
            console.log('Method 1: Client-Secret only');
            const response = await axios.get('https://api.fortnox.se/3/settings/company', {
                headers: {
                    'Client-Secret': clientSecret,
                    'Accept': 'application/json',
                },
            });
            
            console.log('Method 1 successful!');
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({
                    success: true,
                    message: 'Direct authentication successful! (Method 1)',
                    companyInfo: response.data,
                    method: 'Client-Secret only',
                    note: 'Your Client Secret works directly. You can use this method for API calls.'
                }),
            };
        } catch (error1) {
            console.log('Method 1 failed:', error1.response?.data);
            
            // Method 2: Try with both Client-Secret and Client ID
            try {
                console.log('Method 2: Client-Secret + Client ID');
                const response = await axios.get('https://api.fortnox.se/3/settings/company', {
                    headers: {
                        'Client-Secret': clientSecret,
                        'Client-ID': clientId,
                        'Accept': 'application/json',
                    },
                });
                
                console.log('Method 2 successful!');
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    body: JSON.stringify({
                        success: true,
                        message: 'Direct authentication successful! (Method 2)',
                        companyInfo: response.data,
                        method: 'Client-Secret + Client ID',
                        note: 'Your Client Secret and Client ID work together.'
                    }),
                };
            } catch (error2) {
                console.log('Method 2 failed:', error2.response?.data);
                
                // Method 3: Try with Authorization header
                try {
                    console.log('Method 3: Authorization header');
                    const response = await axios.get('https://api.fortnox.se/3/settings/company', {
                        headers: {
                            'Authorization': `Bearer ${clientSecret}`,
                            'Accept': 'application/json',
                        },
                    });
                    
                    console.log('Method 3 successful!');
                    return {
                        statusCode: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*',
                        },
                        body: JSON.stringify({
                            success: true,
                            message: 'Direct authentication successful! (Method 3)',
                            companyInfo: response.data,
                            method: 'Authorization Bearer',
                            note: 'Your Client Secret works as a Bearer token.'
                        }),
                    };
                } catch (error3) {
                    console.log('Method 3 failed:', error3.response?.data);
                    
                    // All methods failed
                    throw error1; // Return the first error
                }
            }
        }
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