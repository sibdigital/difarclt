import { JetView } from "webix-jet";
import {
  CLS_RESOURCE,
  FORM_NAME,
  FORM_CODE,
  FORM_NUMBER,
  ROOT_URL
} from "~/util/constants.js";
import { saveRow, deleteRow, updateRow } from "~/util/table-operations.js";
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
              click: () => this.app.show("/top/cls-resource")
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
            { view: "text", label: polyglot.t("name"), id: FORM_NAME },
            { view: "text", label: polyglot.t("code"), id: FORM_CODE },
            { view: "text", label: polyglot.t("number"), id: FORM_NUMBER },
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
    $$("save").attachEvent("onItemClick", () =>
      saveRow.call(this, CLS_RESOURCE)
    );

    $$("delete").attachEvent("onItemClick", () =>
      deleteRow.call(this, url[0].params.id, CLS_RESOURCE)
    );

    $$("update").attachEvent("onItemClick", () =>
      updateRow.call(this, url[0].params.id, CLS_RESOURCE)
    );

    webix
      .ajax()
      .get(ROOT_URL + CLS_RESOURCE + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$(FORM_CODE).setValue(data.json().code);
      });
  }
}
