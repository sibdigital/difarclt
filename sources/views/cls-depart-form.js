import { JetView } from "webix-jet";
import {
  fillCombo,
  setDependency,
  saveRow,
  deleteRow,
  updateRow
} from "~/util/api";
import {
  CLS_DEPART,
  CLS_LEGAL_ENTITY,
  CLS_ORGANIZATION,
  ROOT_URL
} from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";
import { LegalEntityWindow } from "../util/modal";

export default class DepartFormView extends JetView {
  config() {
    this.item = {};
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
              click: () => this.app.show("/top/cls-depart")
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
            { view: "text", label: polyglot.t("name"), id: "name" },
            { view: "text", label: polyglot.t("number"), id: "number" },
            {
              cols: [
                {
                  view: "combo",
                  id: "legal_entity_win",
                  label: polyglot.t("legal_entity"),
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
              cols: [
                {
                  view: "combo",
                  id: "organization_combo",
                  label: polyglot.t("organization"),
                  options: {}
                },
                {
                  view: "button",
                  width: 50,
                  click: () => {
                    const win = this.ui(LegalEntityWindow);
                    $$("organization_win").show();
                  }
                }
              ]
            },
            {
              view: "checkbox",
              id: "separate",
              label: polyglot.t("separate"),
              value: 0
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("save"),
                  id: "save",
                  click: () => saveRow(CLS_DEPART, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_DEPART, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("update"),
                  id: "update",
                  click: () => {
                    updateRow(CLS_DEPART, this.item, this.id);
                  }
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

    $$("legal_entity_win").attachEvent("onChange", value => {
      setDependency(
        CLS_LEGAL_ENTITY,
        value,
        this.item,
        "clsLegalEntityByIdLegalEntity"
      );
    });

    $$("organization_combo").attachEvent("onChange", value => {
      setDependency(
        CLS_ORGANIZATION,
        value,
        this.item,
        "clsOrganizationByIdOrganization"
      );
    });

    $$("separate").attachEvent("onChange", value => {
      this.item.separate = value;
    });

    fillCombo(CLS_LEGAL_ENTITY, "legal_entity_win");
    fillCombo(CLS_ORGANIZATION, "organization_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .get(ROOT_URL + CLS_DEPART + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("legal_entity_win").setValue(
          data.json().clsLegalEntityByIdLegalEntity.id
        );
        $$("organization_combo").setValue(
          data.json().clsOrganizationByIdOrganization.id
        );
        $$("separate").setValue(data.json().separate);
      });
  }
}
