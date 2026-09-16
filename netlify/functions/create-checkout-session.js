const stripe = require('stripe')(process.env.Stripe_P_key);
const axios = require('axios');

exports.handler = async (event) => {
  // Set CORS headers for all responses
  const headers = {
    'Access-Control-Allow-Origin': '*', // Allow all origins
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return { 
        statusCode: 405, 
        headers,
        body: 'Method Not Allowed' 
      };
    }

    // Parse the request body
    const data = JSON.parse(event.body);
    
    // Validate required fields
    if (!data.totalPrice) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }
    // TOURNAMENT-ENTRY-3: Keep test pricing enabled while using the NEW Stripe Sandbox account.
    const TEST_MODE = true;
    const CORRECT_PRICE = TEST_MODE ? 0.50 : 34.00;
    const amount = Math.round(CORRECT_PRICE * 100);

    // Create a Stripe checkout session for tournament entry
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `BATTS Tournament Entry - ${data.name || 'Player'}`,
              description: `Tournament entry fee`,
            },
            unit_amount: amount, // Use server-side validated amount
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      // TOURNAMENT-ENTRY-3: Set Site_URL in the NEW Netlify service before enabling checkout.
      success_url: `${process.env.Site_URL}/index.html?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.Site_URL}/index.html?payment_canceled=true`,
      metadata: {
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        gender: data.gender || '',
        tte: data['tte number'] || data.tte || '',
        club: data.club || '',
        county: data.county || '',
        dob: data.dob || '',
        disability: data.disability || '',
        nationalAssociation: data['not tte aff'] || '',
        playerNamePrint: data['player-name-print'] || '',
        undertakingDate: data['undertaking-date'] || '',
        dataProtectionName: data['data-protection-name'] || '',
        dataProtectionDate: data['data-protection-date'] || '',
        guardianName: data['guardian-name'] || '',
        guardianRelation: data['guardian-relation'] || '',
        guardianDate: data['guardian-date'] || '',
        antiDopingName: data['anti-doping-name'] || '',
        antiDopingRelation: data['anti-doping-relation'] || '',
        antiDopingDate: data['anti-doping-date'] || ''
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ sessionId: session.id })
    };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return {
      statusCode: 500,
      headers, // Add CORS headers to error response
      body: JSON.stringify({ error: error.message })
    };
  }
};
