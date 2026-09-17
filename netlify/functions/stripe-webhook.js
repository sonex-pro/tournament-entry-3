const stripe = require('stripe')(process.env.STRIPE_P_KEY);
const axios = require('axios');

exports.handler = async (event) => {
  try {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
      return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Verify Stripe webhook signature
    const stripeSignature = event.headers['stripe-signature'];
    let stripeEvent;

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        event.body,
        stripeSignature,
        process.env.STRIPE_WEBHOOK_SIGNING
      );
    } catch (error) {
      console.error('Webhook signature verification failed:', error.message);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Webhook signature verification failed' })
      };
    }

    // Handle the checkout.session.completed event
    if (stripeEvent.type === 'checkout.session.completed') {
      console.log('Webhook received: checkout.session.completed');
      const session = stripeEvent.data.object;

      // Extract metadata from the session for tournament entry
      const metadata = session.metadata;
      
      // Get the actual amount from the Stripe session (in cents, need to convert to pounds)
      const amountPaid = session.amount_total ? (session.amount_total / 100).toFixed(2) : '0.00';

      // Prepare data for Google Apps Script
      const tournamentData = {
        name: metadata.name || '',
        email: metadata.email || '',
        phone: metadata.phone || '',
        gender: metadata.gender || '',
        'tte number': metadata.tte || '',
        club: metadata.club || '',
        county: metadata.county || '',
        dob: metadata.dob || '',
        disability: metadata.disability || '',
        'not tte aff': metadata.nationalAssociation || '',
        'player-name-print': metadata.playerNamePrint || '',
        'undertaking-date': metadata.undertakingDate || '',
        'data-protection-name': metadata.dataProtectionName || '',
        'data-protection-date': metadata.dataProtectionDate || '',
        'guardian-name': metadata.guardianName || '',
        'guardian-relation': metadata.guardianRelation || '',
        'guardian-date': metadata.guardianDate || '',
        'anti-doping-name': metadata.antiDopingName || '',
        'anti-doping-relation': metadata.antiDopingRelation || '',
        'anti-doping-date': metadata.antiDopingDate || '',
        paymentStatus: 'Paid',
        paymentDate: new Date().toISOString(),
        sessionId: session.id,
        // TOURNAMENT-ENTRY-3: Configure this only with the NEW Google Apps Script API key.
        apiKey: process.env.GOOGLE_APPS_SCRIPT_API_KEY
      };

      // Log the tournament data in Netlify logs
      console.log('TOURNAMENT ENTRY DATA:', JSON.stringify({
        name: tournamentData.name,
        email: tournamentData.email,
        gender: tournamentData.gender,
        amount: `£${amountPaid}`,
        paymentStatus: 'Paid'
      }));

      // Send data to Google Apps Script
      try {
        console.log('Sending data to Google Apps Script at URL:', process.env.GOOGLE_APPS_SCRIPT_URL);
        
        const response = await axios.post(process.env.GOOGLE_APPS_SCRIPT_URL, tournamentData);
        console.log('Response from Google Apps Script:', JSON.stringify(response.data));
      } catch (error) {
        console.error('Error sending data to Google Apps Script:', error.message);
        if (error.response) {
          console.error('Response data:', JSON.stringify(error.response.data));
          console.error('Response status:', error.response.status);
        }
        // We don't want to return an error status here as the payment was successful
        // Just log the error and continue
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };
  } catch (error) {
    console.error('Error processing webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
