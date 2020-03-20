import { JetView } from "webix-jet";
import {
  CLS_GPS_MODULE,
  CLS_ORGANIZATION,
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
              click: () => this.app.show("/top/cls-gps-module")
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
            {
              view: "combo",
              id: "combo1",
              label: polyglot.t("organization"),
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
      .get(ROOT_URL + CLS_GPS_MODULE + "/" + url[0].params.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("combo1").setValue(data.json().clsOrganizationByIdOrganization.id);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_GPS_MODULE + ACTION_CREATE;
    const urlGet = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();

    let item = {
      name: $$("name").getValue(),
      number: $$("number").getValue()
    };

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item.clsOrganizationByIdOrganization = data.json();
      })
      .then(() => {
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
    const urlPut = ROOT_URL + CLS_GPS_MODULE + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_GPS_MODULE + "/" + id;
    const urlOrg = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$("name").getValue();
        item.number = $$("number").getValue();
      })
      .then(() => {
        webix
          .ajax()
          .get(urlOrg)
          .then(data => {
            item.clsOrganizationByIdOrganization = data.json();
          });
      })
      .then(() => {
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
    const url = ROOT_URL + CLS_GPS_MODULE + "/" + id;

    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$("name").setValue("");
    $$("number").setValue("");
    $$("combo1").setValue("");
  }
}
