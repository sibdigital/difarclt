import { JetView } from "webix-jet";
import { ROOT_URL, CLS_RANCH } from "~/util/constants.js";
import { polyglot } from "jet-locales/ru.js";

export default class RanchView extends JetView {
  config() {
    return {
      rows: [
        {
          view: "search",
          id: "tableSearch",
          placeholder: polyglot.t("form.search"),
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
          url: () => {
            return webix
              .ajax()
              .headers({
                "Content-Type": "application/json",
                Authorization: webix.storage.local.get("auth")
              })
              .get(ROOT_URL + CLS_RANCH);
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
      this.app.show("/top/cls-ranch-form?id=" + item.row)
    );
  }
}
