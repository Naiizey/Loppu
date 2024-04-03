const API = (content) => {
  return fetch("http://localhost:5001/api/" + content)
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log(err);
    });
};

export default API;
