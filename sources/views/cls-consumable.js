import { JetView } from "webix-jet";
import { ROOT_URL, CLS_CONSUMABLE } from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";

export default class ConsumableView extends JetView {
  config() {
    return {
      rows: [
        {
          view: "search",
          id: "tableSearch",
          placeholder: polyglot.t("search"),
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
          columnWidth: 200,
          url: ROOT_URL + CLS_CONSUMABLE,
          select: true, //enables selection
          columns: [
            { id: "name", header: polyglot.t("name") },
            { id: "number", header: polyglot.t("number") }
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
      this.app.show("/top/cls-consumable-form?id=" + item.row)
    );
  }
}
