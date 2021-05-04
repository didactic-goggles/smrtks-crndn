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
      'Authorization': 'Basic SU5URUdSQVRJT05fVVNFUjpJTlRFR1JBVElPTl9VU0VSXzIwMjEq'
    }
  }
  const permsFormCrndn = await axios.get(
    `https://fa-ergd-test-saasfaprod1.fa.ocs.oraclecloud.com:443/crmRestApi/resources/11.13.18.05/Permission_c?q=PermissionValue_c IN ('05555657676','gnfg')`, config
  );
  const permissions = permsFormCrndn.data;
  res.status(200).json({
    status: 'success',
    data: permissions,
  });
});
