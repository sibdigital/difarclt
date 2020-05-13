import { JetView } from "webix-jet";
import { CLS_PLANT_PEST, CLS_UNIT, ROOT_URL } from "~/util/constants.js";
import {
  fillCombo,
  setDependency,
  saveRow,
  deleteRow,
  updateRow
} from "~/util/api";
import { polyglot } from "jet-locales/ru.js";

export default class PlantPestFormView extends JetView {
  config() {
    this.item = {};
    return {
      rows: [
        {
          view: "toolbar",
          elements: [
            {
              view: "button",
              width: 150,
              css: "webix_transparent",
              label: polyglot.t("form.back"),
              click: () => this.app.show("/top/cls-plant-pest")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 150,
              label: polyglot.t("dependencies.plant_pest")
            }
          ]
        },
        {
          view: "form",
          id: "plantPestForm",
          elements: [
            { view: "text", label: polyglot.t("base.name"), id: "name" },
            { view: "text", label: polyglot.t("base.number"), id: "number" },
            { view: "text", label: polyglot.t("base.code"), id: "code" },
            {
              view: "text",
              label: polyglot.t("properties.min_incub_period"),
              id: "min_incub_period"
            },
            {
              view: "text",
              label: polyglot.t("properties.max_incub_period"),
              id: "max_incub_period"
            },
            {
              cols: [
                {
                  view: "combo",
                  id: "unit_combo",
                  label: polyglot.t("dependencies.unit"),
                  options: {}
                },
                {
                  view: "button",
                  width: 50,
                  click: () => {
                    const win = this.ui(UnitWindow);
                    $$("unit_win").show();
                  }
                }
              ]
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("form.save"),
                  id: "save",
                  click: () => saveRow(CLS_PLANT_PEST, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_PLANT_PEST, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () => updateRow(CLS_PLANT_PEST, this.item, this.id)
                }
              ]
            }
          ]
        }
      ]
    };
  }

  init() {
    $$("name").attachEvent("onChange", value => {
      this.item.name = value;
    });

    $$("number").attachEvent("onChange", value => {
      this.item.number = value;
    });

    $$("code").attachEvent("onChange", value => {
      this.item.code = value;
    });

    $$("min_incub_period").attachEvent("onChange", value => {
      this.item.minIncubPeriod = value;
    });

    $$("max_incub_period").attachEvent("onChange", value => {
      this.item.maxIncubPeriod = value;
    });

    $$("unit_combo").attachEvent("onChange", value => {
      setDependency(CLS_UNIT, value, this.item, "clsUnitByIdUnit");
    });

    fillCombo(CLS_UNIT, "unit_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_PLANT_PEST + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("code").setValue(data.json().code);
        $$("min_incub_period").setValue(data.json().minIncubPeriod);
        $$("max_incub_period").setValue(data.json().maxIncubPeriod);
        $$("unit_combo").setValue(data.json().clsUnitByIdUnit.id);
      });
  }
}
