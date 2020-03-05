import { JetView } from "webix-jet";
import {
  CLS_EQUIPMENT_BASE,
  CLS_ORGANIZATION,
  CLS_DEPART,
  CLS_DISTRICT,
  CLS_RANCH,
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
              click: () => this.app.show("/top/cls-equipment-base")
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
    webix
      .ajax()
      .get(ROOT_URL + CLS_ORGANIZATION)
      .then(data => {
        const list = $$("combo1")
          .getPopup()
          .getList();
        const values = [];

        data.json().forEach(entry => {
          values.push({ id: entry.id, value: entry.name });
        });

        list.clearAll();
        list.parse(values);
      });

    webix
      .ajax()
      .get(ROOT_URL + CLS_DEPART)
      .then(data => {
        const list = $$("combo2")
          .getPopup()
          .getList();
        const values = [];

        data.json().forEach(entry => {
          values.push({ id: entry.id, value: entry.name });
        });

        list.clearAll();
        list.parse(values);
      });

    webix
      .ajax()
      .get(ROOT_URL + CLS_DISTRICT)
      .then(data => {
        const list = $$("combo3")
          .getPopup()
          .getList();
        const values = [];

        data.json().forEach(entry => {
          values.push({ id: entry.id, value: entry.name });
        });

        list.clearAll();
        list.parse(values);
      });

    webix
      .ajax()
      .get(ROOT_URL + CLS_RANCH)
      .then(data => {
        const list = $$("combo4")
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
      .get(ROOT_URL + CLS_EQUIPMENT_BASE + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$("combo1").setValue(data.json().clsOrganizationByIdOrganization);
        $$("combo2").setValue(data.json().clsDepartByIdDepart);
        $$("combo3").setValue(data.json().clsDistrictByIdDistrict);
        $$("combo4").setValue(data.json().clsRanchByIdRanch);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_EQUIPMENT_BASE + ACTION_CREATE;
    const url1 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_DEPART + "/" + $$("combo2").getValue();
    const url3 = ROOT_URL + CLS_DISTRICT + "/" + $$("combo3").getValue();
    const url4 = ROOT_URL + CLS_RANCH + "/" + $$("combo4").getValue();

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
            item.clsDepartByIdDepart = data.json();

            webix
              .ajax()
              .get(url3)
              .then(data => {
                item.clsDistrictByIdDistrict = data.json();

                webix
                  .ajax()
                  .get(url4)
                  .then(data => {
                    item.clsRanchByIdRanch = data.json();

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
    const urlPut = ROOT_URL + CLS_EQUIPMENT_BASE + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_EQUIPMENT_BASE + "/" + id;
    const url1 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_DEPART + "/" + $$("combo2").getValue();
    const url3 = ROOT_URL + CLS_DISTRICT + "/" + $$("combo3").getValue();
    const url4 = ROOT_URL + CLS_RANCH + "/" + $$("combo4").getValue();

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
                item.clsDepartByIdDepart = data.json();

                webix
                  .ajax()
                  .get(url3)
                  .then(data => {
                    item.clsDistrictByIdDistrict = data.json();

                    webix
                      .ajax()
                      .get(url4)
                      .then(data => {
                        item.clsRanchByIdRanch = data.json();

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
    const url = ROOT_URL + CLS_EQUIPMENT_BASE + "/" + id;
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
