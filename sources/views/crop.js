import { JetView } from "webix-jet";
import { ROOT_URL, CLS_CROP } from "~/util/constants.js";

export default class DataView extends JetView {
  config() {
    return {
      rows: [
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
          // width: 400,
          columnWidth: 200,
          url: ROOT_URL + CLS_CROP,
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
    $$("cropTable").attachEvent("onItemDblClick", item =>
      this.app.show("/top/crop-form?id=" + item.row)
    );
  }
}
