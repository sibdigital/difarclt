import { JetView } from "webix-jet";
import { ROOT_URL, CLS_CROP } from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";
import { filterTable, fetchData } from "~/util/api";

export default class CropView extends JetView {
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
            return fetchData(CLS_CROP);
          },
          select: true, //enables selection
          columns: [
            { id: "name", header: polyglot.t("base.name") },
            { id: "numner", header: polyglot.t("base.number") }
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
      this.app.show("/top/cls-crop-form?id=" + item.row)
    );
  }
}
