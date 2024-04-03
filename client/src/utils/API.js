const API = (content) => {
  return fetch("http://localhost:5001/api/" + content).then((res) =>
    res.json()
  );
};

export default API;
