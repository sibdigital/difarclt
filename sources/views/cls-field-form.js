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
import { OrganizationWindow } from "~/util/modal";

export default class FieldFormView extends JetView {
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
              click: () => this.app.show("/top/cls-field")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 150,
              label: polyglot.t("dependencies.field")
            }
          ]
        },
        {
          view: "form",
          id: "form",
          elements: [
            {
              view: "text",
              label: polyglot.t("base.name"),
              id: "name"
            },
            {
              view: "text",
              label: polyglot.t("base.number"),
              id: "number"
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
                  click: () => saveRow(CLS_FIELD, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_FIELD, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
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

    $$("organization_combo").attachEvent("onChange", value => {
      setDependency(
        CLS_ORGANIZATION,
        value,
        this.item,
        "clsOrganizationByIdOrganization"
      );
    });

    fillCombo.call(this, CLS_ORGANIZATION, "organization_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_FIELD + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("organization_combo").setValue(
          data.json().clsOrganizationByIdOrganization.id
        );
      });
  }
}
