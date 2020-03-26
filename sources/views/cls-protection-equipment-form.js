import { JetView } from "webix-jet";
import {
  CLS_PROTECTION_EQUIPMENT,
  CLS_UNIT,
  ROOT_URL
} from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";

export default class ProtectionEquipmentView extends JetView {
  config() {
    this.item = {};
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
              click: () => this.app.show("/top/cls-protection-equipment")
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
            { view: "text", label: polyglot.t("code"), id: "code" },
            { view: "text", label: polyglot.t("max_consum"), id: "max_consum" },
            { view: "text", label: polyglot.t("mix_consum"), id: "min_consum" },
            {
              cols: [
                {
                  view: "combo",
                  id: "unit_combo",
                  label: polyglot.t("unit"),
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
                  value: polyglot.t("save"),
                  id: "save",
                  click: () => saveRow(CLS_PROTECTION_EQUIPMENT, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_PROTECTION_EQUIPMENT, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("update"),
                  id: "update",
                  click: () =>
                    updateRow(CLS_PROTECTION_EQUIPMENT, this.item, this.id)
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
      this.item.minConsum = value;
    });

    $$("max_incub_period").attachEvent("onChange", value => {
      this.item.maxConsum = value;
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
      .get(ROOT_URL + CLS_PROTECTION_EQUIPMENT + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("code").setValue(data.json().code);
        $$("max_consum").setValue(data.json().maxConsum);
        $$("min_consum").setValue(data.json().minConsum);
        $$("unit_combo").setValue(data.json().clsUnitByIdUnit.id);
      });
  }
}
