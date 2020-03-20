import { JetView } from "webix-jet";
import {
  CLS_RANCH,
  CLS_ORGANIZATION,
  CLS_DEPART,
  CLS_DISTRICT,
  ACTION_CREATE,
  ACTION_UPDATE,
  ROOT_URL
} from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";

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
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: polyglot.t("save"),
                  id: "save"
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
    this.fillCombo(CLS_ORGANIZATION, "combo1");
    this.fillCombo(CLS_DEPART, "combo2");
    this.fillCombo(CLS_DISTRICT, "combo3");
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
      .get(ROOT_URL + CLS_RANCH + "/" + url[0].params.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("combo1").setValue(data.json().clsOrganizationByIdOrganization.id);
        $$("combo2").setValue(data.json().clsDepartByIdDepart.id);
        $$("combo3").setValue(data.json().clsDistrictByIdDistrict.id);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_RANCH + ACTION_CREATE;
    const url1 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_DEPART + "/" + $$("combo2").getValue();
    const url3 = ROOT_URL + CLS_DISTRICT + "/" + $$("combo3").getValue();

    let item = {
      name: $$("name").getValue(),
      number: $$("number").getValue()
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
                  .headers({
                    "Content-Type": "application/json"
                  })
                  .post(urlPost, item)
                  .then(data => this.setBlank());
              });
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  updateRow(id) {
    const urlPut = ROOT_URL + CLS_RANCH + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_RANCH + "/" + id;
    const url1 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_DEPART + "/" + $$("combo2").getValue();
    const url3 = ROOT_URL + CLS_DISTRICT + "/" + $$("combo3").getValue();

    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$("name").getValue();
        item.number = $$("number").getValue();

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
                      .headers({
                        "Content-Type": "application/json"
                      })
                      .put(urlPut, item)
                      .then(data => this.setBlank());
                  });
              });
          });
      });
  }

  deleteRow(id) {
    const url = ROOT_URL + CLS_RANCH + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$("name").setValue("");
    $$("number").setValue("");
    $$("combo1").setValue("");
    $$("combo2").setValue("");
    $$("combo3").setValue("");
  }
}
