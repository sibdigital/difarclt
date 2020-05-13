import { JetView } from "webix-jet";
import { CLS_ANIMAL_RETIREMENT_CAUSE, ROOT_URL } from "~/util/constants.js";
import {
  fillCombo,
  setDependency,
  saveRow,
  deleteRow,
  updateRow
} from "~/util/api";
import { polyglot } from "jet-locales/ru.js";

export default class AnimalRetirementCauseFormView extends JetView {
  config() {
    this.item = {
      parentPath: "000"
    };
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
              click: () => this.app.show("/top/cls-animal-retirement-cause")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 150,
              label: polyglot.t("form.form")
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
              view: "combo",
              id: "combo1",
              options: {},
              label: polyglot.t("properties.parent")
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("form.save"),
                  id: "save",
                  click: () => saveRow(CLS_ANIMAL_RETIREMENT_CAUSE, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_ANIMAL_RETIREMENT_CAUSE, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () =>
                    updateRow(CLS_ANIMAL_RETIREMENT_CAUSE, this.item, this.id)
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

    $$("combo1").attachEvent("onChange", value => {
      this.item.idParent = value;
    });

    fillCombo(CLS_ANIMAL_RETIREMENT_CAUSE, "combo1");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;
    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_ANIMAL_RETIREMENT_CAUSE + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("code").setValue(data.json().code);
        $$("combo1").setValue(data.json().idParent);
      });
  }
}
