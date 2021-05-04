const catchAsync = require('../utils/catchAsync');

exports.getLogs = catchAsync(async (req, res) => {
  res.status(200).render('logs', {
    title: 'Logs',
  });
});

exports.getPermissions = catchAsync(async (req, res) => {
  res.status(200).render('permissions', {
    title: 'Permissions',
  });
});

exports.get404 = (req, res) => {
  res.status(404).render('error', {
    title: 'Something went wrong'
  });
};