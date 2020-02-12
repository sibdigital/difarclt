import { JetView } from "webix-jet";
import {
  ROOT_URL,
  CLS_FIELD,
  FORM_NAME,
  FORM_CODE,
  FORM_NUMBER
} from "~/util/constants.js";
import {
  saveRow,
  deleteRow,
  updateRow,
  selectItem
} from "~/util/table-operations.js";

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
              click: () => this.showTable()
            },
            {
              view: "button",
              label: "Form",
              click: () => this.showForm()
            }
          ]
        },
        {
          view: "form",
          id: "fieldForm",
          elements: [
            { view: "text", placeholder: "Name", id: FORM_NAME },
            { view: "text", placeholder: "Code", id: FORM_CODE },
            { view: "text", placeholder: "Number", id: FORM_NUMBER },
            { view: "combo" },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: "Save",
                  width: 100,
                  click: () => saveRow.call(this, "fieldTable", CLS_FIELD)
                },
                {
                  view: "button",
                  value: "Delete",
                  width: 100,
                  click: () => deleteRow.call(this, "fieldTable", CLS_FIELD)
                },
                {
                  view: "button",
                  value: "Update",
                  width: 100,
                  click: () => updateRow.call(this, "fieldTable", CLS_FIELD)
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
              const value = this.getValue().toLowerCase();
              if (!value) {
                $$("fieldTable").filter();
              } else {
                $$("fieldTable").filter(function(obj) {
                  return obj.name.toLowerCase().indexOf(value) != -1;
                });
              }
            }
          }
        },
        {
          view: "datatable",
          id: "fieldTable",
          width: 400,
          columnWidth: 190,
          url: ROOT_URL + CLS_FIELD,
          on: {
            onAfterSelect: id => selectItem.call(this, "fieldTable", id)
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
    $$("fieldForm").hide();
    $$("fieldTable").attachEvent("onItemDblClick", () => this.showForm());
  }

  showTable() {
    $$("tableSearch").show();
    $$("fieldTable").show();
    $$("pager").show();
    $$("fieldForm").hide();
  }

  showForm() {
    $$("fieldForm").show();
    $$("fieldTable").hide();
    $$("tableSearch").hide();
    $$("pager").hide();
  }
}
