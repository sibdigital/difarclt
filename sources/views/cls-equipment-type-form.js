import { JetView } from "webix-jet";
import { CLS_EQUIPMENT_TYPE, ROOT_URL } from "~/util/constants.js";
import { saveRow, deleteRow, updateRow } from "~/util/api";
import { polyglot } from "jet-locales/ru.js";

export default class EquipmentTypeFormView extends JetView {
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
              click: () => this.app.show("/top/cls-equipment-type")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 150,
              label: polyglot.t("dependencies.equipment_type")
            }
          ]
        },
        {
          view: "form",
          id: "form",
          elements: [
            { view: "text", label: polyglot.t("base.name"), id: "name" },
            { view: "text", label: polyglot.t("base.code"), id: "code" },
            { view: "text", label: polyglot.t("base.number"), id: "number" },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("form.save"),
                  id: "save",
                  click: () => saveRow(CLS_EQUIPMENT_TYPE, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_EQUIPMENT_TYPE, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () => updateRow(CLS_EQUIPMENT_TYPE, this.item, this.id)
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
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_EQUIPMENT_TYPE + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("code").setValue(data.json().code);
      });
  }
}
