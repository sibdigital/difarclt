import { ROOT_URL, ACTION_CREATE, ACTION_UPDATE } from "./constants.js";

function fillCombo(entity, combo) {
  webix
    .ajax()
    .get(ROOT_URL + entity)
    .then(data => {
      const list = $$(combo)
        .getPopup()
        .getList();

      const values = [];
      data.json().forEach(entry => {
        values.push({ id: entry.id, value: entry.name });
      });

      list.clearAll();
      list.parse(values);
    });
}

function saveRow(entity, item) {
  const url = ROOT_URL + entity + ACTION_CREATE;
  webix
    .ajax()
    .headers({
      "Content-Type": "application/json"
    })
    .post(url, item);
}

function setDependency(entity, value, item, property) {
  const url = ROOT_URL + entity + "/" + value;
  webix
    .ajax()
    .get(url)
    .then(data => {
      item[property] = data.json();
    });
}

function updateRow(entity, item) {
  const url = ROOT_URL + entity + ACTION_UPDATE;
  webix
    .ajax()
    .headers({
      "Content-Type": "application/json"
    })
    .put(url);
}

function deleteRow(entity, id) {
  const url = ROOT_URL + entity + "/" + id;
  webix.ajax().del(url);
}

export { saveRow, deleteRow, updateRow, fillCombo, setDependency };
