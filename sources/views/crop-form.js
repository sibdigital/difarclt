import { JetView } from "webix-jet";
import {
  CLS_CROP,
  FORM_NAME,
  FORM_CODE,
  FORM_NUMBER
} from "~/util/constants.js";
import { saveRow, deleteRow, updateRow } from "~/util/table-operations.js";

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
              click: () => this.app.show("/top/crop")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 100,
              label: "Crom Form"
            }
          ]
        },
        {
          view: "form",
          id: "cropForm",
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
                  click: () => saveRow.call(this, "cropTable", CLS_CROP)
                },
                {
                  view: "button",
                  value: "Delete",
                  click: () => deleteRow.call(this, "cropTable", CLS_CROP)
                },
                {
                  view: "button",
                  value: "Update",
                  click: () => updateRow.call(this, "cropTable", CLS_CROP)
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
    webix
      .ajax()
      .get("http://localhost:8080/crop/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$(FORM_CODE).setValue(data.json().code);
      });
  }
}
