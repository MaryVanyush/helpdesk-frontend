export default class Api {
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
      id: id,
    };
    const body = Object.entries(data)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", (response) => {
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
      status: status,
    };
    let body = new FormData();
    for (const key in data) {
      body.append(key, data[key]);
    }
    const xhr = new XMLHttpRequest();
    xhr.open("POST", api.url);
    xhr.send(body);
    xhr.addEventListener("load", (response) => {
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
      description: description,
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
      id: id,
    };
    let body = new FormData();
    for (const key in data) {
      body.append(key, data[key]);
    }
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", (response) => {
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
      id: id,
    };
    const body = Object.entries(data)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
      )
      .join("&");
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", (response) => {
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
