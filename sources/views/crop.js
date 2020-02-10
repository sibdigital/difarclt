import { JetView } from "webix-jet";

export default class DataView extends JetView {
  config() {
    return {
      rows: [
        {
          view: "form",
          id: "cropForm",
          elements: [
            { view: "text", placeholder: "Name", id: "name" },
            { view: "text", placeholder: "Code", id: "code" },
            { view: "text", placeholder: "Number", id: "number" }
          ]
        },
        {
          view: "toolbar",
          elements: [
            {
              view: "button",
              value: "Save",
              width: 100,
              click: () => this.saveRow()
            },
            {
              view: "button",
              value: "Delete",
              width: 100,
              click: () => this.deleteRow()
            },
            {
              view: "button",
              value: "Update",
              width: 100,
              click: () => this.updateRow()
            }
          ]
        },
        {
          view: "datatable",
          id: "cropTable",
          on: {
            onAfterSelect: id => {
              const item = $$("cropTable").getItem(id);

              $$("name").setValue(item.name);
              $$("number").setValue(item.number);
              $$("code").setValue(item.code);
            }
          },
          select: true, //enables selection
          columns: [
            { id: "name", header: "Name", width: "140" },
            { id: "code", header: "Code", width: "140" },
            { id: "number", header: "Number", width: "140" }
          ]
        }
      ]
    };
  }

  init() {
    this.loadData();
  }

  loadData() {
    $$("cropTable").load(() => {
      return webix.ajax().get("http://localhost:8080/crop");
    });
  }

  deleteRow() {
    const id = $$("cropTable").getSelectedId();

    webix
      .ajax()
      .del("http://localhost:8080/crop/" + id)
      .then(data => {
        if (data.text()) {
          $$("cropTable").remove(id);
        }
      });
  }

  saveRow() {
    const item = {
      name: $$("name").getValue(),
      code: $$("code").getValue(),
      number: $$("number").getValue()
    };

    webix
      .ajax()
      .headers({
        "Content-Type": "application/json"
      })
      .post("http://localhost:8080/crop/create", item)
      .then(data => {
        if (data.json() != null) {
          $$("cropTable").add(data.json());
        }
      });
  }

  updateRow() {
    const id = $$("cropTable").getSelectedId();
    const item = $$("cropTable").getItem(id);

    item.name = $$("name").getValue();
    item.code = $$("code").getValue();
    item.number = $$("number").getValue();

    webix
      .ajax()
      .headers({
        "Content-Type": "application/json"
      })
      .put("http://localhost:8080/crop/update", item)
      .then(data => {
        if (data.json() != null) {
          $$("cropTable").updateItem(id, data.json());
        }
      });
  }
}
