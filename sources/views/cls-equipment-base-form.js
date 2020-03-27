import { JetView } from "webix-jet";
import {
  CLS_EQUIPMENT_BASE,
  CLS_ORGANIZATION,
  CLS_DEPART,
  CLS_DISTRICT,
  CLS_RANCH,
  ROOT_URL
} from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";
import {
  fillCombo,
  setDependency,
  saveRow,
  deleteRow,
  updateRow
} from "~/util/api";
import { DepartWindow, DistrictWindow } from "~/util/modal";

export default class EquipmentBaseView extends JetView {
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
              label: polyglot.t("form.back"),
              click: () => this.app.show("/top/cls-equipment-base")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 100,
              label: polyglot.t("form.form")
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
            { view: "text", label: polyglot.t("base.number"), id: "number" },
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
                  id: "district_combo",
                  label: polyglot.t("dependencies.district"),
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
              cols: [
                {
                  view: "combo",
                  id: "ranch_combo",
                  label: polyglot.t("ranch"),
                  options: {}
                },
                {
                  view: "button",
                  width: 50,
                  click: () => {
                    const win = this.ui(RanchWindow);
                    $$("ranch_win").show();
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
                  click: () => saveRow(CLS_EQUIPMENT_BASE, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_EQUIPMENT_BASE, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () => updateRow(CLS_EQUIPMENT_BASE, this.item, this.id)
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

    $$("ranch_combo").attachEvent("onChange", value => {
      setDependency(CLS_RANCH, value, this.item, "clsRanchByIdRanch");
    });

    fillCombo(CLS_ORGANIZATION, "organization_combo");
    fillCombo(CLS_DEPART, "depart_combo");
    fillCombo(CLS_DISTRICT, "district_combo");
    fillCombo(CLS_RANCH, "ranch_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .get(ROOT_URL + CLS_EQUIPMENT_BASE + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("organization_combo").setValue(
          data.json().clsOrganizationByIdOrganization.id
        );
        $$("depart_combo").setValue(data.json().clsDepartByIdDepart.id);
        $$("district_combo").setValue(data.json().clsDistrictByIdDistrict.id);
        $$("ranch_combo").setValue(data.json().clsRanchByIdRanch.id);
      });
  }
}
