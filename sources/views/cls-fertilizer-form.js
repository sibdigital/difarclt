import { JetView } from "webix-jet";
import {
  CLS_FERTILIZER,
  CLS_UNIT,
  FORM_NAME,
  FORM_NUMBER,
  FORM_CODE,
  ACTION_CREATE,
  ACTION_UPDATE
} from "~/util/constants.js";
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
              click: () => this.app.show("/top/cls-fertilizer")
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
            { view: "text", placeholder: "Code", id: FORM_CODE },
            { view: "text", placeholder: "Max concum", id: "max_consum" },
            { view: "text", placeholder: "Min concum", id: "min_consum" },
            {
              view: "combo",
              id: "combo1",
              placeholder: "Unit",
              options: {}
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

  init() {
    webix
      .ajax()
      .get(ROOT_URL + CLS_UNIT)
      .then(function(data) {
        const list = $$("combo1")
          .getPopup()
          .getList();
        const values = [];
        data.json().forEach(entry => {
          values.push({ id: entry.id, value: entry.name });
        });

        list.clearAll();
        list.parse(values);
      });
  }

  urlChange(view, url) {
    $$("save").attachEvent("onItemClick", () => this.saveRow());

    $$("delete").attachEvent("onItemClick", () =>
      this.deleteRow(url[0].params.id)
    );

    $$("update").attachEvent("onItemClick", () =>
      this.updateRow(url[0].params.id)
    );

    webix
      .ajax()
      .get(ROOT_URL + CLS_FERTILIZER + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$(FORM_CODE).setValue(data.json().code);
        $$("max_consum").setValue(data.json().maxConsum);
        $$("min_consum").setValue(data.json().minConsum);
        $$("combo1").setValue(data.json().clsUnitByIdUnit);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_FERTILIZER + ACTION_CREATE;
    const urlGet = ROOT_URL + CLS_UNIT + "/" + $$("combo1").getValue();

    let item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue(),
      code: $$(FORM_CODE).getValue(),
      maxConsum: $$("max_consum").getValue(),
      minConsum: $$("min_consum").getValue()
    };

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item.clsUnitByIdUnit = data.json();

        webix
          .ajax()
          .headers({
            "Content-Type": "application/json"
          })
          .post(urlPost, item)
          .then(data => {
            this.setBlank();
          });
      });
  }

  updateRow(id) {
    const urlPut = ROOT_URL + CLS_FERTILIZER + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_FERTILIZER + "/" + id;
    const urlUnit = ROOT_URL + CLS_UNIT + "/" + $$("combo1").getValue();
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();
        item.code = $$(FORM_CODE).getValue();
        item.maxConsum = $$("max_consum").getValue();
        item.minConsum = $$("min_consum").getValue();

        webix
          .ajax()
          .get(urlUnit)
          .then(data => {
            item.clsUnitByIdUnit = data.json();

            webix
              .ajax()
              .headers({
                "Content-Type": "application/json"
              })
              .put(urlPut, item)
              .then(data => this.setBlank());
          });
      });
  }

  deleteRow(id) {
    const url = ROOT_URL + CLS_FERTILIZER + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$(FORM_NAME).setValue("");
    $$(FORM_NUMBER).setValue("");
    $$(FORM_CODE).setValue("");
    $$("combo1").setValue("");
    $$("max_consum").setValue("");
    $$("min_consum").setValue("");
  }
}
