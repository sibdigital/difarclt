import { JetView } from "webix-jet";
import { ROOT_URL, CLS_STANDARD_PERIOD } from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";
import { filterTable, fetchData } from "~/util/api";

export default class StandardPeriodView extends JetView {
  config() {
    return {
      rows: [
        {
          view: "search",
          id: "tableSearch",
          placeholder: polyglot.t("form.search"),
          on: {
            onTimedKeyPress: function() {
              filterTable.call(this, "table");
            }
          }
        },
        {
          view: "datatable",
          id: "table",
          // width: 400,
          columnWidth: 200,
          url: () => {
            return fetchData(CLS_STANDARD_PERIOD);
          },
          select: true, //enables selection
          columns: [
            { id: "name", header: polyglot.t("base.name") },
            { id: "number", header: polyglot.t("base.number") }
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
      this.app.show("/top/cls-standard-period-form?id=" + item.row)
    );
  }
}
