import { JetView } from "webix-jet";
import { ROOT_URL, CLS_ANIMAL_PARAM_KIND } from "~/util/constants.js";
import { saveRow, deleteRow, updateRow } from "~/util/api";
import { polyglot } from "jet-locales/ru.js";

export default class AnimalParamKindFormView extends JetView {
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
              click: () => this.app.show("/top/cls-animal-param-kind")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 150,
              label: polyglot.t("dependencies.animal_param_kind")
            }
          ]
        },
        {
          view: "form",
          id: "form",
          elements: [
            { view: "text", label: polyglot.t("base.name"), id: "name" },
            { view: "text", label: polyglot.t("base.number"), id: "number" },
            { view: "text", label: polyglot.t("properties.type"), id: "type" },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("form.save"),
                  id: "save",
                  click: () => saveRow(CLS_ANIMAL_PARAM_KIND, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_ANIMAL_PARAM_KIND, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () =>
                    updateRow(CLS_ANIMAL_PARAM_KIND, this.item, this.id)
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

    $$("type").attachEvent("onChange", value => {
      this.item.type = value;
    });
  }

  urlChange(view, url) {
    this.id = url[0].params.id;
    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_ANIMAL_PARAM_KIND + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("type").setValue(data.json().type);
      });
  }
}
