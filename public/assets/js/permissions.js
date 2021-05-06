let iti;
const Permissions = (() => {
  let datatablePermissions;
  const loadingContainer = document.querySelector('#container_loading');
  const filtersContainer = document.querySelector('.filters');

  // FORMS
  const updatePermissionForm = document.querySelector('#updatePermissionForm');
  const updatePermissionFormSubmitter = updatePermissionForm.querySelector(
    '[type="submit"]'
  );
  const createPermissionForm = document.querySelector('#createPermissionForm');
  const createPermissionFormSubmitter = createPermissionForm.querySelector(
    '[type="submit"]'
  );
  const createPermissionSelectType = createPermissionForm.querySelector(
    '#permissionType'
  );

  const emailContainer = createPermissionForm.querySelector(
    '#createPerm_emailContainer'
  );
  const phoneContainer = createPermissionForm.querySelector(
    '#createPerm_phoneContainer'
  );

  // MODALS
  const updatePermissionModalElem = document.querySelector(
    '#updatePermissionModal'
  );
  const updatePermissionModal = new bootstrap.Modal(updatePermissionModalElem);

  const createPermissionModalElem = document.querySelector(
    '#createPermissionModal'
  );
  const createPermissionModal = new bootstrap.Modal(createPermissionModalElem);

  const initPermissionsTable = async () => {
    const permissionsTable = document.querySelector('#table_permissions');
    const permissionsRequest = await fetch('/api/permissions');
    const permissionsJSON = await permissionsRequest.json();
    const permissions = permissionsJSON.data.items;
    const columns = [
      {
        field: 'Id',
        header: 'ID',
      },
      {
        field: 'PermissionValue_c',
        header: 'Permission Value',
      },
      {
        field: 'Email_c',
        header: 'Email',
      },
      {
        field: 'Sms_c',
        header: 'SMS',
      },
      {
        field: 'Call_c',
        header: 'Call',
      },
      //   {
      //     field: 'outType',
      //     header: 'Type',
      //   },
      //   {
      //     field: 'status',
      //     header: 'Status',
      //   },
      //   {
      //     field: 'documentType',
      //     header: 'Document Type',
      //   },
      //   {
      //     field: 'processDateTime',
      //     header: 'Process Time',
      //   },
      {
        field: '',
        header: '',
      },
    ];
    addHeadersToTable(permissionsTable, columns);
    datatablePermissions = $(permissionsTable).DataTable({
      data: permissions,
      responsive: true,
      columns: [
        ...columns.map((column) => {
          return { data: column.field };
        }),
      ],
      columnDefs: [
        {
          targets: columns.findIndex((c) => c.field === 'Id'),
          visible: false,
        },
        {
          targets: columns.findIndex((c) => c.field === 'Email_c'),
          render: (data, type, row) => `
                <div class="form-check form-switch">
                    <input data-permission-type="Email_c" class="form-check-input" type="checkbox" ${
                      data === true ? 'checked' : ''
                    } ${validateEmail(row.PermissionValue_c) ? '' : 'disabled'}>
                </div>`,
        },
        {
          targets: columns.findIndex((c) => c.field === 'Sms_c'),
          render: (data, type, row) => `
              <div class="form-check form-switch">
                  <input data-permission-type="Sms_c" class="form-check-input" type="checkbox" ${
                    data === true ? 'checked' : ''
                  } ${validateEmail(row.PermissionValue_c) ? 'disabled' : ''}>
              </div>`,
        },
        {
          targets: columns.findIndex((c) => c.field === 'Call_c'),
          render: (data, type, row) => `
              <div class="form-check form-switch">
                  <input data-permission-type="Call_c" class="form-check-input" type="checkbox" ${
                    data === true ? 'checked' : ''
                  } ${validateEmail(row.PermissionValue_c) ? 'disabled' : ''}>
              </div>`,
        },
        // {
        //   targets: columns.findIndex((c) => c.field === 'processDateTime'),
        //   type: 'date',
        //   render: (data) =>
        //     `${moment(data, 'YYYY-MM-DDThh:mm:ss').format('DD/MM/YYYY')}`,
        // },
        // {
        //   targets: columns.findIndex((c) => c.field === 'outType'),
        //   render: (data) =>
        //     `<span client-data="${data}" class="badge bg-${
        //       data === 'EMAIL' ? 'primary' : 'secondary'
        //     } fw-bold rounded-pill py-2 px-3">${
        //       data === 'EMAIL'
        //         ? '<i class="bi bi-envelope me-2"></i>'
        //         : '<i class="bi bi-chat-square me-2"></i>'
        //     }${data === 'EMAIL' ? 'Email' : 'Sms'}</span>`,
        // },
        // {
        //   targets: columns.findIndex((c) => c.field === 'status'),
        //   render: (data) =>
        //     `<span client-data="${data}" class="badge bg-${
        //       data === 'SUCCESSFULLY' ? 'success' : 'danger'
        //     } fw-bold rounded-pill py-2 px-3">${
        //       data === 'SUCCESSFULLY' ? 'Success' : 'Inactive'
        //     }</span>`,
        // },
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

    // UpdatePermission
    updatePermissionForm.addEventListener('submit', async (e) => {
      updatePermissionFormSubmitter.disabled = true;
      e.preventDefault();
      const updatedPermission = {};
      [...updatePermissionForm.elements].forEach((element) => {
        if (element.getAttribute('data-permission-type')) {
          updatedPermission[element.getAttribute('data-permission-type')] =
            element.checked;
        }
      });
      console.log(updatedPermission);
      const updatePermisionResponse = await axios.patch(
        `/api/permissions/${document.querySelector('#permissionId').value}`,
        updatedPermission
      );
      let rowIndex;
      datatablePermissions.rows((idx, data) => {
        if (data.Id === updatePermisionResponse.data.data.Id) rowIndex = idx;
        return false;
      });
      datatablePermissions
        .row(rowIndex)
        .data(updatePermisionResponse.data.data)
        .draw();
      updatePermissionFormSubmitter.disabled = false;
      updatePermissionModal.hide();
    });

    // CreatePermission
    createPermissionForm.addEventListener('submit', async (e) => {
      try {
        createPermissionFormSubmitter.disabled = true;
        e.preventDefault();
        const createdPermission = {};
        const permissionType = createPermissionSelectType.value;
        if (permissionType === 'Phone') {
          if (iti.isValidNumber()) {
            const parsedPhone = parsePhone(iti.getNumber());
            if(parsedPhone && parsedPhone.countryISOCode === iti.getSelectedCountryData().iso2.toUpperCase()) {
              createdPermission.countryCode = parsedPhone.countryCode;
              createdPermission.areaCode = parsedPhone.areaCode;
              createdPermission.phoneNumber = parsedPhone.number;
            }
            createdPermission.sms = createPermissionForm.querySelector(
              'input[data-permission-type="Sms_c"]'
            ).checked;
            createdPermission.call = createPermissionForm.querySelector(
              'input[data-permission-type="Call_c"]'
            ).checked;
          } else {
            throw Error('Invalid phone number');
          }
        } else if (permissionType === 'Email') {
          if (
            !validateEmail(
              emailContainer.querySelector('#createPerm_email').value
            )
          )
            throw Error('Invalid email');
          createdPermission.email = emailContainer.querySelector(
            '#createPerm_email'
          ).value;
        } else {
          throw Error('Invalid form');
        }
        console.log(createdPermission);
        const createPermisionResponse = await axios.post(
          `/api/permissions`,
          createdPermission
        );
        if (!createPermisionResponse) throw Error('Something went wrong');
        console.log(createPermisionResponse.data.data);
        datatablePermissions.row
          .add(createPermisionResponse.data.data)
          .draw(false);
        createPermissionModal.hide();
        createPermissionForm.reset();
        const synthEvent = new Event('change');
        createPermissionSelectType.dispatchEvent(synthEvent);
      } catch (error) {
        showError(error);
      }
      createPermissionFormSubmitter.disabled = false;
    });

    createPermissionSelectType.addEventListener('change', (e) => {
      const createdPermissionType = createPermissionSelectType.value;

      if (createdPermissionType === 'Email') {
        emailContainer.classList.remove('d-none');
        phoneContainer.classList.add('d-none');

        emailContainer
          .querySelector('#createPerm_email')
          .setAttribute('required', 'required');
        phoneContainer
          .querySelector('#createPerm_phone')
          .removeAttribute('required');
      } else if (createdPermissionType === 'Phone') {
        phoneContainer.classList.remove('d-none');
        emailContainer.classList.add('d-none');

        phoneContainer
          .querySelector('#createPerm_phone')
          .setAttribute('required', 'required');
        emailContainer
          .querySelector('#createPerm_email')
          .removeAttribute('required');
      } else {
        phoneContainer.classList.add('d-none');
        emailContainer.classList.add('d-none');

        phoneContainer
          .querySelector('#createPerm_phone')
          .removeAttribute('required');
        emailContainer
          .querySelector('#createPerm_email')
          .removeAttribute('required');
      }
      console.log(createPermissionSelectType.value);
    });

    // PHONE
    const phoneInput = document.querySelector('#createPerm_phone');
    // output = document.querySelector('#output');

    iti = window.intlTelInput(phoneInput, {
      nationalMode: true,
      utilsScript:
        '/assets/components/intl-tel-input/build/js/utils.js?1613236686837',
      preferredCountries: ['tr', 'de', 'us']
    });

    const handleChange = () => {
      const text = iti.isValidNumber()
        ? 'International: ' + iti.getNumber()
        : 'Please enter a number below';
      console.log(text);
    };

    // listen to "keyup", but also "change" to update when the user selects a country
    phoneInput.addEventListener('change', handleChange);
    phoneInput.addEventListener('keyup', handleChange);

    // last cell event
    $('#table_permissions tbody').on(
      'click',
      'tr td input[data-permission-type]',
      async (e) => {
        const switchInput = e.target;
        switchInput.disabled = true;
        const cellData = datatablePermissions
          .row(switchInput.closest('tr'))
          .data();
        console.log(cellData);
        const type = switchInput.getAttribute('data-permission-type');
        if (type === 'Email_c' && !validateEmail(cellData.PermissionValue_c)) return;
        let body = {};
        body[type] = switchInput.checked;
        const updatePermissionRequest = await axios.patch(
          `/api/permissions/${cellData.Id}`,
          body
        );
        switchInput.checked =
          updatePermissionRequest.data.data[Object.keys(body)[0]];
        switchInput.disabled = false;
      }
    );

    $('#table_permissions tbody').on('click', 'tr td:last-child', (e) => {
      const cell = e.target;
      const cellData = datatablePermissions.row(cell.closest('tr')).data();
      console.log(cellData);

      updatePermissionModalElem.querySelector(
        '.modal-title'
      ).innerHTML = `${cellData.PermissionValue_c} - Details`;
      document.querySelector('#permissionId').value = cellData.Id;
      [
        ...updatePermissionModalElem.querySelectorAll(
          '[data-permission-field]'
        ),
      ].forEach((permissionField) => {
        const permissionDataField = permissionField.getAttribute(
          'data-permission-field'
        );
        console.log(permissionField);
        if (
          permissionField.getAttribute('data-permission-update-field') ===
          'true'
        ) {
          permissionField.querySelector('input').checked =
            cellData[permissionDataField];
        } else {
          if (permissionDataField === 'PermissionDate_c') {
            permissionField.innerHTML = moment
              .utc(cellData[permissionDataField])
              .format('DD/MM/YYYY hh:mm:ss');
          } else {
            permissionField.innerHTML = cellData[permissionDataField];
          }
        }
      });
      updatePermissionModalElem.querySelector(
        '[data-permission-type="Email_c"]'
      ).disabled = !validateEmail(cellData.PermissionValue_c);
      updatePermissionModalElem.querySelector(
        '[data-permission-type="Sms_c"]'
      ).disabled = validateEmail(cellData.PermissionValue_c);
      updatePermissionModalElem.querySelector(
        '[data-permission-type="Call_c"]'
      ).disabled = validateEmail(cellData.PermissionValue_c);
      updatePermissionModal.show();
    });
    // Search
    const searchElem = document.querySelector('#filter_search');
    searchElem.addEventListener('keyup', () =>
      datatableLog.search(searchElem.value).draw()
    );
  };
  return {
    init: () => {
      initPermissionsTable();
    },
  };
})();

$(() => {
  Permissions.init();
});
