import { JetView } from "webix-jet";
import { CLS_CROP, ROOT_URL } from "~/util/constants.js";
import { saveRow, deleteRow, updateRow } from "~/util/api";
import { polyglot } from "jet-locales/ru.js";

export default class DataView extends JetView {
  config() {
    this.item = new webix.DataRecord({
      name: "11",
      code: "22",
      number: "33"
    });

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
              click: () => this.app.show("/top/cls-crop")
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
          id: "f1",
          elements: [
            {
              view: "text",
              label: polyglot.t("name"),
              id: "name"
            },
            {
              view: "text",
              label: polyglot.t("code"),
              id: "code"
            },
            {
              view: "text",
              label: polyglot.t("number"),
              id: "number"
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("save"),
                  id: "save",
                  click: () => {
                    console.log(this.id);
                    // saveRow(CLS_CROP, this.item);
                  }
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
      .get(ROOT_URL + CLS_CROP + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("code").setValue(data.json().code);
      });
  }

  urlChange(view, url) {
    this.id = url[0].params.id;
  }
}
