const Logs = (() => {
  const loadingContainer = document.querySelector('#container_loading');
  const filtersContainer = document.querySelector('.filters');
  // MODALS
  const mailModalElem = document.getElementById('mailModal');
  const mailModal = new bootstrap.Modal(mailModalElem);
  const smsModalElem = document.getElementById('smsModal');
  const smsModal = new bootstrap.Modal(smsModalElem);

  const initLogsTable = async () => {
    const logsTable = document.querySelector('#table_logs');
    const logsRequest = await fetch('/api/logs');
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
    const datatableLog = $(logsTable).DataTable({
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
          targets: columns.findIndex((c) => c.field === 'outType'),
          render: (data) =>
            `<span client-data="${data}" class="badge bg-${
              data === 'EMAIL' ? 'primary' : 'secondary'
            } fw-bold rounded-pill py-2 px-3">${
              data === 'EMAIL'
                ? '<i class="bi bi-envelope me-2"></i>'
                : '<i class="bi bi-chat-square me-2"></i>'
            }${data === 'EMAIL' ? 'Email' : 'Sms'}</span>`,
        },
        {
          targets: columns.findIndex((c) => c.field === 'status'),
          render: (data) =>
            `<span client-data="${data}" class="badge bg-${
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
    filtersContainer.classList.remove('d-none');
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
      // fill sms info list
      [...targetModalContainer.querySelectorAll('.list-info-item')].forEach(
        (listItem) => {
          const infoFieldType = listItem.getAttribute('data-log-field');
          if (isEmail) {
            targetModalContainer.querySelector(
              '#attachmentListContent'
            ).innerHTML =
              cellData.outputEmailList[0].attachmentList[0].outputValue;
            targetModalContainer.querySelector('#emailContent').innerHTML =
              cellData.outputEmailList[0].body;
          } else {
            targetModalContainer.querySelector('#smsContent').innerHTML =
              cellData.outputSmsList[0].message;
          }
          if (listItem.getAttribute('data-sms-mobile-field') === 'true') {
            listItem.innerHTML = cellData.outputSmsList[0][infoFieldType];
          } else if (
            listItem.getAttribute('data-email-list-field') === 'true'
          ) {
            listItem.innerHTML = cellData.outputEmailList[0][infoFieldType];
          } else {
            if (infoFieldType === 'status') {
              listItem.innerHTML = `<span class="badge bg-${
                cellData[infoFieldType] === 'SUCCESSFULLY'
                  ? 'success'
                  : 'danger'
              } fw-bold rounded-pill py-2 px-3">${
                cellData[infoFieldType] === 'SUCCESSFULLY'
                  ? 'Success'
                  : 'Inactive'
              }</span>`;
            } else if (infoFieldType === 'processDateTime') {
              listItem.innerHTML = moment(
                cellData[infoFieldType],
                'YYYY-MM-DDThh:mm:ss'
              ).format('DD/MM/YYYY hh:mm:ss');
            } else if (infoFieldType === 'outType') {
              listItem.innerHTML = `<span class="badge bg-${
                cellData[infoFieldType] === 'EMAIL' ? 'primary' : 'secondary'
              } fw-bold rounded-pill py-2 px-3">${
                cellData[infoFieldType] === 'EMAIL'
                  ? '<i class="bi bi-envelope me-2"></i>'
                  : '<i class="bi bi-chat-square me-2"></i>'
              }${cellData[infoFieldType] === 'EMAIL' ? 'Email' : 'Sms'}</span>`;
            } else {
              listItem.innerHTML = cellData[infoFieldType];
            }
          }
        }
      );
      targetModal.show();
    });

    // Filters
    [...document.querySelectorAll('.filters select')].forEach((selectElem) => {
      $(selectElem).select2();
      $(selectElem).on('select2:select', () =>
        datatableLog
          .column(columns.findIndex((c) => c.field === selectElem.name))
          .search(selectElem.value, true, false)
          .draw()
      );
      $(selectElem).on('select2:clear', () =>
        datatableLog
          .column(columns.findIndex((c) => c.field === selectElem.name))
          .search(selectElem.value)
          .draw()
      );
    });
    // Search
    const searchElem = document.querySelector('#filter_search');
    searchElem.addEventListener('keyup', () =>
      datatableLog.search(searchElem.value).draw()
    );
  };
  return {
    init: () => {
      initLogsTable();
    },
  };
})();

$(() => {
  Logs.init();
});
