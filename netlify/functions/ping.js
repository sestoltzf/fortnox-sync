exports.handler = async function () {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            message: 'Ping successful!',
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        }),
    };
}; 