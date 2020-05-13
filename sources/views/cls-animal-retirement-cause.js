import { JetView } from "webix-jet";
import { ROOT_URL, CLS_ANIMAL_RETIREMENT_CAUSE } from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";
import { filterTable, fetchData } from "~/util/api";

export default class AnimalRetirementCauseView extends JetView {
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
            return fetchData(CLS_ANIMAL_RETIREMENT_CAUSE);
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
      this.app.show("/top/cls-animal-retirement-cause-form?id=" + item.row)
    );
  }
}
