import { JetView } from "webix-jet";
import {
  CLS_USER,
  CLS_ORGANIZATION,
  CLS_EMPLOYEE,
  ACTION_CREATE,
  ACTION_UPDATE,
  ROOT_URL
} from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";

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
              label: polyglot.t("back"),
              click: () => this.app.show("/top/cls-user")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 100,
              label: polyglot.t("form")
            }
          ]
        },
        {
          view: "form",
          id: "form",
          elements: [
            { view: "text", label: polyglot.t("name"), id: "name" },
            { view: "text", label: polyglot.t("number"), id: "number" },
            { view: "text", label: polyglot.t("password"), id: "password" },
            {
              view: "combo",
              id: "combo1",
              label: polyglot.t("organization"),
              options: {}
            },
            {
              view: "combo",
              id: "combo2",
              label: polyglot.t("employee"),
              options: {}
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("save"),
                  id: "save"
                },
                {
                  view: "button",
                  value: polyglot.t("delete"),
                  id: "delete"
                },
                {
                  view: "button",
                  value: polyglot.t("update"),
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
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
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
      name: $$("name").getValue(),
      number: $$("number").getValue(),
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
        item.name = $$("name").getValue();
        item.number = $$("number").getValue();
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
    $$("name").setValue("");
    $$("number").setValue("");
    $$("combo1").setValue("");
    $$("combo2").setValue("");
    $$("password").setValue("");
  }
}
