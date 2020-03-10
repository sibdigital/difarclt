import { JetView } from "webix-jet";
import {
  CLS_UNIT,
  FORM_NAME,
  FORM_CODE,
  FORM_NUMBER
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
              click: () => this.app.show("/top/cls-unit")
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
            { view: "text", placeholder: "Code", id: FORM_CODE },
            { view: "text", placeholder: "Number", id: FORM_NUMBER },
            { view: "text", placeholder: "Reduct", id: "reduct" },
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
      this.updateRow(url[0].params.id)
    );

    webix
      .ajax()
      .get(ROOT_URL + CLS_UNIT + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$(FORM_CODE).setValue(data.json().code);
        $$("reduct").setValue(data.json().reduct);
      });
  }

  saveRow() {
    const url = ROOT_URL + CLS_UNIT + ACTION_CREATE;
    let item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue(),
      code: $$(FORM_CODE).getValue(),
      reduct: $$("reduct").getValue()
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
    const urlPut = ROOT_URL + CLS_UNIT + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_UNIT + "/" + id;
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.code = $$(FORM_CODE).getValue();
        item.reduct = $$("reduct").getValue();

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
    const url = ROOT_URL + CLS_UNIT + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$(FORM_NAME).setValue("");
    $$(FORM_NUMBER).setValue("");
    $$(FORM_CODE).setValue();
    $$("reduct").setValue();
  }
}
