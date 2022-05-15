exports.adminPage = (req, res) => {
  let role = req.user.role;
  res.render('admin', {
    pageTitle: 'admin',
    path: '/admin',
    isAdmin: role,
  });
};
