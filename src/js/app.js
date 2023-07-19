import Modal from "../components/Modal";
import Ticketsboard from "../components/TicketsBoard";
import Api from "../components/Api";
import Ticket from "../components/Ticket";

const addTicketButton = document.querySelector(".add-ticket-button");
const modalAddTicket = document.querySelector(".modal-add-ticket");
const tiketsList = document.querySelector(".tikets-list");

document.addEventListener("DOMContentLoaded", () => {
  Api.getAllTicketsboard((response) =>
    Ticketsboard.updateTicketsboard(response),
  );
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
