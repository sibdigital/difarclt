import { JetView } from "webix-jet";
import { ROOT_URL, CLS_ANIMAL_PARAM_KIND } from "~/util/constants.js";

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
                $$("table").filter();
              } else {
                $$("table").filter(function(obj) {
                  return obj.name.toLowerCase().indexOf(value) != -1;
                });
              }
            }
          }
        },
        {
          view: "datatable",
          id: "table",
          // width: 400,
          columnWidth: 200,
          url: ROOT_URL + CLS_ANIMAL_PARAM_KIND,
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
    $$("table").attachEvent("onItemDblClick", item =>
      this.app.show("/top/cls-animal-param-kind-form?id=" + item.row)
    );
  }
}
