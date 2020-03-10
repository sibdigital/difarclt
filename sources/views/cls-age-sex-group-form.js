import { JetView } from "webix-jet";
import {
  ROOT_URL,
  CLS_AGE_SEX_GROUP,
  ACTION_CREATE,
  ACTION_UPDATE,
  FORM_NAME,
  FORM_CODE,
  FORM_NUMBER
} from "~/util/constants.js";

export default class AgeSexGroupView extends JetView {
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
              click: () => this.app.show("/top/cls-age-sex-group")
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
              view: "combo",
              placeholder: "Sex",
              id: "sex",
              options: [
                { id: 1, value: "М" },
                { id: 2, value: "Ж" }
              ]
            },
            { view: "text", placeholder: "Begin age", id: "begin_age" },
            { view: "text", placeholder: "End age", id: "end_age" },
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
      this.updateRow(url[0].params.id, CLS_AGE_SEX_GROUP)
    );

    webix
      .ajax()
      .get(ROOT_URL + CLS_AGE_SEX_GROUP + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$(FORM_CODE).setValue(data.json().code);
        $$("sex").setValue(data.json().sex);
        $$("begin_age").setValue(data.json().beginAge);
        $$("end_age").setValue(data.json().endAge);
      });
  }

  saveRow() {
    const url = ROOT_URL + CLS_AGE_SEX_GROUP + ACTION_CREATE;
    const item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue(),
      code: $$(FORM_CODE).getValue(),
      sex: $$("sex").getValue(),
      beginAge: $$("begin_age").getValue(),
      endAge: $$("end_age").getValue()
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
    const urlPut = ROOT_URL + CLS_AGE_SEX_GROUP + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_AGE_SEX_GROUP + "/" + id;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        const item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();
        item.code = $$(FORM_CODE).getValue();
        item.sex = $$("sex").getValue();
        item.beginAge = $$("begin_age").getValue();
        item.endAge = $$("end_age").getValue();

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
    const url = ROOT_URL + CLS_AGE_SEX_GROUP + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$(FORM_NAME).setValue("");
    $$(FORM_NUMBER).setValue("");
    $$(FORM_CODE).setValue("");
    $$("sex").setValue("");
    $$("begin_age").setValue("");
    $$("end_age").setValue("");
  }
}
