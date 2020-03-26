import { JetView } from "webix-jet";
import {
  CLS_EQUIPMENT_KIND,
  CLS_EQUIPMENT_TYPE,
  ROOT_URL
} from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";
import {
  fillCombo,
  setDependency,
  saveRow,
  deleteRow,
  updateRow
} from "~/util/api";
import { EquipmentTypeWindow } from "~/util/modal";

export default class EquipmentKindFormView extends JetView {
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
              click: () => this.app.show("/top/cls-equipment-kind")
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
              cols: [
                {
                  view: "combo",
                  id: "equipment_type_combo",
                  label: polyglot.t("equipment_type"),
                  options: {}
                },
                {
                  view: "button",
                  width: 50,
                  click: () => {
                    const win = this.ui(EquipmentTypeWindow);
                    $$("equipment_type_win").show();
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
                  click: () => saveRow(CLS_EQUIPMENT_KIND, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_EQUIPMENT_KIND, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("update"),
                  id: "update",
                  click: () => updateRow(CLS_EQUIPMENT_KIND, this.item, this.id)
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

    $$("equipment_type_combo").attachEvent("onChange", value => {
      setDependency(
        CLS_EQUIPMENT_TYPE,
        value,
        this.item,
        "clsEquipmentTypeByIdEquipmentType"
      );
    });

    fillCombo(CLS_ORGANIZATION, "equipment_type_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .get(ROOT_URL + CLS_EQUIPMENT_KIND + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("equipment_type_combo").setValue(
          data.json().clsEquipmentTypeByIdEquipmentType.id
        );
      });
  }
}
