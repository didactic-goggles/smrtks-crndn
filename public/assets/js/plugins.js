$.fn.select2.defaults.set('theme', 'bootstrap5');
$.fn.select2.defaults.set('width', '100%');
$.fn.select2.defaults.set('selectionCssClass', ':all:');

$.extend(true, $.fn.dataTable.defaults, {
  dom:
    "<'table-responsive'tr>" +
    "<'row'" +
    "<'col-sm-12 col-md-5 d-flex align-items-center justify-content-center justify-content-md-start'li>" +
    "<'col-sm-12 col-md-7 d-flex align-items-center justify-content-center justify-content-md-end'p>" +
    '>',

  renderer: 'bootstrap',
});

/* Default class modification */
$.extend($.fn.dataTable.ext.classes, {
  sWrapper: 'dataTables_wrapper dt-bootstrap4',
  sFilterInput: 'form-control form-control-sm form-control-solid',
  sLengthSelect: 'form-select form-select-sm form-select-solid',
  sProcessing: 'dataTables_processing card',
  sPageButton: 'paginate_button page-item',
});

const addHeadersToTable = (table, columns) => {
  const thead = document.createElement('thead');
  const tr = document.createElement('tr');
  tr.classList.add('fw-bold', 'fs-6', 'text-gray-800');
  columns.forEach((column) => {
    const th = document.createElement('th');
    th.textContent = column.header;
    th.style.whiteSpace = 'nowrap';
    // if (column.classList) {
    //   th.classList.add(...column.classList);
    // } else th.classList.add('min-w-125px');
    if (column.widthSet !== false) th.classList.add('min-w-125px');
    tr.append(th);
  });
  thead.append(tr);
  table.append(thead);
};

const showError = (message) => {
  toastr['error'](message);

  toastr.options = {
    closeButton: false,
    debug: false,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '5000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
  };
};

const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};
