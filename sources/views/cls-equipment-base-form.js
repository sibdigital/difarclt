import { JetView } from "webix-jet";
import {
  CLS_EQUIPMENT_BASE,
  CLS_ORGANIZATION,
  CLS_DEPART,
  CLS_DISTRICT,
  CLS_RANCH,
  ACTION_CREATE,
  ACTION_UPDATE,
  ROOT_URL
} from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";
import { saveRow, fillCombo } from "../util/api";

export default class DataView extends JetView {
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
              click: () => this.app.show("/top/cls-equipment-base")
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
            { view: "text", label: polyglot.t("number"), id: "number" },
            {
              view: "combo",
              id: "combo1",
              label: polyglot.t("organization"),
              options: {}
            },
            {
              view: "combo",
              id: "combo2",
              label: polyglot.t("depart"),
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
              label: polyglot.t("ranch"),
              options: {}
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("save"),
                  id: "save",
                  click: () => saveRow(CLS_EQUIPMENT_BASE, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("delete"),
                  id: "delete"
                },
                {
                  view: "button",
                  value: polyglot.t("update"),
                  id: "update"
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

    $$("combo2").attachEvent("onChange", value => {
      setDependency(CLS_DEPART, value, this.item, "clsDepartByIdDepart");
    });

    $$("combo3").attachEvent("onChange", value => {
      setDependency(CLS_DISTRICT, value, this.item, "clsDistrictByIdDistrict");
    });

    $$("combo4").attachEvent("onChange", value => {
      setDependency(CLS_RANCH, value, this.item, "clsRanchByIdRanch");
    });

    fillCombo(CLS_ORGANIZATION, "combo1");
    fillCombo(CLS_DEPART, "combo2");
    fillCombo(CLS_DISTRICT, "combo3");
    fillCombo(CLS_RANCH, "combo4");
  }

  urlChange(view, url) {
    // this.id = url[0].params.id;
    const id = url[0].params.id;

    webix
      .ajax()
      .get(ROOT_URL + CLS_EQUIPMENT_BASE + "/" + id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("combo1").setValue(data.json().clsOrganizationByIdOrganization.id);
        $$("combo2").setValue(data.json().clsDepartByIdDepart.id);
        $$("combo3").setValue(data.json().clsDistrictByIdDistrict.id);
        $$("combo4").setValue(data.json().clsRanchByIdRanch.id);
      });
  }
}
