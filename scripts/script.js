(function () {
  window.addEventListener('DOMContentLoaded', async function () {

    const clientsTableEl = document.querySelector('.clients__table');
    const modalWrapper = document.querySelector('.modal-wrapper');
    const modalNew = document.querySelector('.modal-new');
    const modalChange = document.querySelector('.modal-change');
    const modalDelete = document.querySelector('.modal-delete');
    const modalLoading = document.querySelector('.modal-loading');

    let idClient = 0;

    // Управление сортировкой
    let sortObj = {
      direction: 1,
      column: 'sort-id',
      sortFunctions: {
        'sort-id': (a, b) => (a.id - b.id) * sortObj.direction,
        'sort-name': (a, b) => ((a.lastName + ' ' + a.name + ' ' + a.patronymic).localeCompare(b.lastName + ' ' + b.name + ' ' + b.patronymic)) * sortObj.direction,
        'sort-creation': (a, b) => (a.creation - b.creation) * sortObj.direction,
        'sort-change': (a, b) => (a.change - b.change) * sortObj.direction,
      },
      getSortFunction: function () {
        return this.sortFunctions[this.column];
      }
    };
    const sortBtnId = document.getElementById('sort-id');
    const sortBtnName = document.getElementById('sort-name');
    const sortBtnCreation = document.getElementById('sort-creation');
    const sortBtnChange = document.getElementById('sort-change');

    // Сортировка по id
    sortBtnId.addEventListener('click', function () {

      if (sortObj.column === 'sort-id') sortObj.direction *= -1;
      else sortObj.direction = 1;
      sortObj.column = 'sort-id';

      masOfClients.sort(sortObj.getSortFunction());

      document.querySelectorAll('.ch__btn').forEach(el => el.classList.remove('sort-forward', 'sort-backward'));
      sortBtnId.classList.add(sortObj.direction === 1 ? 'sort-forward' : 'sort-backward');

      drawClientTable();
    });

    // Сортировка по ФИО
    sortBtnName.addEventListener('click', function () {

      if (sortObj.column === 'sort-name') sortObj.direction *= -1;
      else sortObj.direction = 1;
      sortObj.column = 'sort-name';

      masOfClients.sort(sortObj.getSortFunction());

      document.querySelectorAll('.ch__btn').forEach(el => el.classList.remove('sort-forward', 'sort-backward'));
      sortBtnName.classList.add(sortObj.direction === 1 ? 'sort-forward' : 'sort-backward');

      drawClientTable();
    });

    // Сортировка по дате и времени создания
    sortBtnCreation.addEventListener('click', function () {

      if (sortObj.column === 'sort-creation') sortObj.direction *= -1;
      else sortObj.direction = 1;
      sortObj.column = 'sort-creation';

      masOfClients.sort(sortObj.getSortFunction());

      document.querySelectorAll('.ch__btn').forEach(el => el.classList.remove('sort-forward', 'sort-backward'));
      sortBtnCreation.classList.add(sortObj.direction === 1 ? 'sort-forward' : 'sort-backward');

      drawClientTable();
    });

    // Сортировка по последним изменениям
    sortBtnChange.addEventListener('click', function () {

      if (sortObj.column === 'sort-change') sortObj.direction *= -1;
      else sortObj.direction = 1;
      sortObj.column = 'sort-change';

      masOfClients.sort(sortObj.getSortFunction());

      document.querySelectorAll('.ch__btn').forEach(el => el.classList.remove('sort-forward', 'sort-backward'));
      sortBtnChange.classList.add(sortObj.direction === 1 ? 'sort-forward' : 'sort-backward');

      drawClientTable();
    });

    let masOfClients = [];

    // Функция создания клиента
    function createClientElement({ id, name, lastName, patronymic, creation, change, masContacts }) {

      const tableItemEl = document.createElement('li');
      const tableIdEl = document.createElement('div');
      const tableNameEl = document.createElement('div');
      const tableCreationEl = document.createElement('div');
      const dateCreationEl = document.createElement('div');
      const timeCreationEl = document.createElement('div');
      const tableLastChangesEl = document.createElement('div');
      const dateLastChangesEl = document.createElement('div');
      const timeLastChangesEl = document.createElement('div');
      const contactsEl = document.createElement('ul');
      const actionsEl = document.createElement('div');
      const actionsBtnChangeEl = document.createElement('button');
      const actionsBtnDeleteEl = document.createElement('button');

      tableItemEl.className = 'table__item';
      tableIdEl.className = 'table__id col-1';
      tableNameEl.className = 'table__name col-2';
      tableCreationEl.className = 'table__creation col-3';
      dateCreationEl.className = 'date-creation';
      timeCreationEl.className = 'time-creation';
      tableLastChangesEl.className = 'table__last-changes col-4';
      dateLastChangesEl.className = 'date-last-changes';
      timeLastChangesEl.className = 'time-last-changes';
      contactsEl.className = 'contacts col-5';
      actionsEl.className = 'actions col-6';
      actionsBtnChangeEl.className = 'actions__btn actions__btn_change';
      actionsBtnDeleteEl.className = 'actions__btn actions__btn_delete';

      tableItemEl.setAttribute('id', id);
      tableItemEl.setAttribute('tabindex', 0);

      tableIdEl.textContent = id;
      tableNameEl.textContent = lastName + ' ' + name + ' ' + patronymic;
      dateCreationEl.textContent = new Date(creation).toLocaleDateString();
      timeCreationEl.textContent = new Date(creation).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
      dateLastChangesEl.textContent = new Date(change).toLocaleDateString();
      timeLastChangesEl.textContent = new Date(change).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
      actionsBtnChangeEl.textContent = 'Изменить';
      actionsBtnDeleteEl.textContent = 'Удалить';

      // Контакты
      if (masContacts.length <= 5) {
        masContacts.forEach(el => {

          const contactEl = document.createElement('li');
          const contactTooltipEl = document.createElement('div');

          contactEl.className = `contact contact_${el.type}`;
          contactTooltipEl.className = 'contact__tooltip';

          if (el.type === 'other') contactTooltipEl.textContent = el.value;
          else {
            contactTooltipEl.textContent = {
              phone: 'Телефон:',
              email: 'Email:',
              fb: 'Facebook:',
              vk: 'VK:',
            }[el.type];

            const contactLinkEl = document.createElement('a');
            contactLinkEl.className = 'contact__link';
            contactLinkEl.textContent = el.value;

            contactLinkEl.setAttribute('target', '_blank');

            if (el.type === 'phone') contactLinkEl.setAttribute('href', `tel:${el.value.replace(/[\(\)\-\s]/g, '')}`);
            if (el.type === 'email') contactLinkEl.setAttribute('href', `mailto:${el.value}`);
            if (el.type === 'fb' || el.type === 'vk') contactLinkEl.setAttribute('href', el.value);

            contactTooltipEl.appendChild(contactLinkEl);
          }

          contactEl.appendChild(contactTooltipEl);
          contactsEl.appendChild(contactEl);

        });
      }
      else {
        masContacts.forEach((el, index) => {

          const contactEl = document.createElement('li');
          const contactTooltipEl = document.createElement('div');

          contactEl.className = `contact contact_${el.type}`;
          contactTooltipEl.className = 'contact__tooltip';

          if (index > 3) contactEl.classList.add('contact_hidden');

          if (el.type === 'other') contactTooltipEl.textContent = el.value;
          else {
            contactTooltipEl.textContent = {
              phone: 'Телефон:',
              email: 'Email:',
              fb: 'Facebook:',
              vk: 'VK:',
            }[el.type];

            const contactLinkEl = document.createElement('a');
            contactLinkEl.className = 'contact__link';
            contactLinkEl.textContent = el.value;

            contactLinkEl.setAttribute('target', '_blank');

            if (el.type === 'phone') contactLinkEl.setAttribute('href', `tel:${el.value.replace(/[\(\)\-\s]/g, '')}`);
            if (el.type === 'email') contactLinkEl.setAttribute('href', `mailto:${el.value}`);
            if (el.type === 'fb' || el.type === 'vk') contactLinkEl.setAttribute('href', el.value);

            contactTooltipEl.appendChild(contactLinkEl);
          }

          contactEl.appendChild(contactTooltipEl);
          contactsEl.appendChild(contactEl);

        });

        const moreEl = document.createElement('li');
        moreEl.className = 'contact contact_more';
        moreEl.textContent = '+' + (masContacts.length - 4);
        contactsEl.appendChild(moreEl);
        moreEl.addEventListener('click', () => {
          contactsEl.querySelectorAll('.contact_hidden').forEach(el => el.classList.remove('contact_hidden'));
          moreEl.remove();
        });

      }

      actionsBtnChangeEl.addEventListener('click', async function () {
        let itemObj = await toServerGetClient(id);
        openModal(modalChange);
        fillDataModalChange(itemObj);
        idClient = id;

        window.location.hash = '#' + id;
      });
      actionsBtnDeleteEl.addEventListener('click', function () {
        openModal(modalDelete);
        idClient = id;
      });

      tableCreationEl.append(dateCreationEl, timeCreationEl);
      tableLastChangesEl.append(dateLastChangesEl, timeLastChangesEl);
      actionsEl.append(actionsBtnChangeEl, actionsBtnDeleteEl);

      tableItemEl.append(tableIdEl, tableNameEl, tableCreationEl, tableLastChangesEl, contactsEl, actionsEl);

      return tableItemEl;
    }

    // Кнопка "Добавить клиента"
    const addClientBtn = document.querySelector('.add-client-btn');
    addClientBtn.addEventListener('click', function () {
      openModal(modalNew);
    });

    // Функция открывания модального окна
    function openModal(modalElement) {
      modalWrapper.classList.add('modal-wrapper_open');
      modalElement.classList.add('modal_open');
      document.documentElement.style.overflow = 'hidden';
      if (modalElement !== modalDelete)
        document.querySelectorAll('.modal-contacts__list').forEach(el => el.append(createContactItemEl()));
    }

    // Функция очистки полей модальных окон
    function clearModal() {
      document.querySelectorAll('.modal__input').forEach(el => el.value = '');
      document.querySelectorAll('.modal-contacts__item').forEach(el => el.remove());
      document.querySelectorAll('.modal__error-message').forEach(el => el.textContent = '');
    }

    // Функция закрывания модальных окон
    function closeModal() {
      modalWrapper.classList.remove('modal-wrapper_open');
      document.querySelector('.modal_open').classList.remove('modal_open');
      setTimeout(() => {
        clearModal();
        document.documentElement.style.overflow = 'revert';
      }, 500);

      // window.location.hash = '';
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }

    // Выходы из модального окна:
    // Кнопки "х"
    document.querySelectorAll('.modal-btn-exit').forEach(el => {
      el.addEventListener('click', closeModal);
    });
    // Серая область вокруг модального окна
    modalWrapper.addEventListener('mousedown', e => {
      if (e.target == modalWrapper) closeModal();
    });
    // Две кнопки отмены
    modalNew.querySelector('.modal__button_cancel').addEventListener('click', closeModal);
    modalDelete.querySelector('.modal__button_cancel').addEventListener('click', closeModal);

    // Тултип "Удалить контакт"
    const tooltipDeleteContact = document.querySelector('.tooltip-delete-contact');
    tooltipDeleteContact.addEventListener('mouseleave', () => {
      if (!document.querySelector('.modal-contacts__btn:hover')) tooltipDeleteContact.style.display = 'none';
    })

    // Функция "Создать новый контакт"
    function createContactItemEl(type, value) {

      const itemEl = document.createElement('li');
      const selectEl = document.createElement('select');
      const optionEl1 = document.createElement('option');
      const optionEl2 = document.createElement('option');
      const optionEl3 = document.createElement('option');
      const optionEl4 = document.createElement('option');
      const optionEl5 = document.createElement('option');
      const inputEl = document.createElement('input');
      const buttonEl = document.createElement('button');

      itemEl.className = 'modal-contacts__item';
      selectEl.className = 'modal-contacts__select';
      inputEl.className = 'modal-contacts__input';
      buttonEl.className = 'modal-contacts__btn';

      inputEl.placeholder = 'Введите данные';

      optionEl1.value = 'phone';
      optionEl2.value = 'email';
      optionEl3.value = 'fb';
      optionEl4.value = 'vk';
      optionEl5.value = 'other';

      optionEl1.textContent = 'Телефон';
      optionEl2.textContent = 'Email';
      optionEl3.textContent = 'Facebook';
      optionEl4.textContent = 'Vk';
      optionEl5.textContent = 'Другое';

      buttonEl.innerHTML = `<svg class="modal-contacts__image icon" width="16" height="16" viewbox="0 0 16 16" fill="none"
      xmlns="http://www.w3.org/2000/svg">
      <title>Отмена</title>
      <path
        d="M8 2C4.682 2 2 4.682 2 8C2 11.318 4.682 14 8 14C11.318 14 14 11.318 14 8C14 4.682 11.318 2 8 2ZM8 12.8C5.354 12.8 3.2 10.646 3.2 8C3.2 5.354 5.354 3.2 8 3.2C10.646 3.2 12.8 5.354 12.8 8C12.8 10.646 10.646 12.8 8 12.8ZM10.154 5L8 7.154L5.846 5L5 5.846L7.154 8L5 10.154L5.846 11L8 8.846L10.154 11L11 10.154L8.846 8L11 5.846L10.154 5Z"
        fill="#B0B0B0" />
    </svg>`;

      selectEl.append(optionEl1, optionEl2, optionEl3, optionEl4, optionEl5);
      itemEl.append(selectEl, inputEl, buttonEl);

      const choices = new Choices(selectEl, {
        searchEnabled: false,
        sorter: undefined,
        itemSelectText: '',
      });
      if (type) choices.setChoiceByValue(type);
      if (value) inputEl.value = value;

      buttonEl.addEventListener('click', () => {
        buttonEl.closest('.modal').querySelector('.modal__button_add-contact').classList.remove('hidden');
        itemEl.remove();
        tooltipDeleteContact.style.display = 'none';
      });
      buttonEl.addEventListener('mouseenter', () => {
        let { x, y, width } = buttonEl.getBoundingClientRect();

        tooltipDeleteContact.style.top = y + 2 + 'px';
        tooltipDeleteContact.style.left = x + width / 2 + 'px';
        tooltipDeleteContact.style.display = 'block';
      });
      buttonEl.addEventListener('mouseleave', () => {
        if (!document.querySelector('.tooltip-delete-contact:hover'))
          tooltipDeleteContact.style.display = 'none';
      });

      return itemEl;
    }

    // Кнопка "Добавить контакт" во всех модальных окнах
    modalWrapper.querySelectorAll('.modal__button_add-contact').forEach(el => {
      el.addEventListener('click', function () {
        el.closest('.modal').querySelector('.modal-contacts__list').append(createContactItemEl());
        if (el.closest('.modal').querySelectorAll('.modal-contacts__item').length > 9) el.classList.add('hidden');
      });
    });
    // document.querySelectorAll('.modal-contacts__list').forEach(el => el.append(createContactItemEl()));

    // Функция наполнения данными модального окна "Изменить"
    function fillDataModalChange({ id, name, lastName, patronymic, masContacts }) {
      if (masContacts.length) modalChange.querySelector('.modal-contacts__list').innerHTML = '';

      modalChange.querySelector('.modal__id').textContent = id;
      modalChange.querySelector('.modal__input_name').value = name;
      modalChange.querySelector('.modal__input_surname').value = lastName;
      modalChange.querySelector('.modal__input_patronymic').value = patronymic;
      masContacts.forEach(el => modalChange.querySelector('.modal-contacts__list').append(createContactItemEl(el.type, el.value)));
    }

    // Функция сбора данных из модального окна
    function getDataFromModal(modalElement) {
      const objClient = {
        name: modalElement.querySelector('.modal__input_name').value,
        lastName: modalElement.querySelector('.modal__input_surname').value,
        patronymic: modalElement.querySelector('.modal__input_patronymic').value,
        change: Date.now(),
        masContacts: [],
      };

      if (modalElement === modalNew) objClient.creation = Date.now();

      modalElement.querySelectorAll('.modal-contacts__item').forEach(el => {
        let type = el.querySelector('.modal-contacts__select').value;
        let value = el.querySelector('.modal-contacts__input').value.trim();
        if (value) objClient.masContacts.push({ type, value });
      });

      return objClient;
    }

    // Функция рисования таблицы
    function drawClientTable() {
      clientsTableEl.innerHTML = '';
      masOfClients.forEach(el => clientsTableEl.appendChild(createClientElement(el)));
    }

    // Берем данные из сервера и рисуем таблицу клиентов (обновляем её)
    async function updateClientTable() {
      modalLoading.classList.add('modal-loading_open');
      document.documentElement.style.overflow = 'hidden';
      const response = await fetch('http://localhost:3000/api/todos');
      const itemsMas = await response.json();
      document.documentElement.style.overflow = 'revert';
      modalLoading.classList.remove('modal-loading_open');

      masOfClients = itemsMas;

      masOfClients.sort(sortObj.getSortFunction());

      drawClientTable();
    }

    // Отправляем данные нового клиента на север
    modalNew.querySelector('.modal__button_ok').addEventListener('click', async function () {

      if (!validation(modalNew)) return;

      const data = getDataFromModal(modalNew);

      modalLoading.classList.add('modal-loading_open');
      document.documentElement.style.overflow = 'hidden';
      let response = await fetch('http://localhost:3000/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify(data),
      });
      document.documentElement.style.overflow = 'revert';
      modalLoading.classList.remove('modal-loading_open');

      if (response.status >= 400) {
        modalNew.querySelector('.modal__error-message').textContent = response.statusText || 'Что-то пошло не так...';
      }
      else {
        closeModal();
        updateClientTable();
      }

    });

    // Берем данные из сервера для конкретного клиента
    async function toServerGetClient(id) {
      modalLoading.classList.add('modal-loading_open');
      document.documentElement.style.overflow = 'hidden';
      const response = await fetch('http://localhost:3000/api/todos/' + id);
      document.documentElement.style.overflow = 'revert';
      modalLoading.classList.remove('modal-loading_open');

      return await response.json();
    }

    // Отправляем запрос на сервер на изменение данных клиента
    modalChange.querySelector('.modal__button_ok').addEventListener('click', async function () {

      if (!validation(modalChange)) return;

      const data = getDataFromModal(modalChange);

      modalLoading.classList.add('modal-loading_open');
      document.documentElement.style.overflow = 'hidden';
      let response = await fetch('http://localhost:3000/api/todos/' + idClient, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify(data),
      });
      document.documentElement.style.overflow = 'revert';
      modalLoading.classList.remove('modal-loading_open');

      if (response.status >= 400) {
        modalChange.querySelector('.modal__error-message').textContent = response.statusText || 'Что-то пошло не так...';
      }
      else {
        closeModal();
        updateClientTable();
      }

    });

    // Отправляем запрос на сервер на удаление данных клиента
    modalDelete.querySelector('.modal__button_ok').addEventListener('click', async function () {

      modalLoading.classList.add('modal-loading_open');
      document.documentElement.style.overflow = 'hidden';
      let response = await fetch('http://localhost:3000/api/todos/' + idClient, {
        method: 'DELETE',
      });
      document.documentElement.style.overflow = 'revert';
      modalLoading.classList.remove('modal-loading_open');

      if (response.status >= 400) {
        modalDelete.querySelector('.modal__error-message').textContent = response.statusText || 'Что-то пошло не так...';
      }
      else {
        closeModal();
        updateClientTable();
      }
    });
    modalChange.querySelector('.modal__button_delete-client').addEventListener('click', function () {
      closeModal();
      openModal(modalDelete);
    });

    // Валидация формы
    function validation(modalElement) {

      const surname = modalElement.querySelector('.modal__input_surname');
      const name = modalElement.querySelector('.modal__input_name');
      const contacts = modalElement.querySelectorAll('.modal-contacts__item');
      const errorMessage = modalElement.querySelector('.modal__error-message');
      let valid = true;
      let masMessages = new Set();
      let focusEl = false;

      surname.addEventListener('keydown', () => surname.classList.remove('error'));
      name.addEventListener('keydown', () => name.classList.remove('error'));

      errorMessage.textContent = '';
      modalElement.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

      if (surname.value.trim() === '') {
        masMessages.add('Не все обязательные поля заполнены');
        surname.classList.add('error');
        valid = false;
        if (!focusEl) focusEl = surname;
      }

      if (name.value.trim() === '') {
        masMessages.add('Не все обязательные поля заполнены');
        name.classList.add('error');
        valid = false;
        if (!focusEl) focusEl = name;
      }

      contacts.forEach(el => {
        let inputEl = el.querySelector('.modal-contacts__input');
        let type = el.querySelector('.modal-contacts__select').value;
        let value = el.querySelector('.modal-contacts__input').value.trim();

        inputEl.addEventListener('keydown', () => el.classList.remove('error'));

        if (!value) {
          masMessages.add('Контакт не заполнен');
          el.classList.add('error');
          valid = false;
          if (!focusEl) focusEl = inputEl;
        }
        else {
          if (type === 'email') {
            if (!/^[A-Z][A-Z0-9._%+-]*[A-Z0-9]@[A-Z]+\.[A-Z]{2,4}$/i.test(value)) {
              masMessages.add('Не верно указан имейл');
              el.classList.add('error');
              valid = false;
              if (!focusEl) focusEl = inputEl;
            }
          }
          if (type === 'phone') {
            value = value.replace(/[+ ()-]/g, '');
            if (value.length < 7 || value.length > 12 || !+value) {
              masMessages.add('Не верно указан номер телефона');
              el.classList.add('error');
              valid = false;
              if (!focusEl) focusEl = inputEl;
            }
          }
        }


      });

      errorMessage.innerText = [...masMessages].join('\n');
      focusEl.focus?.();

      return valid;
    }

    // Поиск
    const searchInput = document.querySelector('.search-input');
    const searchResult = document.querySelector('.search-result');
    let timerId;

    searchInput.addEventListener('keyup', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') return;

      clearTimeout(timerId);

      timerId = setTimeout(async function () {

        if (searchInput.value.trim() === '') {
          searchResult.classList.remove('visible');
          setTimeout(() => searchResult.innerHTML = '', 300);
          return;
        }

        document.querySelector('.loading-image_search').classList.add('visible');
        const response = await fetch('http://localhost:3000/api/todos');
        let itemsMas = await response.json();
        document.querySelector('.loading-image_search').classList.remove('visible');

        itemsMas = itemsMas.filter(el => {
          return (el.lastName + ' ' + el.name + ' ' + el.patronymic).toLowerCase().includes(searchInput.value.trim().toLowerCase());
        });

        searchResult.innerHTML = '';

        // Отрисовка каждого найденного результата
        itemsMas.forEach(el => {
          const searchItem = document.createElement('li');
          const searchLink = document.createElement('a');

          searchLink.setAttribute('href', '#' + el.id);

          searchLink.addEventListener('click', () => {
            setTimeout(() => {
              // window.location.hash = '';
              history.pushState('', document.title, window.location.pathname + window.location.search);
            }, 0);
          });
          searchLink.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (searchLink.parentElement.nextSibling)
                searchLink.parentElement.nextSibling.children[0].focus();
              else searchInput.focus();
            }
            if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (searchLink.parentElement.previousSibling)
                searchLink.parentElement.previousSibling.children[0].focus();
              else searchInput.focus();
            }
          });

          searchItem.className = 'search-result__item';
          searchLink.className = 'search-result__link';

          searchLink.textContent = el.lastName + ' ' + el.name + ' ' + el.patronymic;

          searchItem.appendChild(searchLink);
          searchResult.appendChild(searchItem);
        });

        // Если нет результатов
        if (!itemsMas.length) {
          const item = document.createElement('li');
          item.textContent = 'Нет совпадений';
          item.style.cssText = `
          padding: 8px 16px;
          font-size: 14px;
          color: #999;
          background-color: var(--white);`;
          searchResult.appendChild(item);
        }

        searchResult.classList.add('visible');

        searchInput.focus();

      }, 300);
    });

    searchInput.addEventListener('click', function () {
      searchResult.classList.add('visible');
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        searchResult.firstChild?.firstChild.focus();
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        searchResult.lastChild?.lastChild.focus();
      }
    });

    document.addEventListener('click', function (e) {
      if (e.target != searchInput) searchResult.classList.remove('visible');
    });






    await updateClientTable();
    if (window.location.hash) {
      let id = window.location.hash.slice(1);
      let itemObj = await toServerGetClient(id);
      openModal(modalChange);
      fillDataModalChange(itemObj);
      idClient = id;
    }
    
  });
})();




