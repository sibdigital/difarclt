import { JetView } from "webix-jet";
import {
  ROOT_URL,
  ACTION_CREATE,
  ACTION_UPDATE,
  CLS_CROP,
  HEADER_CONTENT_TYPE
} from "~/util/constants.js";

export default class DataView extends JetView {
  config() {
    return {
      rows: [
        {
          view: "toolbar",
          elements: [
            {
              view: "button",
              label: "Table",
              click: function() {
                $$("tableSearch").show();
                $$("cropTable").show();
                $$("pager").show();
                $$("cropForm").hide();
              }
            },
            {
              view: "button",
              label: "Form",
              click: function() {
                $$("cropForm").show();
                $$("cropTable").hide();
                $$("tableSearch").hide();
                $$("pager").hide();
              }
            }
          ]
        },
        {
          view: "form",
          id: "cropForm",
          elements: [
            { view: "text", placeholder: "Name", id: "name" },
            { view: "text", placeholder: "Code", id: "code" },
            { view: "text", placeholder: "Number", id: "number" },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: "Save",
                  width: 100,
                  click: () => this.saveRow()
                },
                {
                  view: "button",
                  value: "Delete",
                  width: 100,
                  click: () => this.deleteRow()
                },
                {
                  view: "button",
                  value: "Update",
                  width: 100,
                  click: () => this.updateRow()
                }
              ]
            }
          ]
        },
        {
          view: "search",
          id: "tableSearch",
          placeholder: "Search...",
          on: {
            onTimedKeyPress: function() {
              let value = this.getValue().toLowerCase();
              if (!value) {
                $$("cropTable").filter();
              } else {
                $$("cropTable").filter(function(obj) {
                  return obj.name.toLowerCase().indexOf(value) != -1;
                });
              }
            }
          }
        },
        {
          view: "datatable",
          id: "cropTable",
          width: 400,
          columnWidth: 192,
          url: ROOT_URL + CLS_CROP,
          on: {
            onAfterSelect: id => this.selectItem(id)
          },
          select: true, //enables selection
          columns: [
            { id: "name", header: "Name" },
            { id: "number", header: "Number" }
          ],
          pager: "pager"
        },
        {
          view: "pager",
          id: "pager",
          size: 5,
          group: 5
        }
      ]
    };
  }

  init() {
    $$("cropForm").hide();
  }

  selectItem(id) {
    const item = $$("cropTable").getItem(id);

    $$("name").setValue(item.name);
    $$("number").setValue(item.number);
    $$("code").setValue(item.code);
  }

  deleteRow() {
    const id = $$("cropTable").getSelectedId();
    const url = ROOT_URL + CLS_CROP + "/" + id;

    webix
      .ajax()
      .del(url)
      .then(data => {
        if (data.text()) {
          $$("cropTable").remove(id);
        }
      });
  }

  saveRow() {
    const url = ROOT_URL + CLS_CROP + ACTION_CREATE;
    const item = {
      name: $$("name").getValue(),
      code: $$("code").getValue(),
      number: $$("number").getValue()
    };

    webix
      .ajax()
      .headers({
        "Content-Type": "application/json"
      })
      .post("http://localhost:8080/crop/create", item)
      .then(data => {
        console.log(data.json());
        if (data.json() != null) {
          $$("cropTable").add(data.json());
        }
      });
  }

  updateRow() {
    const url = ROOT_URL + CLS_CROP + ACTION_UPDATE;
    const id = $$("cropTable").getSelectedId();
    const item = $$("cropTable").getItem(id);

    item.name = $$("name").getValue();
    item.code = $$("code").getValue();
    item.number = $$("number").getValue();

    webix
      .ajax()
      .headers({
        "Content-Type": "application/json"
      })
      .put(url, item)
      .then(data => {
        if (data.json() != null) {
          $$("cropTable").updateItem(id, data.json());
        }
      });
  }
}
