/**
 * Secure API for Tournament Entry System
 * Handles all server-side communications for secure tournament entry submission
 */

// TOURNAMENT-ENTRY-3:
// Replace this placeholder with the NEW Netlify Functions base URL when supplied.
const API_BASE_URL = 'YOUR_NEW_NETLIFY_FUNCTION_URL';

/**
 * Create a secure tournament entry and Stripe checkout session
 * @param {Object} entryData - Tournament entry information
 * @returns {Promise<Object>} - Stripe session information
 */
async function createSecureTournamentEntry(entryData) {
  try {
    if (API_BASE_URL === 'YOUR_NEW_NETLIFY_FUNCTION_URL') {
      throw new Error('The new Netlify Functions URL has not been configured');
    }

    // Prepare data for checkout - tournament entry has fixed price
    const paymentData = {
      name: entryData.name || 'Not specified',
      email: entryData.email || 'Not specified',
      phone: entryData.phone || 'Not specified',
      gender: entryData.gender || 'Not specified',
      'tte number': entryData['tte number'] || entryData.tte || 'Not specified',
      club: entryData.club || 'Not specified',
      county: entryData.county || 'Not specified',
      dob: entryData.dob || 'Not specified',
      disability: entryData.disability || '',
      'not tte aff': entryData['not tte aff'] || '',
      'player-name-print': entryData['player-name-print'] || '',
      'undertaking-date': entryData['undertaking-date'] || '',
      'data-protection-name': entryData['data-protection-name'] || '',
      'data-protection-date': entryData['data-protection-date'] || '',
      'guardian-name': entryData['guardian-name'] || '',
      'guardian-relation': entryData['guardian-relation'] || '',
      'guardian-date': entryData['guardian-date'] || '',
      'anti-doping-name': entryData['anti-doping-name'] || '',
      'anti-doping-relation': entryData['anti-doping-relation'] || '',
      'anti-doping-date': entryData['anti-doping-date'] || '',
      totalPrice: '34.00' // Fixed tournament entry fee (£33 + £1 booking fee)
    };
    
    // Call the create-checkout-session function
    const response = await fetch(`${API_BASE_URL}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating secure tournament entry:', error);
    throw error;
  }
}

// Export functions for use in other scripts
window.createSecureTournamentEntry = createSecureTournamentEntry;
