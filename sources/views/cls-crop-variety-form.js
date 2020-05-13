import { JetView } from "webix-jet";
import { CLS_CROP_VARIETY, CLS_CROP, ROOT_URL } from "~/util/constants.js";
import {
  fillCombo,
  setDependency,
  saveRow,
  deleteRow,
  updateRow
} from "~/util/api";
import { polyglot } from "jet-locales/ru.js";
import { CropWindow } from "~/util/modal";

export default class CropVarietyFormView extends JetView {
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
              click: () => this.app.show("/top/cls-crop-variety")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 150,
              label: polyglot.t("dependencies.crop_variety")
            }
          ]
        },
        {
          view: "form",
          id: "form",
          elements: [
            { view: "text", label: polyglot.t("base.name"), id: "name" },
            { view: "text", label: polyglot.t("base.number"), id: "number" },
            {
              cols: [
                {
                  view: "combo",
                  id: "crop_combo",
                  label: polyglot.t("dependencies.crop"),
                  options: {}
                },
                {
                  view: "button",
                  width: 50,
                  click: () => {
                    const win = this.ui(CropWindow);
                    $$("crop_win").show();
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
                  click: () => saveRow(CLS_CROP_VARIETY, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_CROP_VARIETY, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () => updateRow(CLS_CROP_VARIETY, this.item, this.id)
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

    $$("crop_combo").attachEvent("onChange", value => {
      setDependency(CLS_CROP, value, this.item, "clsCropByIdCrop");
    });

    fillCombo(CLS_CROP, "crop_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;
    console.log(ROOT_URL + CLS_CROP_VARIETY + "/" + this.id);

    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_CROP_VARIETY + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("crop_combo").setValue(data.json().clsCropByIdCrop);
      });
  }
}
