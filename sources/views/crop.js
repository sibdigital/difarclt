import { JetView } from "webix-jet";
import {
  ROOT_URL,
  CLS_CROP,
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
          id: "cropForm",
          elements: [
            { view: "text", placeholder: "Name", id: FORM_NAME },
            { view: "text", placeholder: "Code", id: FORM_CODE },
            { view: "text", placeholder: "Number", id: FORM_NUMBER },
            {
              margin: 5,
              cols: [
                {
                  view: "button",
                  value: "Save",
                  width: 100,
                  click: () => saveRow.call(this, "cropTable", CLS_CROP)
                },
                {
                  view: "button",
                  value: "Delete",
                  width: 100,
                  click: () => deleteRow.call(this, "cropTable", CLS_CROP)
                },
                {
                  view: "button",
                  value: "Update",
                  width: 100,
                  click: () => updateRow.call(this, "cropTable", CLS_CROP)
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
          columnWidth: 190,
          url: ROOT_URL + CLS_CROP,
          on: {
            onAfterSelect: id => selectItem.call(this, "cropTable", id)
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
    $$("cropTable").attachEvent("onItemDblClick", () => this.showForm());
  }

  showTable() {
    $$("tableSearch").show();
    $$("cropTable").show();
    $$("pager").show();
    $$("cropForm").hide();
  }

  showForm() {
    $$("cropForm").show();
    $$("cropTable").hide();
    $$("tableSearch").hide();
    $$("pager").hide();
  }
}
