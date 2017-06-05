module.exports = {
    TWILIO_ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    TWILIO_PHONE_SID: process.env.TWILIO_PHONE_SID,
    AUTHY_API_KEY: process.env.AUTHY_API_KEY,
    phone_verification: false,
    pv_sms_url: 'https://3d5c6c17.ngrok.io/verification',
    onecode: true,
    oc_sms_url: 'https://3d5c6c17.ngrok.io/onecode',
    polling: false,
    useExistingNumber: true,
    area_code: 619,
    remove_number: false,
    log_level: "debug",
    log_filename: "./authy-tests.log",
    runOnStartup: true
};
