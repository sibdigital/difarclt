import { JetView } from "webix-jet";
import {
  ROOT_URL,
  CLS_STANDARD_PERIOD,
  ACTION_CREATE,
  ACTION_UPDATE,
  FORM_NAME,
  FORM_NUMBER
} from "~/util/constants.js";

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
              label: "Back",
              click: () => this.app.show("/top/cls-standard-period")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 100,
              label: "Form"
            }
          ]
        },
        {
          view: "form",
          id: "form",
          elements: [
            { view: "text", placeholder: "Name", id: FORM_NAME },
            { view: "text", placeholder: "Number", id: FORM_NUMBER },
            { view: "text", placeholder: "Period type", id: "period_type" },
            {
              view: "datepicker",
              id: "date_begin",
              placeholder: "Date begin"
              // timepicker: true
            },
            {
              view: "datepicker",
              id: "date_end",
              placeholder: "Date end"
              // timepicker: true
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: "Save",
                  id: "save"
                },
                {
                  view: "button",
                  value: "Delete",
                  id: "delete"
                },
                {
                  view: "button",
                  value: "Update",
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
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$("period_type").setValue(data.json().periodType);
        $$("date_begin").setValue(data.json().dateBegin);
        $$("date_end").setValue(data.json().dateEnd);
      });
  }

  saveRow() {
    const format = webix.Date.dateToStr("%Y-%m-%d");
    const url = ROOT_URL + CLS_STANDARD_PERIOD + ACTION_CREATE;
    const item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue(),
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
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();
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
    $$(FORM_NAME).setValue("");
    $$(FORM_NUMBER).setValue("");
    $$("period_type").setValue("");
    $$("date_begin").setValue("");
    $$("date_end").setValue("");
  }
}
