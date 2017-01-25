# Authy OneCode and Phone Verification Automated Testing Framework

This is a simple framework for you to test [Authy OneCode](https://www.twilio.com/docs/api/authy/authy-totp) and/or [Authy Phone Verification](https://www.twilio.com/docs/api/authy/authy-phone-verification-api) in an automated fashion.

The following tasks are performed during the execution of the tests:
* A new [Twilio Number](https://www.twilio.com/phone-numbers) is acquired or reused depending on your settings for the framework.
* A Webhook URL is set up for the Twilio Phone Number to forward the SMS messages generated by Authy OneCode and/or Phone Verification. You can also set the framework to poll for SMS messages on your Twilio Phone Number.
* The Authy Phone Verification API is called and a SMS message delivered to the Twilio Number
* The Twilio Number forwards the message to the configured Webhook URL or the framework will poll for new SMS messages
* The framework receives that information and calls the Authy Phone Verification API to verify the code.
* The framework reports if the code is valid or not
* The Twilio Phone Number is registered against the Authy application
* The Twilio Phone Number Webhook URL is updated to reflect the new testing against the Authy OneCode API. You can also set the framework to poll for SMS messages on your Twilio Phone Number.
* The Authy OneCode API is called and a SMS message delivered to the Twilio Number
* The Twilio Number forwards the message to the configured Webhook URL or the framework will polls for new SMS messages 
* The framework receives that information and calls the Authy TOTP API to verify the code
* The framework reports if the code is valid or not
* The Twilio Number is released or not depending on the your configuration. Please see the list of Arguments below. 

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

1. Export the required environment variable (TWILIO\_ACCOUNT\_SID, TWILIO\_AUTH\_TOKEN, TWILIO\_PHONE\_SID (required if you want to use an existing Twilio Number) and AUTHY\_API\_KEY).

   ```bash
   $ export TWILIO_ACCOUNT_SID=Your Twilio Account SID
   $ export TWILIO_AUTH_TOKEN=Your Twilio Auth Token
   $ export TWILIO_PHONE_SID=Your Twilio Number SID
   $ export AUTHY_API_KEY=Your Authy API Key

   ```
   If you are using a non-UNIX operating system, make sure that the TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_SID and AUTHY_API_KEY are loaded into your environment.

1. Open the config.js file and update the following arguments accordinly:
    
#### Arguments
* `phone_verification` _(boolean)_: Set it to true if you want to perform Authy Phone Verification tests.
* `pv_sms_url` _(string)_: The URL for the Phone Verification SMS Webhook. This is used by the framework to receive the SMS payload for verification. You can use [ngrok](https://ngrok.com/) to create a secure tunnel to your local host. 
* `onecode` _(boolean)_: Set it to true if you want to perform Authy OneCode tests.
* `oc_sms_url` _(string)_: The URL for the OneCode SMS Webhook. This is used by the framework to receive the SMS payload for verification. You can use [ngrok](https://ngrok.com/) to create a secure tunnel to your local host. 
* `polling` _(boolean)_: Set it to true if you want to poll for new SMS messages instead of receiving a callback when a message is delivered to your Twilio Phone Number.
* `useExistingNumber` _(boolean)_: Set it to true if you want to use an existing Twilio Number for testing. Setting this parameter to true requires that you to set the TWILIO_PHONE_SID environment variable.
* `area_code` _(number)_: The desired area code for the Twilio Number to be created.
* `remove_number` _(boolean)_: Set it to true if you want to remove the Twilio Number after the tests.
* `log_level` _(error (0), warn (1), info (2), verbose (3), debug (4), silly (5))_: Log level you want to use for the testing framework.
* `log_filename` _(string)_: The name of the file you want to log testing output messages.
* `runOnStartup` _(boolean)_: Set it to true if you want to run the tests automatically. Otherwise, you will have to send an HTTP POST request to start the tests.

Save the file.

## Run the server
1. Run the server with the following command.

   ```bash
   $ npm start
   ```

## Running the Testing Framework Manually
1. Simply make an HTTP POST call to http://hostname:port/start to run the testing framework.

That's it! The tests should be performed automatically for you.

## Meta

* No warranty expressed or implied. Software is as is.