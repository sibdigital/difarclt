import { JetView } from "webix-jet";
import {
  CLS_ANIMAL_RETIREMENT_CAUSE,
  ACTION_CREATE,
  ACTION_UPDATE,
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

export default class AnimalRetirementCauseView extends JetView {
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
              click: () => this.app.show("/top/cls-animal-retirement-cause")
            },
            {
              view: "label",
              css: "webix_transparent",
              width: 100,
              label: "Retirement Form"
            }
          ]
        },
        {
          view: "form",
          id: "form",
          elements: [
            { view: "text", label: polyglot.t("name"), id: "name" },
            { view: "text", label: polyglot.t("code"), id: "code" },
            { view: "text", label: polyglot.t("number"), id: "number" },
            {
              view: "combo",
              id: "combo1",
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
    webix
      .ajax()
      .get(ROOT_URL + CLS_ANIMAL_RETIREMENT_CAUSE)
      .then(function(data) {
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
      .get(ROOT_URL + CLS_ANIMAL_RETIREMENT_CAUSE + "/" + url[0].params.id)
      .then(data => {
        $$("name").setValue(data.json().name);
        $$("number").setValue(data.json().number);
        $$("code").setValue(data.json().code);
      });
  }

  saveRow() {
    const urlPost = ROOT_URL + CLS_ANIMAL_RETIREMENT_CAUSE + ACTION_CREATE;

    let item = {
      name: $$("name").getValue(),
      number: $$("number").getValue(),
      code: $$("code").getValue(),
      idParent: $$("combo1").getValue(),
      parentPath: "0000"
    };

    webix
      .ajax()
      .headers({
        "Content-Type": "application/json"
      })
      .post(urlPost, item)
      .then(data => this.setBlank());
  }

  updateRow(id) {
    const urlPut = ROOT_URL + CLS_ANIMAL_RETIREMENT_CAUSE + ACTION_UPDATE;
    const urlGet = ROOT_URL + CLS_ANIMAL_RETIREMENT_CAUSE + "/" + id;
    let item;

    webix
      .ajax()
      .get(urlGet)
      .then(data => {
        item = data.json();
        item.name = $$("name").getValue();
        item.number = $$("number").getValue();
        item.idParent = $$("combo1").getValue();
        item.parentPath = "00000";

        webix
          .ajax()
          .headers({
            "Content-Type": "application/json"
          })
          .put(urlPut, item)
          .then(data => this.setBlank());
      });
  }

  deleteRow(id) {
    const url = ROOT_URL + CLS_ANIMAL_RETIREMENT_CAUSE + "/" + id;
    webix
      .ajax()
      .del(url)
      .then(data => this.setBlank());
  }

  setBlank() {
    $$("name").setValue("");
    $$("number").setValue("");
    $$("code").setValue("");
    $$("combo1").setValue("");
  }
}
