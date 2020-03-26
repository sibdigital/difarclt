import { JetView } from "webix-jet";
import { CLS_ANIMAL_GROUP_KIND, ROOT_URL } from "~/util/constants.js";
import { saveRow, deleteRow, updateRow } from "~/util/api";
import { polyglot } from "jet-locales/ru.js";

export default class AnimalGroupKindFormView extends JetView {
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
              click: () => this.app.show("/top/cls-animal-group-kind")
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
            { view: "text", label: polyglot.t("code"), id: "code" },
            { view: "text", label: polyglot.t("number"), id: "number" },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("save"),
                  id: "save",
                  click: () => saveRow(CLS_ANIMAL_GROUP_KIND, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_ANIMAL_GROUP_KIND, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("update"),
                  id: "update",
                  click: () =>
                    updateRow(CLS_ANIMAL_GROUP_KIND, this.item, this.id)
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
      this.item.number = value;
    });
  }

  urlChange(view, url) {
    this.id = url[0].params.id;
    webix
      .ajax()
      .get(ROOT_URL + CLS_ANIMAL_GROUP_KIND + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("code").setValue(data.json().code);
      });
  }
}
