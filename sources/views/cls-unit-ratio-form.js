import { JetView } from "webix-jet";
import {
  CLS_UNIT_RATIO,
  CLS_UNIT,
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
              click: () => this.app.show("/top/cls-unit-ratio")
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
            { view: "text", label: polyglot.t("ratio"), id: "ratio" },
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

  init() {
    this.fillCombo(CLS_UNIT, "combo1");
    this.fillCombo(CLS_UNIT, "combo2");
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
      .get(ROOT_URL + CLS_UNIT_RATIO + "/" + url[0].params.id)
      .then(data => {
        $$(FORM_NAME).setValue(data.json().name);
        $$(FORM_NUMBER).setValue(data.json().number);
        $$("ratio").setValue(data.json().ratio);
        $$("combo1").setValue(data.json().clsUnitByIdUnitFrom);
        $$("combo2").setValue(data.json().clsUnitByIdUnitTo);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_UNIT_RATIO + ACTION_CREATE;
    const url1 = ROOT_URL + CLS_UNIT + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_UNIT + "/" + $$("combo2").getValue();

    let item = {
      name: $$(FORM_NAME).getValue(),
      number: $$(FORM_NUMBER).getValue(),
      ratio: $$("ratio").getValue()
    };

    webix
      .ajax()
      .get(url1)
      .then(data => {
        item.clsUnitByIdUnitFrom = data.json();

        webix
          .ajax()
          .get(url2)
          .then(data => {
            item.clsUnitByIdUnitTo = data.json();

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
    const urlPut = ROOT_URL + CLS_UNIT_RATIO + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_UNIT_RATIO + "/" + id;
    const url1 = ROOT_URL + CLS_UNIT + "/" + $$("combo1").getValue();
    const url2 = ROOT_URL + CLS_UNIT + "/" + $$("combo2").getValue();
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$(FORM_NAME).getValue();
        item.number = $$(FORM_NUMBER).getValue();
        item.ratio = $$("ratio").getValue();

        webix
          .ajax()
          .get(url1)
          .then(data => {
            item.clsUnitByIdUnitFrom = data.json();

            webix
              .ajax()
              .get(url2)
              .then(data => {
                item.clsUnitByIdUnitTo = data.json();

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
    const url = ROOT_URL + CLS_UNIT_RATIO + "/" + id;
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
    $$("ratio").setValue("");
  }
}
