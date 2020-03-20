import { JetView } from "webix-jet";
import { ROOT_URL, CLS_AGE_SEX_GROUP } from "~/util/constants.js";
import { saveRow, deleteRow, updateRow } from "~/util/api";
import { polyglot } from "jet-locales/ru.js";

export default class AgeSexGroupView extends JetView {
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
              click: () => this.app.show("/top/cls-age-sex-group")
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
              view: "combo",
              label: polyglot.t("sex"),
              id: "sex",
              options: [
                { id: 1, value: "М" },
                { id: 2, value: "Ж" }
              ]
            },
            { view: "text", label: polyglot.t("begin_age"), id: "begin_age" },
            { view: "text", label: polyglot.t("end_age"), id: "end_age" },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("save"),
                  id: "save",
                  click: () => saveRow(CLS_AGE_SEX_GROUP, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_AGE_SEX_GROUP, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("update"),
                  id: "update",
                  click: () => updateRow(CLS_AGE_SEX_GROUP, this.item)
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
      .get(ROOT_URL + CLS_AGE_SEX_GROUP + "/" + url[0].params.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("code").setValue(data.json().code);
        $$("sex").setValue(data.json().sex);
        $$("begin_age").setValue(data.json().beginAge);
        $$("end_age").setValue(data.json().endAge);
      });
  }
}
