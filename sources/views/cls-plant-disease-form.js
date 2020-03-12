import { JetView } from "webix-jet";
import {
  CLS_PLANT_DISEASE,
  CLS_UNIT,
  FORM_NAME,
  FORM_NUMBER,
  FORM_CODE,
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
              click: () => this.app.show("/top/cls-plant-disease")
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
            { view: "text", label: polyglot.t("name"), id: FORM_NAME },
            { view: "text", label: polyglot.t("number"), id: FORM_NUMBER },
            { view: "text", label: polyglot.t("code"), id: FORM_CODE },
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
      .get(ROOT_URL + CLS_PLANT_DISEASE + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$(FORM_CODE).setValue(data.json().code);
        $$("min_incub_period").setValue(data.json().min_incub_period);
        $$("max_incub_period").setValue(data.json().max_incub_period);
        $$("combo1").setValue(data.json().clsUnitByIdUnit);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_PLANT_DISEASE + ACTION_CREATE;
    const urlGet = ROOT_URL + CLS_UNIT + "/" + $$("combo1").getValue();

    let item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue(),
      code: $$(FORM_CODE).getValue(),
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
    const urlPut = ROOT_URL + CLS_PLANT_DISEASE + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_PLANT_DISEASE + "/" + id;
    const urlUnit = ROOT_URL + CLS_UNIT + "/" + $$("combo1").getValue();
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();
        item.code = $$(FORM_CODE).getValue();
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
    const url = ROOT_URL + CLS_PLANT_DISEASE + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$(FORM_NAME).setValue("");
    $$(FORM_NUMBER).setValue("");
    $$(FORM_CODE).setValue("");
    $$("min_incub_period").setValue();
    $$("max_incub_period").setValue();
    $$("combo1").setValue("");
  }
}
