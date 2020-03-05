import { JetView } from "webix-jet";
import {
  CLS_KIND_ANIMAL,
  FORM_NAME,
  FORM_CODE,
  FORM_NUMBER
} from "~/util/constants.js";
import { saveRow, deleteRow, updateRow } from "~/util/table-operations.js";
import { ROOT_URL } from "~/util/constants.js";

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
              click: () => this.app.show("/top/cls-kind-animal")
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
            { view: "text", placeholder: "Code", id: FORM_CODE },
            { view: "text", placeholder: "Number", id: FORM_NUMBER },
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
    $$("save").attachEvent("onItemClick", () =>
      saveRow.call(this, CLS_KIND_ANIMAL)
    );

    $$("delete").attachEvent("onItemClick", () =>
      deleteRow.call(this, url[0].params.id, CLS_KIND_ANIMAL)
    );

    $$("update").attachEvent("onItemClick", () =>
      updateRow.call(this, url[0].params.id, CLS_KIND_ANIMAL)
    );

    webix
      .ajax()
      .get(ROOT_URL + CLS_KIND_ANIMAL + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$(FORM_CODE).setValue(data.json().code);
      });
  }
}
