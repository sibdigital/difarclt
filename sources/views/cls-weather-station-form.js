import { JetView } from "webix-jet";
import {
  CLS_WEATHER_STATION,
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

export default class WeatherStationFormView extends JetView {
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
              click: () => this.app.show("/top/cls-weather-station")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 150,
              label: polyglot.t("dependencies.weather_station")
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
                  click: () => saveRow(CLS_WEATHER_STATION, this.item)
                },
                {
                  view: "button",
                  value: polyglot.t("form.delete"),
                  id: "delete",
                  click: () => deleteRow(CLS_WEATHER_STATION, this.id)
                },
                {
                  view: "button",
                  value: polyglot.t("form.update"),
                  id: "update",
                  click: () =>
                    updateRow(CLS_WEATHER_STATION, this.item, this.id)
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

    fillCombo(CLS_ORGANIZATION, "organization_combo");
  }

  urlChange(view, url) {
    this.id = url[0].params.id;
    webix
      .ajax()
      .headers({
        Authorization: webix.storage.local.get("auth")
      })
      .get(ROOT_URL + CLS_WEATHER_STATION + "/" + this.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("organization_combo").setValue(
          data.json().clsOrganizationByIdOrganization.id
        );
      });
  }
}
