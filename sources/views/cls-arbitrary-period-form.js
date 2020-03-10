import { JetView } from "webix-jet";
import {
  CLS_ARBITRARY_PERIOD,
  CLS_ORGANIZATION,
  CLS_STANDARD_PERIOD,
  CLS_DISTRICT,
  CLS_REGION,
  FORM_NAME,
  FORM_NUMBER,
  ACTION_CREATE,
  ACTION_UPDATE
} from "~/util/constants.js";
import { ROOT_URL } from "~/util/constants.js";

export default class DataView extends JetView {
  config() {
    return {
      rows: [
        {
          view: "toolbar",
          elements: [
            {
              view: "button",
              width: 100,
              css: "webix_transparent",
              label: "Back",
              click: () => this.app.show("/top/cls-arbitrary-period")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 100,
              label: "Form"
            }
          ]
        },
        {
          view: "form",
          id: "form",
          elements: [
            { view: "text", placeholder: "Name", id: FORM_NAME },
            { view: "text", placeholder: "Number", id: FORM_NUMBER },
            { view: "text", placeholder: "Begin age", id: "begin_age" },
            { view: "text", placeholder: "End age", id: "end_age" },
            {
              view: "combo",
              id: "combo1",
              options: {}
            },
            {
              view: "combo",
              id: "combo2",
              options: {}
            },
            {
              view: "combo",
              id: "combo3",
              options: {}
            },
            {
              view: "combo",
              id: "combo4",
              options: {}
            },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: "Save",
                  id: "save"
                },
                {
                  view: "button",
                  value: "Delete",
                  id: "delete"
                },
                {
                  view: "button",
                  value: "Update",
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
    this.fillCombo(CLS_ORGANIZATION, "combo1");
    this.fillCombo(CLS_STANDARD_PERIOD, "combo2");
    this.fillCombo(CLS_DISTRICT, "combo3");
    this.fillCombo(CLS_REGION, "combo4");
  }

  urlChange(view, url) {
    $$("save").attachEvent("onItemClick", () => this.saveRow());

    $$("delete").attachEvent("onItemClick", () =>
      this.deleteRow(url[0].params.id)
    );

    $$("update").attachEvent("onItemClick", () =>
      this.updateRow(url[0].params.id)
    );

    webix
      .ajax()
      .get(ROOT_URL + CLS_ARBITRARY_PERIOD + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
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

  fillCombo(entity, combo) {
    webix
      .ajax()
      .get(ROOT_URL + entity)
      .then(data => {
        const list = $$(combo)
          .getPopup()
          .getList();
        const values = [];

        data.json().forEach(entry => {
          values.push({ id: entry.id, value: entry.name });
        });

        list.clearAll();
        list.parse(values);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_ARBITRARY_PERIOD + ACTION_CREATE;
    const url1 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_STANDARD_PERIOD + "/" + $$("combo2").getValue();
    const url3 = ROOT_URL + CLS_DISTRICT + "/" + $$("combo3").getValue();
    const url4 = ROOT_URL + CLS_REGION + "/" + $$("combo4").getValue();

    let item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue()
    };

    webix
      .ajax()
      .get(url1)
      .then(data => {
        item.clsOrganizationByIdOrganization = data.json();

        webix
          .ajax()
          .get(url2)
          .then(data => {
            item.clsStandardPeriodByIdStandardPeriod = data.json();

            webix
              .ajax()
              .get(url3)
              .then(data => {
                item.clsDistrictByIdDistrict = data.json();

                webix
                  .ajax()
                  .get(url4)
                  .then(data => {
                    item.clsRegionByIdRegion = data.json();

                    webix
                      .ajax()
                      .headers({
                        "Content-Type": "application/json"
                      })
                      .post(urlPost, item)
                      .then(data => this.setBlank());
                  });
              });
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  updateRow(id) {
    const urlPut = ROOT_URL + CLS_ARBITRARY_PERIOD + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_ARBITRARY_PERIOD + "/" + id;
    const url1 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_STANDARD_PERIOD + "/" + $$("combo2").getValue();
    const url3 = ROOT_URL + CLS_DISTRICT + "/" + $$("combo3").getValue();
    const url4 = ROOT_URL + CLS_REGION + "/" + $$("combo4").getValue();

    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();

        webix
          .ajax()
          .get(url1)
          .then(data => {
            item.clsOrganizationByIdOrganization = data.json();

            webix
              .ajax()
              .get(url2)
              .then(data => {
                item.clsStandardPeriodByIdStandardPeriod = data.json();

                webix
                  .ajax()
                  .get(url3)
                  .then(data => {
                    item.clsDistrictByIdDistrict = data.json();

                    webix
                      .ajax()
                      .get(url4)
                      .then(data => {
                        item.clsRegionByIdRegion = data.json();

                        webix
                          .ajax()
                          .headers({
                            "Content-Type": "application/json"
                          })
                          .put(urlPut, item)
                          .then(data => this.setBlank());
                      });
                  });
              });
          });
      });
  }

  deleteRow(id) {
    const url = ROOT_URL + CLS_ARBITRARY_PERIOD + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$(FORM_NAME).setValue("");
    $$(FORM_NUMBER).setValue("");
    $$("combo1").setValue("");
    $$("combo2").setValue("");
    $$("combo3").setValue("");
    $$("combo4").setValue("");
  }
}
