# Authy OneCode and Phone Verification Automated Testing Framework

This is a simple framework for you to test [Authy OneCode](https://www.twilio.com/docs/api/authy/authy-totp) and/or [Authy Phone Verification](https://www.twilio.com/docs/api/authy/authy-phone-verification-api) in an automated fashion.

## Quickstart

### Create a Twilio account

Create a free [Twilio account](https://www.twilio.com/try-twilio)

Take note of your Account SID and Auth Token

### Create a new Authy application
Create a new Authy application [here](https://www.twilio.com/console/authy/applications)

Take note of your Production API Key available under Settings

## Setup the environment

This example assumes you already have [Node.js](https://nodejs.org) already installed on your machine.

This project is built using the [Express](http://expressjs.com/) web framework.

1. First clone this repository and then `cd` into it.

   ```bash
   $ git clone https://github.com/mjabali/astolfo.git
   $ cd astolfo
   ```

1. Install the dependencies.

   ```bash
   $ npm install
   ```

1. Export the required environment variable (TWILIO\_ACCOUNT\_SID, TWILIO\_AUTH\_TOKEN and AUTHY\_API\_KEY).

   You can find your AUTHY API KEY for Production at https://dashboard.authy.com/.

   ```bash
   $ export TWILIO_ACCOUNT_SID=Your Twilio Account SID
   $ export TWILIO_AUTH_TOKEN=Your Twilio Auth Token
   $ export AUTHY_API_KEY=Your Authy API Key

   ```
   If you are using a non-UNIX operating system, make sure that the TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN and AUTHY_API_KEY are loaded into your environment.

1. Open the config.js file and update the following arguments accordinly:
    
    #### Arguments
1. `phone_verification` _(boolean)_: Set it to true if you want to perform Authy Phone Verification tests.
1. `pv_sms_url` _(string)_: The URL for the Phone Verification SMS Webhook. This is used by the framework to receive the SMS payload for verification.
1. `onecode` _(boolean)_: Set it to true if you want to perform Authy OneCode tests.
1. `oc_sms_url` _(string)_: The URL for the OneCode SMS Webhook. This is used by the framework to receive the SMS payload for verification.
1. `aread_code` _(number)_: The desired area code for the Twilio Number to be created.
1. `remove_number` _(boolean)_: Set it to true if you want to remove the Twilio Number after the tests.


1. Run the server.

   ```bash
   $ npm start
   ```

That's it! The tests should be performed automatically according to the provided arguments above.

## Meta

* No warranty expressed or implied. Software is as is.