const Index = (() => {
  let datatableLog;
  const loadingContainer = document.querySelector('#container_loading');

  // MODALS
  const mailModalElem = document.getElementById('mailModal');
  const mailModal = new bootstrap.Modal(mailModalElem);
  const smsModalElem = document.getElementById('smsModal');
  const smsModal = new bootstrap.Modal(smsModalElem);

  const initLogsTable = async () => {
    const logsTable = document.querySelector('#table_logs');
    const logsRequest = await fetch('/logs');
    const logsJSON = await logsRequest.json();
    const logs = logsJSON.data;
    const columns = [
      {
        field: 'id',
        header: 'ID',
      },
      {
        field: 'outType',
        header: 'Type',
      },
      {
        field: 'status',
        header: 'Status',
      },
      {
        field: 'documentType',
        header: 'Document Type',
      },
      {
        field: 'processDateTime',
        header: 'Process Time',
      },
      {
        field: '',
        header: '',
      },
    ];
    addHeadersToTable(logsTable, columns);
    datatableLog = $(logsTable).DataTable({
      data: logs,
      responsive: true,
      columns: [
        ...columns.map((column) => {
          return { data: column.field };
        }),
      ],
      columnDefs: [
        {
          targets: columns.findIndex((c) => c.field === 'processDateTime'),
          type: 'date',
          render: (data) =>
            `${moment(data, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY')}`,
        },
        {
          targets: columns.findIndex((c) => c.field === 'status'),
          render: (data) =>
            `<span class="badge bg-${
              data === 'SUCCESSFULLY' ? 'success' : 'danger'
            } fw-bold rounded-pill py-2 px-3">${
              data === 'SUCCESSFULLY' ? 'Success' : 'Inactive'
            }</span>`,
        },
        {
          targets: -1,
          title: '',
          orderable: false,
          width: '25px',
          render: function (data, type, full, meta) {
            return `<button class="btn btn-link"><i class="bi bi-info-circle"></i></button>`;
          },
        },
      ],
    });
    loadingContainer.classList.add('d-none');

    // last cell event
    $('#table_logs tbody').on('click', 'tr td:last-child', (e) => {
      const cell = e.target;
      const cellData = datatableLog.row(cell.closest('tr')).data();
      console.log(cellData);
      const isEmail = cellData.outType === 'EMAIL';
      const targetModalContainer = isEmail ? mailModalElem : smsModalElem;
      const targetModal = isEmail ? mailModal : smsModal;

      targetModalContainer.querySelector(
        '.modal-title'
      ).innerHTML = `${cellData.id} - Details`;

      if (isEmail) {
      } else {
          // fill sms info list
          [...targetModalContainer.querySelectorAll('.list-info-item')].forEach(smsListItem => {
            const smsInfoFieldType = smsListItem.getAttribute('data-sms-field');
            if (smsListItem.getAttribute('data-sms-mobile-field') === 'true') {
                smsListItem.innerHTML = cellData.outputSmsList[0][smsInfoFieldType];
            } else {
                if (smsInfoFieldType === 'status') {
                    smsListItem.innerHTML = `<span class="badge bg-${
                        cellData[smsInfoFieldType] === 'SUCCESSFULLY' ? 'success' : 'danger'
                      } fw-bold rounded-pill py-2 px-3">${
                        cellData[smsInfoFieldType] === 'SUCCESSFULLY' ? 'Success' : 'Inactive'
                      }</span>`
                } else if(smsInfoFieldType === 'processDateTime') {
                    smsListItem.innerHTML = moment(cellData[smsInfoFieldType], 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY hh:mm:ss');
                } else {
                    smsListItem.innerHTML = cellData[smsInfoFieldType];

                }
            }
          });
          targetModalContainer.querySelector('#smsContent').innerHTML = cellData.outputSmsList[0].message;
      }

      targetModal.show();
      // if(cellData.outType === 'EMAIL') {

      // }
    });
  };
  return {
    init: () => {
      initLogsTable();
    },
  };
})();

$(() => {
  Index.init();
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
