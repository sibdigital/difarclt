import { JetView } from "webix-jet";
import {
  CLS_PLANT_PEST,
  CLS_UNIT,
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
              click: () => this.app.show("/top/cls-plant-pest")
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
          id: "plantPestForm",
          elements: [
            { view: "text", label: polyglot.t("name"), id: "name" },
            { view: "text", label: polyglot.t("number"), id: "number" },
            { view: "text", label: polyglot.t("code"), id: "code" },
            {
              view: "text",
              label: polyglot.t("min_incub_period"),
              id: "min_incub_period"
            },
            {
              view: "text",
              label: polyglot.t("max_incub_period"),
              id: "max_incub_period"
            },
            {
              view: "combo",
              id: "combo1",
              label: polyglot.t("unit"),
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
      .get(ROOT_URL + CLS_UNIT)
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
      .get(ROOT_URL + CLS_PLANT_PEST + "/" + url[0].params.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("code").setValue(data.json().code);
        $$("min_incub_period").setValue(data.json().min_incub_period);
        $$("max_incub_period").setValue(data.json().max_incub_period);
        $$("combo1").setValue(data.json().clsUnitByIdUnit.id);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_PLANT_PEST + ACTION_CREATE;
    const urlGet = ROOT_URL + CLS_UNIT + "/" + $$("combo1").getValue();

    let item = {
      name: $$("name").getValue(),
      number: $$("number").getValue(),
      code: $$("code").getValue(),
      min_incub_period: $$("min_incub_period").getValue(),
      max_incub_period: $$("max_incub_period").getValue()
    };

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item.clsUnitByIdUnit = data.json();

        webix
          .ajax()
          .headers({
            "Content-Type": "application/json"
          })
          .post(urlPost, item)
          .then(data => {
            this.setBlank();
          });
      });
  }

  updateRow(id) {
    const urlPut = ROOT_URL + CLS_PLANT_PEST + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_PLANT_PEST + "/" + id;
    const urlUnit = ROOT_URL + CLS_UNIT + "/" + $$("combo1").getValue();
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$("name").getValue();
        item.number = $$("number").getValue();
        item.code = $$("code").getValue();
        item.min_incub_period = $$("min_incub_period").getValue();
        item.max_incub_period = $$("max_incub_period").getValue();

        webix
          .ajax()
          .get(urlUnit)
          .then(data => {
            item.clsUnitByIdUnit = data.json();

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
    const url = ROOT_URL + CLS_PLANT_PEST + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$("name").setValue("");
    $$("number").setValue("");
    $$("code").setValue("");
    $$("min_incub_period").setValue();
    $$("max_incub_period").setValue();
    $$("combo1").setValue("");
  }
}
