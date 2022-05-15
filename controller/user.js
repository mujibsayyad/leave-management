exports.homePage = (req, res) => {
  console.log(req.user.role);
  console.log(req.session.role);

  res.render('index', {
    pageTitle: 'Home',
    path: '/',
    id: req.user.name,
  });
};

exports.profile = (req, res) => {
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
