/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/components/Api.js
class Api {
  constructor() {
    this.url = "http://localhost:7000";
  }
  static getAllTicketsboard(callback) {
    const api = new Api();
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const data = JSON.parse(xhr.responseText);
          callback(data);
          return;
        } catch (e) {
          console.error(e);
        }
      }
    });
    xhr.open("GET", api.url + "/?method=allTicketsboard");
    xhr.send();
  }
  static ticketById(id, callback) {
    const api = new Api();
    const data = {
      method: "ticketById",
      id: id
    };
    const body = Object.entries(data).map(_ref => {
      let [key, value] = _ref;
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join("&");
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", response => {
      response = xhr.response;
      if (response) {
        callback(JSON.parse(response));
      }
    });
    xhr.open("GET", api.url + "/?" + body);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
  }
  static createTicket(name, description, status, callback) {
    const api = new Api();
    const data = {
      name: name,
      id: null,
      description: description,
      status: status
    };
    let body = new FormData();
    for (const key in data) {
      body.append(key, data[key]);
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", api.url);
    xhr.send(body);
    xhr.addEventListener("load", response => {
      response = xhr.response;
      if (response) callback(response);
      return;
    });
  }
  static updateTicket(id, name, description, callback) {
    const api = new Api();
    const data = {
      method: "updateTicket",
      name: name,
      id: id,
      description: description
    };
    let body = new FormData();
    for (const key in data) {
      body.append(key, data[key]);
    }
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", () => {
      if (xhr.response) {
        callback(JSON.parse(xhr.response));
      }
    });
    xhr.open("PUT", api.url);
    xhr.send(body);
  }
  static checkMark(id, callback) {
    const api = new Api();
    const data = {
      method: "checkMark",
      id: id
    };
    let body = new FormData();
    for (const key in data) {
      body.append(key, data[key]);
    }
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", response => {
      response = xhr.response;
      if (response) {
        callback(JSON.parse(response));
      }
    });
    xhr.open("PATCH", api.url);
    xhr.send(body);
  }
  static deleteTicket(id, callback) {
    const api = new Api();
    const data = {
      method: "deleteTicket",
      id: id
    };
    const body = Object.entries(data).map(_ref2 => {
      let [key, value] = _ref2;
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    }).join("&");
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", response => {
      response = xhr.response;
      if (response) {
        callback(JSON.parse(response));
      }
    });
    xhr.open("DELETE", api.url + "/?" + body);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.send();
  }
}
;// CONCATENATED MODULE: ./src/components/TicketsBoard.js


class Ticketsboard {
  constructor() {}
  static updateTicketsboard(arr) {
    const tiketsList = document.querySelector(".tikets-list");
    Array.from(tiketsList.children).forEach(el => el.remove());
    arr.forEach(el => {
      if (el) {
        const element = Ticketsboard.createTicket(el);
        tiketsList.append(element);
      }
      return;
    });
  }
  static addTicket(form) {
    const name = form.querySelector(".modal-basic-text").value;
    const description = form.querySelector(".modal-description-text").value;
    if (!name) return;
    const callback = response => {
      if (response) {
        Api.getAllTicketsboard(response => {
          Ticketsboard.updateTicketsboard(response);
        });
      } else {
        return;
      }
    };
    const response = Api.createTicket(name, description, false, callback);
  }
  static createTicket(obj) {
    const ticket = document.createElement("div");
    ticket.classList = "ticket";
    ticket.id = obj.id;
    const ticketBasic = document.createElement("div");
    ticketBasic.classList = "ticket_basic-information";
    const checkbox = document.createElement("div");
    checkbox.classList = "checkbox";
    if (obj.status === true) checkbox.classList.add("checked");
    const basicText = document.createElement("span");
    basicText.classList = "basic-information-text";
    basicText.textContent = obj.name;
    const date = document.createElement("span");
    date.classList = "date";
    date.textContent = Ticketsboard.getDate(obj.created);
    const replaceBtn = document.createElement("button");
    replaceBtn.classList = "replace-ticket-button";
    const deleteBtn = document.createElement("button");
    deleteBtn.classList = "delete-ticket-button";
    ticketBasic.appendChild(checkbox);
    ticketBasic.appendChild(basicText);
    ticketBasic.appendChild(date);
    ticketBasic.appendChild(replaceBtn);
    ticketBasic.appendChild(deleteBtn);
    ticket.appendChild(ticketBasic);
    return ticket;
  }
  static getDate(dateString) {
    const formattedDate = new Date(dateString).toLocaleString("ru-RU", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false
    }).split(",").join("");
    return formattedDate;
  }
}
;// CONCATENATED MODULE: ./src/components/Modal.js


class Modal {
  constructor(element, eventElement) {
    this.element = element;
    this.eventElement = eventElement;
    this.registerEvents = this.registerEvents.bind(this);
    this.showModal = this.showModal.bind(this);
    this.toClose = this.toClose.bind(this);
    this.showModal();
    this.registerEvents();
  }
  registerEvents() {
    const buttonsModal = [...this.element.querySelectorAll(".button")];
    const onEventButton = () => {
      event.preventDefault();
      const el = event.target;
      if (el.classList.contains("modal-btn-cancel")) {
        this.toClose();
        buttonsModal.forEach(el => el.removeEventListener("click", onEventButton));
        return;
      }
      if (el.classList.contains("modal-btn-ok") && this.element.classList.contains("modal-delete-ticket")) {
        const id = this.eventElement.id;
        const callback = response => {
          if (response) {
            Api.getAllTicketsboard(response => Ticketsboard.updateTicketsboard(response));
          }
        };
        const response = Api.deleteTicket(id, callback);
        this.toClose();
        buttonsModal.forEach(el => el.removeEventListener("click", onEventButton));
        return;
      }
      if (el.classList.contains("modal-btn-ok") && this.element.classList.contains("modal-add-ticket")) {
        Ticketsboard.addTicket(this.element);
        this.toClose();
        buttonsModal.forEach(el => el.removeEventListener("click", onEventButton));
        return;
      }
      if (el.classList.contains("modal-btn-ok") && this.element.classList.contains("modal-replace-ticket")) {
        const id = this.eventElement.id;
        const name = this.element.querySelector(".modal-basic-text").value;
        const description = this.element.querySelector(".modal-description-text").value;
        if (!name) return;
        const callback = response => {
          if (response) {
            Api.getAllTicketsboard(response => Ticketsboard.updateTicketsboard(response));
          }
        };
        const response = Api.updateTicket(id, name, description, callback);
        this.toClose();
        buttonsModal.forEach(el => el.removeEventListener("click", onEventButton));
        return;
      }
    };
    buttonsModal.forEach(el => el.addEventListener("click", onEventButton));
  }
  showModal() {
    this.element.classList.remove("no-active");
  }
  toClose() {
    const form = this.element.querySelector(".form");
    if (form) {
      Array.from(form.elements).forEach(el => {
        if (el.name) el.value = "";
      });
    }
    this.element.classList.add("no-active");
  }
}
;// CONCATENATED MODULE: ./src/components/Ticket.js



class Ticket {
  constructor(ticket, eventElement) {
    this.ticket = ticket;
    this.eventElement = eventElement;
    this.registerEvents = this.registerEvents.bind(this);
    this.setCheckbox = this.setCheckbox.bind(this);
    this.showDescription = this.showDescription.bind(this);
    this.replaceTicket = this.replaceTicket.bind(this);
    this.deleteTicket = this.deleteTicket.bind(this);
    this.registerEvents();
  }
  registerEvents() {
    if (this.eventElement.classList.contains("checkbox")) this.setCheckbox();
    if (this.eventElement.classList.contains("basic-information-text") || this.eventElement.classList.contains("date")) this.showDescription();
    if (this.eventElement.classList.contains("replace-ticket-button")) this.replaceTicket();
    if (this.eventElement.classList.contains("delete-ticket-button")) this.deleteTicket();
  }
  setCheckbox() {
    const id = this.ticket.id;
    const callback = response => {
      const checkbox = this.ticket.querySelector(".checkbox");
      if (response.status) {
        checkbox.classList.add("checked");
      } else {
        checkbox.classList.remove("checked");
      }
    };
    const response = Api.checkMark(id, callback);
  }
  showDescription() {
    if (this.ticket.querySelector(".ticket_description")) {
      this.ticket.querySelector(".ticket_description").remove();
      return;
    }
    const id = this.ticket.id;
    const callback = response => {
      if (response && response[0].description) {
        const description = document.createElement("div");
        description.classList = "ticket_description";
        const descriptionText = document.createElement("span");
        descriptionText.classList = "description-text";
        description.appendChild(descriptionText);
        descriptionText.textContent = response[0].description;
        this.ticket.appendChild(description);
      } else {
        return;
      }
    };
    const response = Api.ticketById(id, callback);
  }
  replaceTicket() {
    const modalReplace = document.querySelector(".modal-replace-ticket");
    const modal = new Modal(modalReplace, this.ticket);
  }
  deleteTicket() {
    const modalDelete = document.querySelector(".modal-delete-ticket");
    const modal = new Modal(modalDelete, this.ticket);
  }
}
;// CONCATENATED MODULE: ./src/js/app.js




const addTicketButton = document.querySelector(".add-ticket-button");
const modalAddTicket = document.querySelector(".modal-add-ticket");
const tiketsList = document.querySelector(".tikets-list");
document.addEventListener("DOMContentLoaded", () => {
  Api.getAllTicketsboard(response => Ticketsboard.updateTicketsboard(response));
});
const openAddModal = () => {
  const modal = new Modal(modalAddTicket);
};
addTicketButton.addEventListener("click", openAddModal);
const getEventOnTicket = () => {
  const eventElement = event.target;
  const container = eventElement.closest(".ticket");
  const ticket = new Ticket(container, eventElement);
};
tiketsList.addEventListener("click", getEventOnTicket);
;// CONCATENATED MODULE: ./src/index.js


/******/ })()
;
//# sourceMappingURL=main.js.map