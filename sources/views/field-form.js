import { JetView } from "webix-jet";
import {
  CLS_FIELD,
  CLS_ORGANIZATION,
  FORM_NAME,
  FORM_CODE,
  FORM_NUMBER,
  ACTION_CREATE
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
              click: () => this.app.show("/top/field")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 100,
              label: "Field Form"
            }
          ]
        },
        {
          view: "form",
          id: "fieldForm",
          elements: [
            { view: "text", placeholder: "Name", id: FORM_NAME },
            { view: "text", placeholder: "Code", id: FORM_CODE },
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
      .get(ROOT_URL + CLS_ORGANIZATION)
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
    $$("save").attachEvent("onItemClick", () => this.saveRow(CLS_FIELD));

    // $$("delete").attachEvent("onItemClick", () =>
    //   deleteRow.call(this, url[0].params.id, FIELD)
    // );

    // $$("update").attachEvent("onItemClick", () =>
    //   updateRow.call(this, url[0].params.id, CLS_FIELD)
    // );

    webix
      .ajax()
      .get(ROOT_URL + CLS_FIELD + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$(FORM_CODE).setValue(data.json().code);
      });
  }

  saveRow(entity) {
    const url = ROOT_URL + entity + ACTION_CREATE;
    const urlOrg = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();

    let item = {
      name: $$(FORM_NAME).getValue(),
      code: $$(FORM_CODE).getValue(),
      number: $$(FORM_NUMBER).getValue()
    };

    webix
      .ajax()
      .get(urlOrg)
      .then(data => {
        item.clsOrganizationByIdOrganization = data.json();
      })
      .then(() => {
        console.log(item);
        webix
          .ajax()
          .headers({
            "Content-Type": "application/json"
          })
          .post("http://localhost:8080/field/create", item)
          .then(data => {
            setBlank();
          });
      });
  }
}
