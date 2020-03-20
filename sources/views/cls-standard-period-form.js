import { JetView } from "webix-jet";
import {
  ROOT_URL,
  CLS_STANDARD_PERIOD,
  ACTION_CREATE,
  ACTION_UPDATE
} from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";

export default class DataView extends JetView {
  config() {
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
              click: () => this.app.show("/top/cls-standard-period")
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
              view: "text",
              label: polyglot.t("period_type"),
              id: "period_type"
            },
            {
              view: "datepicker",
              id: "date_begin",
              label: polyglot.t("date_begin")
              // timepicker: true
            },
            {
              view: "datepicker",
              id: "date_end",
              label: polyglot.t("date_end")
              // timepicker: true
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("save"),
                  id: "save"
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

  init() {}

  urlChange(view, url) {
    $$("save").attachEvent("onItemClick", () => this.saveRow());

    $$("delete").attachEvent("onItemClick", () =>
      this.deleteRow(url[0].params.id)
    );

    $$("update").attachEvent("onItemClick", () =>
      this.updateRow(url[0].params.id, CLS_STANDARD_PERIOD)
    );

    webix
      .ajax()
      .get(ROOT_URL + CLS_STANDARD_PERIOD + "/" + url[0].params.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("period_type").setValue(data.json().periodType);
        $$("date_begin").setValue(data.json().dateBegin);
        $$("date_end").setValue(data.json().dateEnd);
      });
  }

  saveRow() {
    const format = webix.Date.dateToStr("%Y-%m-%d");
    const url = ROOT_URL + CLS_STANDARD_PERIOD + ACTION_CREATE;
    const item = {
      name: $$("name").getValue(),
      number: $$("number").getValue(),
      periodType: $$("period_type").getValue(),
      dateBegin: format($$("date_begin").getValue()),
      dateEnd: format($$("date_end").getValue())
    };

    webix
      .ajax()
      .headers({
        "Content-Type": "application/json"
      })
      .post(url, item)
      .then(data => this.setBlank());
  }

  updateRow(id) {
    const urlPut = ROOT_URL + CLS_STANDARD_PERIOD + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_STANDARD_PERIOD + "/" + id;
    const format = webix.Date.dateToStr("%Y-%m-%d");

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        const item = data.json();
        item.name = $$("name").getValue();
        item.number = $$("number").getValue();
        item.periodType = $$("period_type").getValue();
        item.dateBegin = format($$("date_begin").getValue());
        item.dateEnd = format($$("date_end").getValue());

        webix
          .ajax()
          .headers({
            "Content-Type": "application/json"
          })
          .put(urlPut, item)
          .then(data => this.setBlank());
      });
  }

  deleteRow(id) {
    const url = ROOT_URL + CLS_STANDARD_PERIOD + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$("name").setValue("");
    $$("number").setValue("");
    $$("period_type").setValue("");
    $$("date_begin").setValue("");
    $$("date_end").setValue("");
  }
}
