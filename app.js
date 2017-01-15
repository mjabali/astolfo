var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var request = require('request');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Get Environment Variables
var config = require('./config.js');
console.log("TWILIO_ACCOUNT_SID: " + process.env.TWILIO_ACCOUNT_SID)
console.log("TWILIO_AUTH_TOKEN: " + process.env.TWILIO_AUTH_TOKEN)
console.log("AUTHY_API_KEY: " + process.env.AUTHY_API_KEY)
console.log("-------------------------------------------");

const twilio = require('twilio')(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
const enums = require('authy-client').enums;
const Client = require('authy-client').Client;
const authy = new Client({key: config.AUTHY_API_KEY});

var phone_number = null;
var country_code = null;
var authy_id = null;
var phone_sid = null;
var reuse_number = false;

//Receive OneCode SMS Content to be validated
app.post('/onecode', function (req, res) {
  console.log("Received message: " + req.body.Body);
  var token = req.body.Body.match(/\d/g);
  token = token.join("");
  oneCodeVerify(token);
  res.send('Success!');
})

//Receive Phone Verification SMS Content to be validated
app.post('/verification', function (req, res) {
  console.log("Received message: " + req.body.Body);
  var token = req.body.Body.match(/\d/g);
  token = token.join("");
  phoneVerificationVerify(token);
  res.send('Success!');
})

//Get a Twilio Number and set the SMS Webhook - Get the Phone_Number
function tryPhoneVerification(){
	if(config.phone_verification == true){
		console.log("Running Phone Verification Testing");
			twilio.incomingPhoneNumbers.create({
			SmsUrl: config.pv_sms_url,
			AreaCode: config.area_code,
			FriendlyName: 'PhoneVerificationTestingNumber'
		}, function(err, number){
			if (err == null){
				console.log("New Number Registered is: " + number.phone_number);
				country_code = number.phone_number.substring(0,2);
				phone_number = number.phone_number.substring(2,12);
				phone_sid = number.sid;
				console.log("Country Code: " + country_code);
				console.log("Phone Number: " + phone_number);
				console.log("Phone SID: " + phone_sid);
				console.log("Twilio Phone Number has been set to send callback to: " + number.sms_url);
				if(config.onecode == true){
					reuse_number = true;	
				}
				//Call Authy Phone Verification 
				phoneVerificationRequest(country_code, phone_number);
			}else{
				console.log("ERROR: " + err.message);
			}	
		});
	}else{
		tryOneCode();
	}
}

function tryOneCode(){
	if(config.onecode == true){
		console.log("Running Authy OneCode Testing");
		if(reuse_number == false){
			console.log("Getting a New Twilio Number");
			twilio.incomingPhoneNumbers.create({
			SmsUrl: config.oc_sms_url,
			AreaCode: config.area_code,
			FriendlyName: 'OneCodeTestingNumber'
		}, function(err, number){
				if (err == null){
					console.log("New Number Registered is: " + number.phone_number);
					country_code = number.phone_number.substring(0,2);
					phone_number = number.phone_number.substring(2,12);
					phone_sid = number.sid;
					console.log("Country Code: " + country_code);
					console.log("Phone Number: " + phone_number);
					console.log("Phone SID: " + phone_sid);
					//Call Authy User Registration
					registerUser(country_code, phone_number);
				}else{
					console.log("ERROR: " + err.message);
				}
			});
		}else{
			console.log("Updating Existing Number to OneCode Webhook");
			twilio.incomingPhoneNumbers(phone_sid).update({
				SmsUrl: config.oc_sms_url
			}, function(err, number){
				if(err) throw err;
				console.log("Updated existing number to send callback to: " + number.sms_url);
			});
			//Call Authy User Registration
			console.log("Reusing Existing Twilio Number");
			registerUser(country_code, phone_number);
		}
	}
}
 
 //Remove Twilio Number
 function removeTwilioNumber(){
 	if(reuse_number == false){
	 	twilio.incomingPhoneNumbers(phone_sid).delete(function(err){
	 		if (err) throw err;
	 		console.log("Twilio Phone Number Released");
	 	});
 	}
}

 //Register the user with Authy - Get the Authy_ID
 function registerUser(country_code, phone_number){
 	reuse_number = false;
 	authy.registerUser({
 		countryCode: 'US',
		email: 'test@test.com',
		phone: phone_number
	}, function (err, registration) {
		if (err) throw err;

		authy_id = registration.user.id;
		console.log("Authy User Registered: " + authy_id);
		//Call Authy OneCode API
		oneCodeRequest(authy_id);
	});	
 }
 
 //Remove Authy User
 function removeUser(){
 	authy.deleteUser({ authyId: authy_id }, function(err, res) {
 		if (err) throw err;
 		console.log('User has been scheduled for deletion');
 	});
 }

//Trigger OneCode Request
function oneCodeRequest(authyID){
	authy.requestSms({ authyId: authyID }, function(err, res) {
  		if (err) throw err;

  		console.log('Message sent successfully to', phone_number);
	});
}

//Validate OneCode Request
function oneCodeVerify(token){
	console.log("Validating token: " + token + " for Authy ID: " + authy_id);
	authy.verifyToken({ authyId: authy_id, token: token }, function(err, res) {
		if (err) throw err;
		console.log('Token is valid');
	});
	removeUser(authy_id);
	if(config.remove_number == true){
		removeTwilioNumber();	
	}
}

//Trigger Phone Verification
function phoneVerificationRequest(country_code, phone_number){
	console.log("Starting Phone Verification for: " + phone_number);
	var options = {
		url: 'https://api.authy.com/protected/json/phones/verification/start',
		method: 'POST',
		form: {'api_key':config.AUTHY_API_KEY,'country_code':country_code,'phone_number':phone_number,'via':'sms'}
	}
	request(options, function(error, response, body){
		if(!error && response.statusCode == 200){
			console.log("Phone Information: " + body);
		}else{
			console.log("ERROR: " + error);
		}
	})
}

//Validate Phone Verification Request
function phoneVerificationVerify(token){
	authy.verifyPhone({ 
		countryCode: 'US', 
		phone: phone_number, 
		token: token }, function(err, res) {
			if (err) throw err;
			console.log('Verification code is valid');
		});
	if(config.remove_number == true){
		removeTwilioNumber();	
	}
	tryOneCode();
}

tryPhoneVerification();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
