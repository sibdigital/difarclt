import { JetView } from "webix-jet";
import { ROOT_URL, CLS_FIELD } from "~/util/constants";
import { polyglot } from "jet-locales/ru";
import { filterTable, fetchData } from "~/util/api";

export default class FieldView extends JetView {
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
          columnWidth: 200,
          url: () => {
            return fetchData(CLS_FIELD);
          },
          select: true,
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
      this.app.show("/top/cls-field-form?id=" + item.row)
    );
  }
}
