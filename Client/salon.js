import { Reservation } from "./reservation.js";

export class Salon {
  constructor(name, id) {
    this.name = name != null ? name : "NN";
    this.id = id;
    this.services = [];
    this.employers = [];
    this.reservations = [];
    this.container = null;
  }

  addEmployer(empl) {
    this.employers.push(empl);
  }

  addReservation(res) {
    this.reservations.push(res);
  }

  addService(ser) {
    this.services.push(ser);
  }

  renderSalon(parentDiv) {
    this.container = document.createElement("div");
    this.container.className = "salon__wrapper";
    parentDiv.appendChild(this.container);

    const salonName = document.createElement("h1");
    salonName.innerHTML = this.name;
    salonName.className = "salon__name";
    this.container.appendChild(salonName);

    const content = document.createElement("div");
    content.className = "salon__content";
    this.container.appendChild(content);

    this.renderForm(content);

    const records = document.createElement("div");
    records.className = "salon__records";
    content.appendChild(records);

    let title = document.createElement("h2");
    title.innerHTML = "Reservations";
    title.className = "salon__records-title";
    records.appendChild(title);

    this.renderTable(records);
  }

  renderForm(parentDiv) {
    const form = document.createElement("div");
    form.className = "salon__form";
    parentDiv.appendChild(form);

    let title = document.createElement("h3");
    title.innerHTML = "Create reservation";
    form.appendChild(title);

    let inputGroup = document.createElement("div");
    inputGroup.className = "salon__input-group";
    form.appendChild(inputGroup);

    let label = document.createElement("label");
    label.innerHTML = "Customer: ";
    inputGroup.appendChild(label);

    let input = document.createElement("input");
    input.className = "salon__clientInput";
    input.maxLength = 255;
    inputGroup.appendChild(input);

    inputGroup = document.createElement("div");
    inputGroup.className = "salon__input-group";
    form.appendChild(inputGroup);

    label = document.createElement("label");
    label.innerHTML = "Date: ";
    inputGroup.appendChild(label);

    input = document.createElement("input");
    input.className = "salon__dateInput";
    input.type = "datetime-local";
    input.value = this.getCurrentDate();
    inputGroup.appendChild(input);

    inputGroup = document.createElement("div");
    inputGroup.className = "salon__input-group";
    form.appendChild(inputGroup);

    label = document.createElement("label");
    label.innerHTML = "Employer:";
    inputGroup.appendChild(label);

    this.renderSelector(inputGroup);

    inputGroup = document.createElement("div");
    inputGroup.className = "salon__input-group";
    form.appendChild(inputGroup);

    label = document.createElement("label");
    label.innerHTML = "Service: ";
    inputGroup.appendChild(label);

    this.renderRadioButtons(inputGroup);

    let button = document.createElement("button");
    button.innerHTML = "Reservate";
    button.onclick = (event) => this.createReservation();
    form.appendChild(button);
  }

  getCurrentDate() {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  renderSelector(parentDiv) {
    const employerSelector = document.createElement("select");
    employerSelector.className = "employerSelector";
    parentDiv.appendChild(employerSelector);

    this.employers.forEach((el, index) => {
      const option = document.createElement("option");
      option.innerHTML = `${el.name} ${el.lastName}`;
      option.value = index;
      employerSelector.appendChild(option);
    });
  }

  renderRadioButtons(parentDiv) {
    let radioButtonsGroup = document.createElement("div");
    radioButtonsGroup.className = "salon__radio-button-group";
    parentDiv.appendChild(radioButtonsGroup);

    this.services.forEach((el, index) => {
      let radioButtonWrapper = document.createElement("div");
      radioButtonWrapper.className = "salon__radio-button-wrapper";
      radioButtonsGroup.appendChild(radioButtonWrapper);

      let radioButton = document.createElement("input");
      radioButton.type = "radio";
      radioButton.name = this.name;
      radioButton.value = index;
      if (index == 0) {
        radioButton.checked = "checked";
      }
      radioButtonWrapper.appendChild(radioButton);

      let label = document.createElement("label");
      label.innerHTML = el.name;
      radioButtonWrapper.appendChild(label);
    });
  }

  renderTable(parentDiv) {
    let table = document.createElement("table");
    table.className = "salon__table";
    parentDiv.appendChild(table);

    this.renderTableHeader(table);
    this.renderReservations(table);
  }

  renderTableHeader(parentDiv) {
    let tableHeaderRow = document.createElement("tr");
    parentDiv.appendChild(tableHeaderRow);

    const tableHeaderTitles = ["DateTime", "Service", "Customer", "Employer", ""];

    let headerCell;
    tableHeaderTitles.forEach((headerTitle) => {
      headerCell = document.createElement("th");
      headerCell.innerHTML = headerTitle;
      tableHeaderRow.appendChild(headerCell);
    });
  }

  renderReservations(table) {
    this.reservations.forEach((reservation) => {
      this.renderOneReservation(table, reservation);
    });
  }

  createReservation() {
    const customer = this.container.querySelector(".salon__clientInput").value;
    let selector = this.container.querySelector(".employerSelector");
    let employer = this.employers[selector.selectedIndex];
    let serviceTypeIndex = parseInt(
      this.container.querySelector("input[type=radio]:checked").value
    );
    let service = this.services[serviceTypeIndex];
    const parsedDate = Date.parse(
      this.container.querySelector(".salon__dateInput").value
    );
    const dateTime = new Date(parsedDate);
    this.validateReservation(customer, dateTime, employer, service);
  }

  validateReservation(customer, dateTime, employer, service) {
    const now = new Date();
    if (!customer) {
      alert("Customer name is empty.");
    } else if (dateTime <= now) {
      alert("Date is invalid.");
    } else if (this.cannotCreateReservation(dateTime, employer)) {   
      alert("Date already exists.");
    } else if (!this.checkIfOpenedHours(dateTime)) {
      alert(`${this.name} is not working in those hours`);
    } else if (this.checkIfSunday(dateTime)) {
      alert(`${this.name} is not working on Sunday`);
    } else {
      this.sendReservation(customer, employer, service, dateTime);
    }
  }

  cannotCreateReservation(dateTime, employer) {  
    const dateAlreadyExists = this.reservations.find((res) => {
      if (
        res.reservationDate.getTime() == dateTime.getTime() &&
        res.employer.id == employer.id
      ) {
        return res;
      } else if (!this.has30MinutesDifference(res.reservationDate, dateTime) && res.employer.id == employer.id) {
        return res;
      }
    });
    return dateAlreadyExists;
  }

  checkIfOpenedHours(date) {
    const start = 8 * 60 + 30;
    const end = 18 * 60 + 0;
    const time = date.getHours() * 60 + date.getMinutes();
    return time >= start && time < end;
  }

  has30MinutesDifference(reservationDate, dateTime) {
    let diff = Math.abs(reservationDate - dateTime);
    let resultInMinutes = Math.round(diff / 60000);
    return resultInMinutes >= 30;
  }

  checkIfSunday(date) {         
    return date.getDay() == 6;
  }

  sendReservation(client, employer, service, dateTime) {
    const reservation = new Reservation();
    reservation.reservationDate = dateTime;
    reservation.employer = employer;
    reservation.customer = client;
    reservation.service = service;
    fetch(
      "https://localhost:5001/Reservation/CreateReservation/SalonId=" + this.id,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...reservation,               
          reservationDate: dateTime.toISOString(),
        }),
      }
    ).then((res) => {
      if (res.ok) {
        res.json().then((res) => {
          reservation.id = res.id;
        });
        this.addReservation(reservation);
        const table = this.container.querySelector(".salon__table");
        this.renderOneReservation(table, reservation);
        this.resetFormData();
      }
    });
  }

  renderOneReservation(table, reservation) {
    const tableRow = document.createElement("tr");
    tableRow.className = ".salon__reservation-row";
    table.appendChild(tableRow);

    reservation.renderReservationCells(tableRow);

    let cell = document.createElement("td");
    tableRow.appendChild(cell);

    let editButton = document.createElement("button");
    editButton.innerHTML = "Edit";
    editButton.className = "reservation__button edit__btn";
    editButton.onclick = (ev) =>
      this.editReservation(reservation, this.services);
    cell.appendChild(editButton);

    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = "Delete";
    deleteButton.onclick = (ev) => this.removeReservation(reservation);
    deleteButton.className = "reservation__button delete__btn";
    cell.appendChild(deleteButton);
  }

  resetFormData() {
    const customer = this.container.querySelector(".salon__clientInput");
    customer.value = "";
    const selector = this.container.querySelector(".employerSelector");
    selector.selectedIndex = 0;
    const serviceRadioGroup = this.container.querySelectorAll("input[type=radio]");
    serviceRadioGroup[0].checked = true;
    const dateTimeInput = this.container.querySelector(".salon__dateInput");
    dateTimeInput.value = this.getCurrentDate();
  }

  editReservation(reservation, services) {
    let index = this.reservations.findIndex((el) => el.id === reservation.id);
    const serviceCell = this.container.querySelectorAll(
      ".reservation__service"
    )[index];
    reservation.update(services, serviceCell);
  }

  removeReservation(reservation) {
    fetch(
      "https://localhost:5001/Reservation/DeleteReservation/ReservationId=" + reservation.id,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (res.ok) {
        let index = this.reservations.findIndex(
          (el) => el.id === reservation.id
        );
        this.reservations.splice(index, 1);
        const table = this.container.querySelector(".salon__table");
        table.deleteRow(index + 1);
      }
    });
  }
}
