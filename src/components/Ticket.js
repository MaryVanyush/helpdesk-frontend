import Api from "./Api";
import Modal from "./Modal";
import Ticketsboard from "./TicketsBoard";

export default class Ticket {
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
    if (
      this.eventElement.classList.contains("basic-information-text") ||
      this.eventElement.classList.contains("date")
    )
      this.showDescription();
    if (this.eventElement.classList.contains("replace-ticket-button"))
      this.replaceTicket();
    if (this.eventElement.classList.contains("delete-ticket-button"))
      this.deleteTicket();
  }

  setCheckbox() {
    const id = this.ticket.id;
    const callback = (response) => {
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
    const callback = (response) => {
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
