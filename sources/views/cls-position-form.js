import { JetView } from "webix-jet";
import {
  CLS_POSITION,
  CLS_ORGANIZATION,
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
              click: () => this.app.show("/top/cls-position")
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
              view: "checkbox",
              id: "predefined",
              label: "Predefined",
              value: 0
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
    $$("save").attachEvent("onItemClick", () => this.saveRow());

    $$("delete").attachEvent("onItemClick", () =>
      this.deleteRow(url[0].params.id)
    );

    $$("update").attachEvent("onItemClick", () =>
      this.updateRow(url[0].params.id)
    );

    webix
      .ajax()
      .get(ROOT_URL + CLS_POSITION + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$("combo1").setValue(data.json().clsOrganizationByIdOrganization.id);
        $$("predefined").setValue(data.json().predefined);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_POSITION + ACTION_CREATE;
    const urlGet = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();

    let item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue(),
      predefined: $$("predefined").getValue() == 1 ? true : false
    };

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item.clsOrganizationByIdOrganization = data.json();

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
    const urlPut = ROOT_URL + CLS_POSITION + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_POSITION + "/" + id;
    const urlOrg = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();
        item.predefined = $$("predefined").getValue() == 1 ? true : false;

        webix
          .ajax()
          .get(urlOrg)
          .then(data => {
            item.clsOrganizationByIdOrganization = data.json();

            webix
              .ajax()
              .headers({
                "Content-Type": "application/json"
              })
              .put(urlPut, item)
              .then(data => this.setBlank());
          });
      });
  }

  deleteRow(id) {
    const url = ROOT_URL + CLS_POSITION + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$(FORM_NAME).setValue("");
    $$(FORM_NUMBER).setValue("");
    $$("combo1").setValue("");
    $$("predefined").setValue("");
  }
}
