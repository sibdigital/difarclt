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
import { polyglot } from "jet-locales/ru.js";

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
              label: polyglot.t("back"),
              click: () => this.app.show("/top/cls-arbitrary-period")
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
            { view: "text", label: polyglot.t("begin_age"), id: "begin_age" },
            { view: "text", label: polyglot.t("end_age"), id: "end_age" },
            {
              view: "combo",
              id: "combo1",
              label: polyglot.t("organization"),
              options: {}
            },
            {
              view: "combo",
              id: "combo2",
              label: polyglot.t("standard_period"),
              options: {}
            },
            {
              view: "combo",
              id: "combo3",
              label: polyglot.t("district"),
              options: {}
            },
            {
              view: "combo",
              id: "combo4",
              label: polyglot.t("region"),
              options: {}
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("save"),
                  id: "save",
                  click: () => saveRow(CLS_ARBITRARY_PERIOD, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_ARBITRARY_PERIOD, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("update"),
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

    $$("combo1").attachEvent("onChange", value => {
      setDependency(
        CLS_ORGANIZATION,
        value,
        this.item,
        "clsOrganizationByIdOrganization"
      );
    });

    $$("combo2").attachEvent("onChange", value => {
      setDependency(
        CLS_STANDARD_PERIOD,
        value,
        this.item,
        "clsStandardPeriodByIdStandardPeriod"
      );
    });

    $$("combo3").attachEvent("onChange", value => {
      setDependency(CLS_DISTRICT, value, this.item, "clsDistrictByIdDistrict");
    });

    $$("combo4").attachEvent("onChange", value => {
      setDependency(CLS_REGION, value, this.item, "clsRegionByIdRegion");
    });

    fillCombo(CLS_ORGANIZATION, "combo1");
    fillCombo(CLS_STANDARD_PERIOD, "combo2");
    fillCombo(CLS_DISTRICT, "combo3");
    fillCombo(CLS_REGION, "combo4");
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
        $$("combo1").setValue(data.json().clsOrganizationByIdOrganization.id);
        $$("combo2").setValue(
          data.json().clsStandardPeriodByIdStandardPeriod.id
        );
        $$("combo3").setValue(data.json().clsDistrictByIdDistrict.id);
        $$("combo4").setValue(data.json().clsRegionByIdRegion.id);
      });
  }
}
