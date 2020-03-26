import { JetView } from "webix-jet";
import { ROOT_URL, CLS_ARBITRARY_PERIOD } from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";

export default class ArbitraryPeriodView extends JetView {
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
          url: ROOT_URL + CLS_ARBITRARY_PERIOD,
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
      this.app.show("/top/cls-arbitrary-period-form?id=" + item.row)
    );
  }
}
