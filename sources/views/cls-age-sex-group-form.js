import { JetView } from "webix-jet";
import { ROOT_URL, CLS_AGE_SEX_GROUP } from "~/util/constants.js";
import { saveRow, deleteRow, updateRow } from "~/util/api";
import { polyglot } from "jet-locales/ru.js";

export default class AgeSexGroupFormView extends JetView {
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
              click: () => this.app.show("/top/cls-age-sex-group")
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
              label: polyglot.t("properties.sex"),
              id: "sex",
              options: [
                { id: 0, value: "М" },
                { id: 1, value: "Ж" }
              ]
            },
            {
              view: "text",
              label: polyglot.t("properties.begin_age"),
              id: "begin_age"
            },
            {
              view: "text",
              label: polyglot.t("properties.end_age"),
              id: "end_age"
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("form.save"),
                  id: "save",
                  click: () => saveRow(CLS_AGE_SEX_GROUP, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_AGE_SEX_GROUP, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () => updateRow(CLS_AGE_SEX_GROUP, this.item, this.id)
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

    $$("sex").attachEvent("onChange", value => {
      this.item.sex = value.id;
    });
  }

  urlChange(view, url) {
    this.id = url[0].params.id;
    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_AGE_SEX_GROUP + "/" + this.id)
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
