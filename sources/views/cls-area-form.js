import { JetView } from "webix-jet";
import {
  CLS_AREA,
  CLS_DISTRICT,
  FORM_NAME,
  FORM_NUMBER,
  ACTION_CREATE,
  ACTION_UPDATE
} from "~/util/constants.js";
import { ROOT_URL } from "~/util/constants.js";

export default class DataView extends JetView {
  config() {
    return {
      rows: [
        {
          view: "toolbar",
          elements: [
            {
              view: "button",
              width: 100,
              css: "webix_transparent",
              label: "Back",
              click: () => this.app.show("/top/cls-area")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 100,
              label: "Form"
            }
          ]
        },
        {
          view: "form",
          id: "form",
          elements: [
            { view: "text", placeholder: "Name", id: FORM_NAME },
            { view: "text", placeholder: "Number", id: FORM_NUMBER },
            {
              view: "combo",
              id: "combo1",
              options: {}
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: "Save",
                  id: "save"
                },
                {
                  view: "button",
                  value: "Delete",
                  id: "delete"
                },
                {
                  view: "button",
                  value: "Update",
                  id: "update"
                }
              ]
            }
          ]
        }
      ]
    };
  }

  init() {
    webix
      .ajax()
      .get(ROOT_URL + CLS_DISTRICT)
      .then(function(data) {
        const list = $$("combo1")
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

  urlChange(view, url) {
    $$("save").attachEvent("onItemClick", () => this.saveRow());

    $$("delete").attachEvent("onItemClick", () =>
      this.deleteRow(url[0].params.id)
    );

    $$("update").attachEvent("onItemClick", () =>
      this.updateRow(url[0].params.id)
    );

    webix
      .ajax()
      .get(ROOT_URL + CLS_AREA + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$("combo1").setValue(data.json().clsDistrictByIdDistrict.id);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_AREA + ACTION_CREATE;
    const urlGet = ROOT_URL + CLS_DISTRICT + "/" + $$("combo1").getValue();

    let item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue()
    };

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item.clsDistrictByIdDistrict = data.json();

        webix
          .ajax()
          .headers({
            "Content-Type": "application/json"
          })
          .post(urlPost, item)
          .then(data => this.setBlank());
      });
  }

  updateRow(id) {
    const urlPut = ROOT_URL + CLS_AREA + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_AREA + "/" + id;
    const urlOrg = ROOT_URL + CLS_DISTRICT + "/" + $$("combo1").getValue();
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();

        new Promise(resolve => {
          webix
            .ajax()
            .get(urlOrg)
            .then(data => {
              item.clsDistrictByIdDistrict = data.json();

              new Promise(resolve => {
                webix
                  .ajax()
                  .headers({
                    "Content-Type": "application/json"
                  })
                  .put(urlPut, item)
                  .then(data => this.setBlank());
              });
            });
        });
      });
  }

  deleteRow(id) {
    const url = ROOT_URL + CLS_AREA + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$(FORM_NAME).setValue("");
    $$(FORM_NUMBER).setValue("");
    $$("combo1").setValue("");
  }
}