import Ticketsboard from "./TicketsBoard";
import Api from "./Api";

export default class Modal {
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
        buttonsModal.forEach((el) =>
          el.removeEventListener("click", onEventButton),
        );
        return;
      }
      if (
        el.classList.contains("modal-btn-ok") &&
        this.element.classList.contains("modal-delete-ticket")
      ) {
        const id = this.eventElement.id;
        const callback = (response) => {
          if (response) {
            Api.getAllTicketsboard((response) =>
              Ticketsboard.updateTicketsboard(response),
            );
          }
        };
        const response = Api.deleteTicket(id, callback);
        this.toClose();
        buttonsModal.forEach((el) =>
          el.removeEventListener("click", onEventButton),
        );
        return;
      }
      if (
        el.classList.contains("modal-btn-ok") &&
        this.element.classList.contains("modal-add-ticket")
      ) {
        Ticketsboard.addTicket(this.element);
        this.toClose();
        buttonsModal.forEach((el) =>
          el.removeEventListener("click", onEventButton),
        );
        return;
      }
      if (
        el.classList.contains("modal-btn-ok") &&
        this.element.classList.contains("modal-replace-ticket")
      ) {
        const id = this.eventElement.id;
        const name = this.element.querySelector(".modal-basic-text").value;
        const description = this.element.querySelector(
          ".modal-description-text",
        ).value;
        if (!name) return;
        const callback = (response) => {
          if (response) {
            Api.getAllTicketsboard((response) =>
              Ticketsboard.updateTicketsboard(response),
            );
          }
        };
        const response = Api.updateTicket(id, name, description, callback);
        this.toClose();
        buttonsModal.forEach((el) =>
          el.removeEventListener("click", onEventButton),
        );
        return;
      }
    };

    buttonsModal.forEach((el) => el.addEventListener("click", onEventButton));
  }

  showModal() {
    this.element.classList.remove("no-active");
  }

  toClose() {
    const form = this.element.querySelector(".form");
    if (form) {
      Array.from(form.elements).forEach((el) => {
        if (el.name) el.value = "";
      });
    }
    this.element.classList.add("no-active");
  }
}
