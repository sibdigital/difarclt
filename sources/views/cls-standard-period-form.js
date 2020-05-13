import { JetView } from "webix-jet";
import { ROOT_URL, CLS_STANDARD_PERIOD } from "~/util/constants.js";
import { saveRow, deleteRow, updateRow } from "~/util/api";
import { polyglot } from "jet-locales/ru.js";

export default class StandardPeriodView extends JetView {
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
              click: () => this.app.show("/top/cls-standard-period")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 150,
              label: polyglot.t("dependencies.standard_period")
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
              view: "text",
              label: polyglot.t("period_type"),
              id: "period_type"
            },
            {
              view: "datepicker",
              id: "date_begin",
              label: polyglot.t("properties.date_begin")
              // timepicker: true
            },
            {
              view: "datepicker",
              id: "date_end",
              label: polyglot.t("properties.date_end")
              // timepicker: true
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("form.save"),
                  id: "save",
                  click: () => saveRow(CLS_STANDARD_PERIOD, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_STANDARD_PERIOD, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () =>
                    updateRow(CLS_STANDARD_PERIOD, this.item, this.id)
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

    $$("period_type").attachEvent("onChange", value => {
      this.item.periodType = value;
    });

    $$("date_begin").attachEvent("onChange", value => {
      this.item.dateBegin = value;
    });

    $$("date_end").attachEvent("onChange", value => {
      this.item.dateEnd = value;
    });
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_STANDARD_PERIOD + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("period_type").setValue(data.json().periodType);
        $$("date_begin").setValue(data.json().dateBegin);
        $$("date_end").setValue(data.json().dateEnd);
      });
  }
}
