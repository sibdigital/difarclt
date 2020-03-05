import { JetView } from "webix-jet";
import {
  ROOT_URL,
  CLS_STANDARD_PERIOD,
  ACTION_CREATE,
  ACTION_UPDATE,
  FORM_NAME,
  FORM_NUMBER
} from "~/util/constants.js";

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
              click: () => this.app.show("/top/cls-standard-period")
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

  init() {}

  urlChange(view, url) {
    $$("save").attachEvent("onItemClick", () => this.saveRow());

    $$("delete").attachEvent("onItemClick", () =>
      this.deleteRow(url[0].params.id)
    );

    $$("update").attachEvent("onItemClick", () =>
      this.updateRow(url[0].params.id, CLS_STANDARD_PERIOD)
    );

    webix
      .ajax()
      .get(ROOT_URL + CLS_STANDARD_PERIOD + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
      });
  }

  saveRow() {
    const url = ROOT_URL + CLS_STANDARD_PERIOD + ACTION_CREATE;
    const item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue()
    };

    webix
      .ajax()
      .headers({
        "Content-Type": "application/json"
      })
      .post(url, item)
      .then(data => this.setBlank());
  }

  updateRow(id) {
    const urlPut = ROOT_URL + CLS_STANDARD_PERIOD + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_STANDARD_PERIOD + "/" + id;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        const item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();

        webix
          .ajax()
          .headers({
            "Content-Type": "application/json"
          })
          .put(urlPut, item)
          .then(data => this.setBlank());
      });
  }

  deleteRow(id) {
    const url = ROOT_URL + CLS_STANDARD_PERIOD + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$(FORM_NAME).setValue("");
    $$(FORM_NUMBER).setValue("");
  }
}
