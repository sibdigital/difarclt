import { JetView } from "webix-jet";
import {
  CLS_ARBITRARY_PERIOD,
  CLS_ORGANIZATION,
  CLS_STANDARD_PERIOD,
  CLS_DISTRICT,
  CLS_REGION
} from "~/util/constants.js";
import { ROOT_URL } from "~/util/constants.js";
import {
  saveRow,
  updateRow,
  deleteRow,
  fillCombo,
  setDependency
} from "~/util/api";
import { OrganizationWindow } from "~/util/modal";
import { polyglot } from "jet-locales/ru";
import { DistrictWindow, RegionalWindow } from "../util/modal";

export default class ArbitraryPeriodFormView extends JetView {
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
              label: polyglot.t("form.back"),
              click: () => this.app.show("/top/cls-arbitrary-period")
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
            { view: "text", label: polyglot.t("base.name"), id: "name" },
            { view: "text", label: polyglot.t("base.number"), id: "number" },
            {
              view: "text",
              label: polyglot.t("properties.begin_age"),
              id: "begin_age"
            },
            {
              view: "text",
              label: polyglot.t("properties.end_age"),
              id: "end_age"
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
                  id: "standard_period_combo",
                  label: polyglot.t("standard_period"),
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
                  id: "region_combo",
                  label: polyglot.t("dependencies.region"),
                  options: {}
                },
                {
                  view: "button",
                  width: 50,
                  click: () => {
                    const win = this.ui(RegionWindow);
                    $$("region_win").show();
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
                  click: () => saveRow(CLS_ARBITRARY_PERIOD, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_ARBITRARY_PERIOD, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () => updateRow(CLS_ARBITRARY_PERIOD, this.item)
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

    $$("begin_age").attachEvent("onChange", value => {
      this.item.beginAge = value;
    });

    $$("end_age").attachEvent("onChange", value => {
      this.item.endAge = value;
    });

    $$("organization_combo").attachEvent("onChange", value => {
      setDependency(
        CLS_ORGANIZATION,
        value,
        this.item,
        "clsOrganizationByIdOrganization"
      );
    });

    $$("standard_period_combo").attachEvent("onChange", value => {
      setDependency(
        CLS_STANDARD_PERIOD,
        value,
        this.item,
        "clsStandardPeriodByIdStandardPeriod"
      );
    });

    $$("district_combo").attachEvent("onChange", value => {
      setDependency(CLS_DISTRICT, value, this.item, "clsDistrictByIdDistrict");
    });

    $$("region_combo").attachEvent("onChange", value => {
      setDependency(CLS_REGION, value, this.item, "clsRegionByIdRegion");
    });

    fillCombo(CLS_ORGANIZATION, "organization_combo");
    fillCombo(CLS_STANDARD_PERIOD, "standard_period_combo");
    fillCombo(CLS_DISTRICT, "district_combo");
    fillCombo(CLS_REGION, "region_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;

    webix
      .ajax()
      .get(ROOT_URL + CLS_ARBITRARY_PERIOD + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("begin_age").setValue(data.json().beginAge);
        $$("end_age").setValue(data.json().endAge);
        $$("organization_combo").setValue(
          data.json().clsOrganizationByIdOrganization.id
        );
        $$("standard_period_combo").setValue(
          data.json().clsStandardPeriodByIdStandardPeriod.id
        );
        $$("district_combo").setValue(data.json().clsDistrictByIdDistrict.id);
        $$("region_combo").setValue(data.json().clsRegionByIdRegion.id);
      });
  }
}
