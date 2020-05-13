import { JetView } from "webix-jet";
import {
  CLS_ORGANIZATION,
  CLS_LEGAL_ENTITY,
  ROOT_URL
} from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";
import {
  saveRow,
  deleteRow,
  updateRow,
  fillCombo,
  setDependency
} from "~/util/api";
import { LegalEntityWindow } from "~/util/modal";

export default class OrganizationView extends JetView {
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
              click: () => this.app.show("/top/cls-organization")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 150,
              label: polyglot.t("dependencies.organization")
            }
          ]
        },
        {
          view: "form",
          id: "form",
          elements: [
            { view: "text", label: polyglot.t("base.name"), id: "name" },
            { view: "text", label: polyglot.t("base.number"), id: "number" },
            { view: "text", label: polyglot.t("properties.inn"), id: "inn" },
            {
              cols: [
                {
                  view: "combo",
                  id: "legal_entity_combo",
                  label: polyglot.t("dependencies.legal_entity"),
                  options: {}
                },
                {
                  view: "button",
                  width: 50,
                  click: () => {
                    const win = this.ui(LegalEntityWindow);
                    $$("legal_entity_win").show();
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
                  click: () => saveRow(CLS_ORGANIZATION, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_ORGANIZATION, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () => updateRow(CLS_ORGANIZATION, this.item)
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

    $$("legal_entity_combo").attachEvent("onChange", value => {
      setDependency(
        CLS_LEGAL_ENTITY,
        value,
        this.item,
        "clsLegalEntityByIdLegalEntity"
      );
    });

    fillCombo(CLS_LEGAL_ENTITY, "legal_entity_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_ORGANIZATION + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("inn").setValue(data.json().inn);
        $$("legal_entity_combo").setValue(
          data.json().clsLegalEntityByIdLegalEntity.id
        );
      });
  }
}
