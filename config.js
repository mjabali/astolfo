module.exports = {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    AUTHY_API_KEY: process.env.AUTHY_API_KEY,
    phone_verification: false,
    pv_sms_url: 'http://1d225ad6.ngrok.io/verification',
    onecode: true,
    oc_sms_url: 'http://1d225ad6.ngrok.io/onecode',
    area_code: 619,
    remove_number: true
};