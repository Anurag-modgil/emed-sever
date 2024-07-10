const Razorpay = require("razorpay");

let apiKey = "rzp_test_nIN8FXgvfHAhT1";
let apiSecret = "47P6X401ZyS7OQR2MuGZ0ffw";

const razorpay = new Razorpay({
  key_id: apiKey,
  key_secret: apiSecret,
});

module.exports = razorpay;