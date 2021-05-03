const { default: axios } = require('axios');
const catchAsync = require('../utils/catchAsync');

exports.getIndex = catchAsync(async (req, res) => {
  // const logsFormCrndn = await axios.get('https://oracle-crm.corendonairlines.com/crmapi/outputloglist?BookingID=539164');
  // const logs = logsFormCrndn.data;
  res.status(200).render('index', {
    title: 'Index',
    // logs
  });
});

exports.getLogs = catchAsync(async (req, res) => {
  const logsFormCrndn = await axios.get('https://oracle-crm.corendonairlines.com/crmapi/outputloglist?BookingID=539164');
  const logs = logsFormCrndn.data;
  res.status(200).json({
    status: 'success',
    data: logs
  });
})

exports.get404 = (req, res) => {
  res.status(404).render('error', {
    title: 'Something went wrong'
  });
};