exports.profile = (req, res) => {
  //   console.log(req.user.name);

  res.render('profile', {
    pageTitle: 'Profile',
    path: '/path',
    username: req.user.name,
    email: req.user.email,
  });
};

exports.form = (req, res) => {
  res.render('leaveForm', {
    pageTitle: 'leaveForm',
    path: '/leave',
  });
};
