# Tournament Entry System

A complete tournament entry system with Stripe payment integration, based on the proven batts-booking-buddy architecture.

## Features

- **Complete Tournament Entry Form** with all required fields
- **Stripe Payment Integration** for secure online payments
- **Google Sheets Integration** for data storage
- **Email Confirmations** sent automatically after payment
- **Duplicate Prevention** based on email addresses
- **Mobile Responsive** design

## Architecture

- **Frontend**: Static HTML/CSS/JS with responsive design
- **Backend**: Netlify serverless functions
- **Payment**: Stripe Checkout integration
- **Data Storage**: Google Sheets via Google Apps Script
- **Deployment**: Netlify hosting

## Files Structure

```
tournament-entry-3/
├── index.html                          # Main tournament entry form
├── styles.css                          # Styling
├── js/
│   └── secure-api.js                   # Client-side API for Netlify functions
├── netlify/
│   └── functions/
│       ├── create-checkout-session.js  # Creates Stripe checkout sessions
│       └── stripe-webhook.js           # Processes successful payments
├── google-apps-script.js               # For Google Sheets integration (Netlify)
├── google-apps-script.gs               # For direct form submissions
├── package.json                        # Dependencies
└── netlify.toml                        # Netlify configuration
```

## Setup Instructions

### 1. Google Apps Script Setup

1. Create a new Google Sheet for tournament entries
2. Go to Extensions > Apps Script
3. Copy the code from `google-apps-script.js` into the script editor
4. Update the API_KEY with a secure random string
5. Deploy as a web app:
   - Click Deploy > New deployment
   - Select type: Web app
   - Set "Who has access" to "Anyone, even anonymous"
   - Click Deploy
6. Copy the web app URL for Netlify environment variables

### 2. Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your API keys from the Stripe Dashboard
3. Set up a webhook pointing to: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
4. Note the webhook signing secret

### 3. Netlify Setup

1. Deploy this project to Netlify
2. Update `js/secure-api.js` with your Netlify site URL
3. Set up environment variables in Netlify:
   - `STRIPE_P_KEY`: Your Stripe secret key
   - `STRIPE_WEBHOOK_SIGNING`: Your webhook signing secret
   - `GOOGLE_APPS_SCRIPT_URL`: Your Google Apps Script web app URL
   - `GOOGLE_APPS_SCRIPT_API_KEY`: Same API key as in your Google Apps Script
   - `SITE_URL`: Your Netlify site URL

### 4. Testing

1. Use Stripe test cards (e.g., `4242 4242 4242 4242`)
2. Check Netlify function logs for any errors
3. Verify data appears in your Google Sheet
4. Confirm email notifications are sent

## Environment Variables Required

```
STRIPE_P_KEY=sk_test_...
STRIPE_WEBHOOK_SIGNING=whsec_...
GOOGLE_APPS_SCRIPT_URL=https://script.google.com/macros/s/.../exec
GOOGLE_APPS_SCRIPT_API_KEY=your-secure-api-key
SITE_URL=https://your-tournament-site.netlify.app
```

## Payment Flow

1. User fills out tournament entry form
2. Form submission triggers `create-checkout-session` function
3. User redirected to Stripe Checkout
4. After successful payment, Stripe sends webhook
5. `stripe-webhook` function processes payment and sends data to Google Sheets
6. Google Apps Script stores data and sends confirmation email

## Security Features

- Server-side payment processing
- API key authentication for Google Apps Script
- Stripe webhook signature verification
- CORS headers for cross-origin requests
- Duplicate entry prevention

## Customization

- Update tournament details in `index.html`
- Modify pricing in `js/secure-api.js` (currently £34 total)
- Customize email templates in `google-apps-script.js`
- Adjust form fields as needed

## Support

For issues or questions, contact: carl.johnson.batts@gmail.com
