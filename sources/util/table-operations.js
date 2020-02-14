import {
  ROOT_URL,
  ACTION_CREATE,
  ACTION_UPDATE,
  FORM_NAME,
  FORM_CODE,
  FORM_NUMBER
} from "./constants.js";

function deleteRow(table, entity) {
  const id = $$(table).getSelectedId();
  const url = ROOT_URL + entity + "/" + id;

  webix
    .ajax()
    .del(url)
    .then(data => {
      if (data.text()) {
        $$(table).remove(id);
      }
    });
}

function saveRow(table, entity) {
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
    .then(data => {
      if (data.json() != null) {
        $$(table).add(data.json());
      }
    });
}

function updateRow(table, entity) {
  const url = ROOT_URL + entity + ACTION_UPDATE;
  const id = $$(table).getSelectedId();
  const item = $$(table).getItem(id);

  item.name = $$(FORM_NAME).getValue();
  item.code = $$(FORM_CODE).getValue();
  item.number = $$(FORM_NUMBER).getValue();

  webix
    .ajax()
    .headers({
      "Content-Type": "application/json"
    })
    .put(url, item)
    .then(data => {
      if (data.json() != null) {
        $$(table).updateItem(id, data.json());
      }
    });
}

export { saveRow, deleteRow, updateRow };
