const { default: axios } = require('axios');
const catchAsync = require('../utils/catchAsync');

exports.getLogs = catchAsync(async (req, res) => {
  const logsFormCrndn = await axios.get(
    'https://oracle-crm.corendonairlines.com/crmapi/outputloglist?BookingID=539164'
  );
  const logs = logsFormCrndn.data;
  res.status(200).json({
    status: 'success',
    data: logs,
  });
});

exports.getPermissions = catchAsync(async (req, res) => {
  const config = {
    headers: {
      'REST-Framework-Version': '2',
      Authorization:
        'Basic SU5URUdSQVRJT05fVVNFUjpJTlRFR1JBVElPTl9VU0VSXzIwMjEq',
    },
  };
  const permsFormCrndn = await axios.get(
    `https://fa-ergd-test-saasfaprod1.fa.ocs.oraclecloud.com:443/crmRestApi/resources/11.13.18.05/Permission_c?q=PermissionValue_c IN ('05555657676','gnfg')`,
    config
  );
  const permissions = permsFormCrndn.data;
  res.status(200).json({
    status: 'success',
    data: permissions,
  });
});

exports.createPermision = catchAsync(async (req, res, next) => {
  const config = {
    headers: {
      'REST-Framework-Version': '2',
      Authorization:
        'Basic SU5URUdSQVRJT05fVVNFUjpJTlRFR1JBVElPTl9VU0VSXzIwMjEq',
    },
  };

  // Önce contactı güncelle
  const contactPartyNumber = 6042;
  let newCrndnContactPoint;
  const createdPermission = {};
  if (req.body.email) {
    newCrndnContactPoint = {
      EmailAddress: req.body.email,
      ContactPointType: 'EMAIL',
      EmailPurpose: 'PERSONAL',
    };

    createdPermission.PermissionValue_c = req.body.email;
    createdPermission.Email_c = true;
  } else if (req.body.phoneNumber) {
    newCrndnContactPoint = {
      ContactPointType: 'PHONE',
      PhoneType: 'MOBILE',
      PhoneCountryCode: req.body.countryCode,
      PhoneAreaCode: req.body.areaCode,
      PhoneNumber: req.body.phoneNumber,
    };
    createdPermission.PermissionValue_c = `${req.body.countryCode}${req.body.areaCode}${req.body.phoneNumber}`;
    createdPermission.Call_c = true;
  }
  createdPermission.PermissionChannel_c = 'CC';
  createdPermission.PermissionDate_c = new Date().toISOString();
  const newCrndnContactpoint = await axios.post(
    `https://fa-ergd-test-saasfaprod1.fa.ocs.oraclecloud.com:443/crmRestApi/resources/11.13.18.05/contacts/${contactPartyNumber}/child/ContactPoint`,
    newCrndnContactPoint,
    config
  );
  if (!newCrndnContactpoint) next(new AppError('No permission found with that ID', 404));
  const permsFromCrndn = await axios.post(
    `https://fa-ergd-test-saasfaprod1.fa.ocs.oraclecloud.com:443/crmRestApi/resources/11.13.18.05/Permission_c`,
    createdPermission,
    config
  );
  const permissions = permsFromCrndn.data;
  res.status(200).json({
    status: 'success',
    data: permissions,
  });
});

exports.updatePermision = catchAsync(async (req, res, next) => {
  if (!req.params.permissionId)
    return next(new AppError('No permission found with that ID', 404));
  const config = {
    headers: {
      'REST-Framework-Version': '2',
      Authorization:
        'Basic SU5URUdSQVRJT05fVVNFUjpJTlRFR1JBVElPTl9VU0VSXzIwMjEq',
    },
  };
  const permsFormCrndn = await axios.patch(
    `https://fa-ergd-test-saasfaprod1.fa.ocs.oraclecloud.com:443/crmRestApi/resources/11.13.18.05/Permission_c/${req.params.permissionId}`,
    req.body,
    config
  );
  const permissions = permsFormCrndn.data;
  res.status(200).json({
    status: 'success',
    data: permissions,
  });
});
