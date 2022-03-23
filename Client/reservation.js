export class Reservation {
  constructor(reservationDate, id, service, customer, employer) {
    this.reservationDate =
      reservationDate != null ? reservationDate : new Date();
    this.id = id;
    this.service = service;
    this.customer = customer;
    this.employer = employer;
  }

  renderReservationCells(row) {
    let cell = document.createElement("td");
    cell.innerHTML = this.formatDate(this.reservationDate);
    row.appendChild(cell);

    cell = document.createElement("td");
    cell.className = "reservation__service";
    cell.innerHTML = this.service.name;
    row.appendChild(cell);

    cell = document.createElement("td");
    cell.innerHTML = `${this.customer}`;
    row.appendChild(cell);

    cell = document.createElement("td");
    cell.innerHTML = `${this.employer.name} ${this.employer.lastName}`;
    row.appendChild(cell);
  }

  formatDate(date) {
    const dateFormat =
      ("00" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      ("00" + date.getDate()).slice(-2) +
      "/" +
      date.getFullYear() +
      " " +
      ("00" + date.getHours()).slice(-2) +
      ":" +
      ("00" + date.getMinutes()).slice(-2);
    return `${dateFormat}`;
  }

  update(services, serviceCell) {
    serviceCell.innerHTML = "";

    const serviceSelector = document.createElement("select");
    serviceSelector.className = "serviceSelector";
    serviceSelector.onchange = (ev) =>
      this.updateService(services[serviceSelector.selectedIndex], serviceCell);
    const selectedIndex = this.findSelectedServiceIndex(services);
    serviceCell.appendChild(serviceSelector);

    this.createSelectorOptions(serviceSelector, services, selectedIndex);
  }

  findSelectedServiceIndex(services) {
    return services.findIndex((service) => service.id == this.service.id);
  }

  createSelectorOptions(selector, services, selectedIndex) {
    services.forEach((el, index) => {
      const option = document.createElement("option");
      option.innerHTML = `${el.name}`;
      option.value = index;
      option.selected = index == selectedIndex;
      selector.appendChild(option);
    });
  }

  updateService(service, serviceCell) {
    fetch("https://localhost:5001/Reservation/EditReservation/ReservationId=" + this.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(service),
    }).then((res) => {
      if (res.ok) {
        res.json().then((data) => {
          serviceCell.innerHTML = service.name;
        });
      }
    });
  }
}
