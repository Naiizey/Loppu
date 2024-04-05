const Ajv = require("ajv");
const fs = require("fs");

const validator = new Ajv({
  allErrors: true,
});

// Load JSON schema
const baseSchema = require("./base_schema.json");

// we load all the schemas in the folder
const schemas = fs
  .readdirSync(__dirname)
  .filter((file) => file.endsWith(".json"));

// we load all the schemas in the folder
schemas.forEach((file) => {
  const schema = require(`./${file}`);
  validator.addSchema(schema);
});

// Load JSON data to be validated
const jsonData = require("../../../misc/test.json"); // Replace "your_json_data.json" with the path to your JSON data file
const fakeData = {
  name: "John Doe",
  age: 30,
  email: "",
};

function assertValidData(schema, data) {
  const valid = validator.validate(schema, data);
  if (!valid) {
    console.log(validator.errors);
  } else {
    console.log("Data is valid");
  }
}

assertValidData(baseSchema, fakeData);
