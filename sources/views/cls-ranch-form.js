import { JetView } from "webix-jet";
import {
  CLS_RANCH,
  CLS_ORGANIZATION,
  CLS_DEPART,
  CLS_DISTRICT,
  ROOT_URL
} from "~/util/constants.js";
import { DistrictWindow, DepartWindow } from "~/util/modal";
import { polyglot } from "jet-locales/ru.js";

export default class RanchView extends JetView {
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
              click: () => this.app.show("/top/cls-ranch")
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
                  id: "organization_combo",
                  label: polyglot.t("organization"),
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
                  id: "depart_combo",
                  label: polyglot.t("depart"),
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
                  id: "district_combo",
                  label: polyglot.t("district"),
                  options: {}
                },
                {
                  view: "button",
                  width: 50,
                  click: () => {
                    const win = this.ui(DistrictWindow);
                    $$("district_win").show();
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
                  click: () => saveRow(CLS_RANCH, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_RANCH, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("update"),
                  id: "update",
                  click: () => updateRow(CLS_RANCH, this.item, this.id)
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

    $$("depart_combo").attachEvent("onChange", value => {
      setDependency(CLS_DEPART, value, this.item, "clsDepartByIdDepart");
    });

    $$("district_combo").attachEvent("onChange", value => {
      setDependency(CLS_DISTRICT, value, this.item, "clsDistrictByIdDistrict");
    });

    fillCombo(CLS_ORGANIZATION, "organization_combo");
    fillCombo(CLS_DEPART, "depart_combo");
    fillCombo(CLS_DISTRICT, "district_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .get(ROOT_URL + CLS_RANCH + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("organization_combo").setValue(
          data.json().clsOrganizationByIdOrganization.id
        );
        $$("depart_combo").setValue(data.json().clsDepartByIdDepart.id);
        $$("district_combo").setValue(data.json().clsDistrictByIdDistrict.id);
      });
  }
}
