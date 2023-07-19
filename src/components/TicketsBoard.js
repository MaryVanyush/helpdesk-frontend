import Api from "./Api";
import Modal from "./Modal";

export default class Ticketsboard {
  constructor() {}

  static updateTicketsboard(arr) {
    const tiketsList = document.querySelector(".tikets-list");
    Array.from(tiketsList.children).forEach((el) => el.remove());
    arr.forEach((el) => {
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
    const callback = (response) => {
      if (response) {
        Api.getAllTicketsboard((response) => {
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
    const formattedDate = new Date(dateString)
      .toLocaleString("ru-RU", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })
      .split(",")
      .join("");
    return formattedDate;
  }
}
