import { JetView } from "webix-jet";
import {
  CLS_EMPLOYEE,
  CLS_DEPART,
  CLS_ORGANIZATION,
  ROOT_URL
} from "~/util/constants.js";
import {
  fillCombo,
  setDependency,
  saveRow,
  deleteRow,
  updateRow
} from "~/util/api";
import { polyglot } from "jet-locales/ru.js";
import { DepartWindow, OrganizationWindow } from "~/util/modal";

export default class EmployeeFormView extends JetView {
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
              click: () => this.app.show("/top/cls-employee")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 150,
              label: polyglot.t("dependencies.employee")
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
              label: polyglot.t("properties.first_name"),
              id: "first_name"
            },
            {
              view: "text",
              label: polyglot.t("properties.surname"),
              id: "surname"
            },
            {
              view: "text",
              label: polyglot.t("properties.patronymic"),
              id: "patronymic"
            },
            {
              cols: [
                {
                  view: "combo",
                  id: "depart_combo",
                  label: polyglot.t("dependencies.depart"),
                  options: {}
                },
                {
                  view: "button",
                  width: 50,
                  click: () => {
                    const win = this.ui(DepartWindow);
                    $$("depart_win").show();
                  }
                }
              ]
            },

            {
              cols: [
                {
                  view: "combo",
                  id: "organization_combo",
                  label: polyglot.t("dependencies.organization"),
                  options: {}
                },
                {
                  view: "button",
                  width: 50,
                  click: () => {
                    const win = this.ui(OrganizationWindow);
                    $$("organization_win").show();
                  }
                }
              ]
            },

            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("form.save"),
                  id: "save",
                  click: () => saveRow(CLS_EMPLOYEE, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_EMPLOYEE, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () => updateRow(CLS_EMPLOYEE, this.item, this.id)
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

    $$("first_name").attachEvent("onChange", value => {
      this.item.firstname = value;
    });

    $$("surname").attachEvent("onChange", value => {
      this.item.surname = value;
    });

    $$("patronymic").attachEvent("onChange", value => {
      this.item.patronymic = value;
    });

    $$("depart_combo").attachEvent("onChange", value => {
      setDependency(CLS_DEPART, value, this.item, "clsDepartByIdDepart");
    });

    $$("organization_combo").attachEvent("onChange", value => {
      setDependency(
        CLS_ORGANIZATION,
        value,
        this.item,
        "clsOrganizationByIdOrganization"
      );
    });

    fillCombo(CLS_DEPART, "depart_combo");
    fillCombo(CLS_ORGANIZATION, "organization_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_EMPLOYEE + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("first_name").setValue(data.json().firstname);
        $$("surname").setValue(data.json().surname);
        $$("patronymic").setValue(data.json().patronymic);
        $$("depart_combo").setValue(data.json().clsDepartByIdDepart.id);
        $$("organization_combo").setValue(
          data.json().clsOrganizationByIdOrganization.id
        );
      });
  }
}
