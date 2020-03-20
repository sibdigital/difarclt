import { JetView } from "webix-jet";
import { CLS_FIELD, CLS_ORGANIZATION, ROOT_URL } from "~/util/constants";
import { polyglot } from "jet-locales/ru";
import {
  fillCombo,
  setDependency,
  saveRow,
  deleteRow,
  updateRow
} from "~/util/api";

export default class FieldFormView extends JetView {
  config() {
    this.item = {
      name: "",
      number: "",
      clsOrganizationByIdOrganization: null
    };

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
              click: () => this.app.show("/top/cls-field")
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
            {
              view: "text",
              label: polyglot.t("name"),
              id: "name"
            },
            {
              view: "text",
              label: polyglot.t("number"),
              id: "number"
            },
            {
              cols: [
                {
                  view: "combo",
                  id: "combo1",
                  label: polyglot.t("organization"),
                  options: {}
                },
                {
                  view: "button",
                  id: "modal_open",
                  width: 50,
                  click: () => {
                    webix.ui({
                      view: "window",
                      position: "center",
                      height: 400,
                      width: 400,
                      close: true,
                      modal: true,
                      id: "mywin",
                      // body: dt.config()
                      body: {
                        view: "datatable",
                        columnWidth: 200,
                        url: ROOT_URL + CLS_ORGANIZATION,
                        select: true, //enables selection
                        columns: [
                          { id: "name", header: polyglot.t("name") },
                          { id: "number", header: polyglot.t("number") }
                        ],
                        on: {
                          onItemDblClick(id) {
                            $$("combo1").setValue(id);
                            $$("mywin").close();
                          }
                        }
                      }
                    });
                    $$("mywin").show();
                  }
                }
              ]
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("save"),
                  id: "save",
                  click: () => saveRow(CLS_FIELD, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_FIELD, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("update"),
                  id: "update",
                  click: () => updateRow(CLS_FIELD, this.item)
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

    $$("combo1").attachEvent("onChange", value => {
      setDependency(
        CLS_ORGANIZATION,
        value,
        this.item,
        "clsOrganizationByIdOrganization"
      );
    });

    fillCombo(CLS_ORGANIZATION, "combo1");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .get(ROOT_URL + CLS_FIELD + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("combo1").setValue(data.json().clsOrganizationByIdOrganization.id);
      });
  }
}
