import { JetView } from "webix-jet";
import {
  CLS_DEPART,
  CLS_LEGAL_ENTITY,
  CLS_ORGANIZATION,
  FORM_NAME,
  FORM_NUMBER,
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
              click: () => this.app.show("/top/cls-depart")
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
            {
              view: "combo",
              id: "combo1",
              placeholder: "Legal entity",
              options: {}
            },
            {
              view: "combo",
              id: "combo2",
              options: {}
            },
            {
              view: "checkbox",
              id: "separate",
              label: "Separate",
              value: 0
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
    this.fillCombo("combo1", CLS_LEGAL_ENTITY);
    this.fillCombo("combo2", CLS_ORGANIZATION);
  }

  fillCombo(combo, entity) {
    webix
      .ajax()
      .get(ROOT_URL + entity)
      .then(data => {
        const list = $$(combo)
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
      .get(ROOT_URL + CLS_DEPART + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$("combo1").setValue(data.json().clsLegalEntityByIdLegalEntity.id);
        $$("combo2").setValue(data.json().clsOrganizationByIdOrganization.id);
        $$("separate").setValue(data.json().separate);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_DEPART + ACTION_CREATE;
    const url1 = ROOT_URL + CLS_LEGAL_ENTITY + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo2").getValue();

    let item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue(),
      separate: $$("separate").getValue() == 1 ? true : false
    };

    webix
      .ajax()
      .get(url1)
      .then(data => {
        item.clsLegalEntityByIdLegalEntity = data.json();

        webix
          .ajax()
          .get(url2)
          .then(data => {
            item.clsOrganizationByIdOrganization = data.json();

            console.log(item);

            webix
              .ajax()
              .headers({
                "Content-Type": "application/json"
              })
              .post(urlPost, item)
              .then(data => this.setBlank());
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  updateRow(id) {
    const urlPut = ROOT_URL + CLS_DEPART + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_DEPART + "/" + id;
    const url1 = ROOT_URL + CLS_LEGAL_ENTITY + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo2").getValue();
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();
        item.separate = $$("separate").getValue() == 1 ? "true" : "false";

        webix
          .ajax()
          .get(url1)
          .then(data => {
            item.clsLegalEntityByIdLegalEntity = data.json();

            webix
              .ajax()
              .get(url2)
              .then(data => {
                item.clsOrganizationByIdOrganization = data.json();

                webix
                  .ajax()
                  .headers({
                    "Content-Type": "application/json"
                  })
                  .put(urlPut, item)
                  .then(data => this.setBlank());
              });
          });
      });
  }

  deleteRow(id) {
    const url = ROOT_URL + CLS_DEPART + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$(FORM_NAME).setValue("");
    $$(FORM_NUMBER).setValue("");
    $$("combo1").setValue("");
    $$("combo2").setValue("");
    $$("separate").setValue(0);
  }
}
