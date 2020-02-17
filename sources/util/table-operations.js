import {
  ROOT_URL,
  ACTION_CREATE,
  ACTION_UPDATE,
  FORM_NAME,
  FORM_CODE,
  FORM_NUMBER
} from "./constants.js";

function deleteRow(id, entity) {
  const url = ROOT_URL + entity + "/" + id;

  webix
    .ajax()
    .del(url)
    .then(data => setBlank());
}

function setBlank() {
  $$(FORM_NAME).setValue("");
  $$(FORM_CODE).setValue("");
  $$(FORM_NUMBER).setValue("");
}

function saveRow(entity) {
  const url = ROOT_URL + entity + ACTION_CREATE;
  const item = {
    name: $$(FORM_NAME).getValue(),
    code: $$(FORM_CODE).getValue(),
    number: $$(FORM_NUMBER).getValue()
  };

  webix
    .ajax()
    .headers({
      "Content-Type": "application/json"
    })
    .post(url, item)
    .then(data => setBlank());
}

function updateRow(id, entity) {
  const urlPut = ROOT_URL + entity + ACTION_UPDATE;
  const urlGet = ROOT_URL + entity + "/" + id;

  webix
    .ajax()
    .get(urlGet)
    .then(data => {
      const item = data.json();
      item.name = $$(FORM_NAME).getValue();
      item.code = $$(FORM_CODE).getValue();
      item.number = $$(FORM_NUMBER).getValue();

      webix
        .ajax()
        .headers({
          "Content-Type": "application/json"
        })
        .put(urlPut, item)
        .then(data => setBlank());
    });
}

export { saveRow, deleteRow, updateRow };
