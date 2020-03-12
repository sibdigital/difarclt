import { JetView } from "webix-jet";
import {
  CLS_EMPLOYEE,
  CLS_DEPART,
  CLS_ORGANIZATION,
  FORM_NAME,
  FORM_NUMBER,
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
              click: () => this.app.show("/top/cls-employee")
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
            { view: "text", label: polyglot.t("name"), id: FORM_NAME },
            { view: "text", label: polyglot.t("number"), id: FORM_NUMBER },
            { view: "text", label: polyglot.t("first_name"), id: "first_name" },
            { view: "text", label: polyglot.t("surname"), id: "surname" },
            { view: "text", label: polyglot.t("patronymic"), id: "patronymic" },
            {
              view: "combo",
              id: "combo1",
              label: polyglot.t("depart"),
              options: {}
            },
            {
              view: "combo",
              id: "combo2",
              label: polyglot.t("organization"),
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
    this.fillCombo(CLS_DEPART, "combo1");
    this.fillCombo(CLS_ORGANIZATION, "combo2");
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
      .get(ROOT_URL + CLS_EMPLOYEE + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$("first_name").setValue(data.json().firstname);
        $$("surname").setValue(data.json().surname);
        $$("patronymic").setValue(data.json().patronymic);
        $$("combo1").setValue(data.json().clsDepartByIdDepart);
        $$("combo2").setValue(data.json().clsOrganizationByIdOrganization);
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
    const urlPost = ROOT_URL + CLS_EMPLOYEE + ACTION_CREATE;
    const url1 = ROOT_URL + CLS_DEPART + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo2").getValue();

    let item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue(),
      firstname: $$("first_name").getValue(),
      surname: $$("surname").getValue(),
      patronymic: $$("patronymic").getValue()
    };

    webix
      .ajax()
      .get(url1)
      .then(data => {
        item.clsDepartByIdDepart = data.json();

        webix
          .ajax()
          .get(url2)
          .then(data => {
            item.clsOrganizationByIdOrganization = data.json();

            webix
              .ajax()
              .headers({
                "Content-Type": "application/json"
              })
              .post(urlPost, item)
              .then(data => this.setBlank());
          });
      })
      .catch(err => {
        console.log(err);
      });
  }

  updateRow(id) {
    const urlPut = ROOT_URL + CLS_EMPLOYEE + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_EMPLOYEE + "/" + id;
    const url1 = ROOT_URL + CLS_DEPART + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_ORGANIZATION + "/" + $$("combo2").getValue();
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();
        item.firstname = $$("first_name").getValue();
        item.surname = $$("surname").getValue();
        item.patronymic = $$("patronymic").getValue();

        webix
          .ajax()
          .get(url1)
          .then(data => {
            item.clsDepartByIdDepart = data.json();

            webix
              .ajax()
              .get(url2)
              .then(data => {
                item.clsOrganizationByIdOrganization = data.json();

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
  }

  deleteRow(id) {
    const url = ROOT_URL + CLS_EMPLOYEE + "/" + id;
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
    $$("first_name").setValue("");
    $$("surname").setValue("");
    $$("patronymic").setValue("");
  }
}
