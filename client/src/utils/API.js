// API call to get or set data from the database
const API = (content, method = "GET", json = {}) => {
  if (method === "GET") {
    return fetch(`http://localhost:5001/api/${content}`).then((res) =>
      res.json()
    );
  } else {
    return fetch(`http://localhost:5001/api/${content}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(json),
    }).then((res) => res.json());
  }
};

export default API;
