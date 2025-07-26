exports.handler = async function () {
    console.log('debugEnv.js körs...');
    
    // Get all environment variables
    const allEnvVars = Object.keys(process.env);
    const fortnoxVars = allEnvVars.filter(key => key.includes('FORTNOX'));
    
    console.log('All environment variables:', allEnvVars.length);
    console.log('Fortnox variables:', fortnoxVars);
    
    // Check specific variables
    const clientId = process.env.FORTNOX_CLIENT_ID;
    const clientSecret = process.env.FORTNOX_CLIENT_SECRET;
    const redirectUri = process.env.FORTNOX_REDIRECT_URI;
    
    console.log('FORTNOX_CLIENT_ID:', clientId ? 'Set' : 'Missing');
    console.log('FORTNOX_CLIENT_SECRET:', clientSecret ? 'Set' : 'Missing');
    console.log('FORTNOX_REDIRECT_URI:', redirectUri ? 'Set' : 'Missing');

    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
            message: 'Environment variables debug',
            totalEnvVars: allEnvVars.length,
            fortnoxVars: fortnoxVars,
            clientId: clientId ? 'Set' : 'Missing',
            clientSecret: clientSecret ? 'Set' : 'Missing',
            redirectUri: redirectUri ? 'Set' : 'Missing',
            allEnvVars: allEnvVars.slice(0, 20) // Show first 20 for debugging
        }),
    };
}; 