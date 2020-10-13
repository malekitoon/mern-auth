exports.signup = (req, res) => {
  console.log('REQ BODY ON SIGN UP', req.body);
  
  res.json({
    data: 'You hit sign up endpoint!',
  });
};