// TODO : make this work and a middleware for express

const Ajv = require("ajv");
const ajv = new Ajv();

// Import all the json (using regex) files from the folder
const fs = require("fs");
const path = require("path");
const jsonPath = path.join(__dirname, "../../misc/json_model");
const files = fs.readdirSync(jsonPath);
const schemas = files.map((file) => require(path.join(jsonPath, file)));

// Add all the schemas to the ajv instance
schemas.forEach((schema) => {
  ajv.addSchema(schema);
});

const data = {
  name: "John Doe",
  age: 25,
  email: "",
};

const valid = validate(data);

if (valid) {
  console.log("JSON is valid");
} else {
  console.log("JSON is invalid");
  console.log(validate.errors);
}
