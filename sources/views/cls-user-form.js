import { JetView } from "webix-jet";
import {
  CLS_USER,
  CLS_ORGANIZATION,
  CLS_EMPLOYEE,
  ROOT_URL
} from "~/util/constants.js";
import {
  fillCombo,
  setDependency,
  saveRow,
  deleteRow,
  updateRow
} from "~/util/api";
import { OrganizationWindow, EmployeeWindow } from "~/util/modal";
import { polyglot } from "jet-locales/ru.js";

export default class UserFormView extends JetView {
  config() {
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
              click: () => this.app.show("/top/cls-user")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 150,
              label: polyglot.t("dependencies.user")
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
              label: polyglot.t("properties.password"),
              id: "password"
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
              cols: [
                {
                  view: "combo",
                  id: "employee_combo",
                  label: polyglot.t("employee"),
                  options: {}
                },
                {
                  view: "button",
                  width: 50,
                  click: () => {
                    const win = this.ui(EmployeeWindow);
                    $$("employee_win").show();
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
                  click: () => saveRow(CLS_USER, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_USER, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () => updateRow(CLS_USER, this.item, this.id)
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

    $$("password").attachEvent("onChange", value => {
      this.item.password = value;
    });

    $$("organization_combo").attachEvent("onChange", value => {
      setDependency(
        CLS_ORGANIZATION,
        value,
        this.item,
        "clsOrganizationByIdOrganization"
      );
    });

    $$("employee_combo").attachEvent("onChange", value => {
      setDependency(CLS_EMPLOYEE, value, this.item, "clsEmployeeByIdEmployee");
    });

    fillCombo(CLS_ORGANIZATION, "organization_combo");
    fillCombo(CLS_EMPLOYEE, "employee_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_USER + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("password").setValue(data.json().password);
        $$("organization_combo").setValue(
          data.json().clsOrganizationByIdOrganization.id
        );
        $$("employee_combo").setValue(data.json().clsEmployeeByIdEmployee.id);
      });
  }
}
