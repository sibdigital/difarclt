import { JetView } from "webix-jet";
import {
  CLS_USER,
  CLS_ORGANIZATION,
  CLS_EMPLOYEE,
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
              click: () => this.app.show("/top/cls-user")
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
            { view: "text", placeholder: "Password", id: "password" },
            {
              view: "combo",
              id: "combo1",
              options: {}
            },
            {
              view: "combo",
              id: "combo2",
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

  fillCombo(entity, combo) {
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

  init() {
    this.fillCombo(CLS_ORGANIZATION, "combo1");
    this.fillCombo(CLS_EMPLOYEE, "combo2");
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
      .get(ROOT_URL + CLS_USER + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$("password").setValue(data.json().password);
        $$("combo1").setValue(data.json().clsOrganizationByIdOrganization.id);
        $$("combo2").setValue(data.json().clsEmployeeByIdEmployee.id);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_USER + ACTION_CREATE;
    const url1 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_EMPLOYEE + "/" + $$("combo2").getValue();

    let item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue(),
      password: $$("password").getValue()
    };

    webix
      .ajax()
      .get(url1)
      .then(data => {
        item.clsOrganizationByIdOrganization = data.json();

        webix
          .ajax()
          .get(url2)
          .then(data => {
            item.clsEmployeeByIdEmployee = data.json();

            webix
              .ajax()
              .headers({
                "Content-Type": "application/json"
              })
              .post(urlPost, item)
              .then(data => this.setBlank());
          });
      });
  }

  updateRow(id) {
    const urlPut = ROOT_URL + CLS_USER + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_USER + "/" + id;
    const url1 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_EMPLOYEE + "/" + $$("combo2").getValue();
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();
        item.password = $$("password").getValue();

        webix
          .ajax()
          .get(url1)
          .then(data => {
            item.clsOrganizationByIdOrganization = data.json();

            webix
              .ajax()
              .get(url2)
              .then(data => {
                item.clsEmployeeByIdEmployee = data.json();

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
  }

  deleteRow(id) {
    const url = ROOT_URL + CLS_USER + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$(FORM_NAME).setValue("");
    $$(FORM_NUMBER).setValue("");
    $$("combo1").setValue("");
    $$("combo2").setValue("");
    $$("password").setValue("");
  }
}
