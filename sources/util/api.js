import { ROOT_URL, ACTION_CREATE, ACTION_UPDATE } from "./constants.js";

function fillCombo(entity, combo) {
  webix
    .ajax()
    .headers({
      Authorization: webix.storage.local.get("auth")
    })
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

function setDependency(entity, value, item, property) {
  const url = ROOT_URL + entity + "/" + value;
  webix
    .ajax()
    .headers({
      Authorization: webix.storage.local.get("auth")
    })
    .get(url)
    .then(data => {
      item[property] = data.json();
    });
}

function saveRow(entity, item) {
  const url = ROOT_URL + entity + ACTION_CREATE;
  webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: webix.storage.local.get("auth")
    })
    .post(url, item)
    .then(() => webix.alert("Запись успешно создана"));
}

function updateRow(entity, item, id) {
  const url = ROOT_URL + entity + ACTION_UPDATE;
  item.id = id;
  webix
    .ajax()
    .headers({
      "Content-Type": "application/json",
      Authorization: webix.storage.local.get("auth")
    })
    .put(url, item)
    .then(() => webix.alert("Запись успешно обновлена"));
}

function deleteRow(entity, id) {
  const url = ROOT_URL + entity + "/" + id;
  webix
    .ajax()
    .headers({
      Authorization: webix.storage.local.get("auth")
    })
    .del(url)
    .then(() => webix.alert("Запись успешно удалена"));
}

function fetchData(entity) {
  return webix
    .ajax()
    .headers({
      Authorization: webix.storage.local.get("auth")
    })
    .get(ROOT_URL + entity);
}

function filterTable(table) {
  const value = this.getValue().toLowerCase();
  if (!value) {
    $$(table).filter();
  } else {
    $$(table).filter(function(obj) {
      return obj.name.toLowerCase().indexOf(value) != -1;
    });
  }
}

export {
  saveRow,
  deleteRow,
  updateRow,
  fillCombo,
  setDependency,
  fetchData,
  filterTable
};
