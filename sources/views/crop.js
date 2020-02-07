import { JetView } from "webix-jet";

export default class DataView extends JetView {
	config() {
		return {
			width: 400,
			rows: [
				{
					view: "form", id: "cropForm", elements: [
						{ view: "text", placeholder: "Name", id: "nameInput" },
						{ view: "text", placeholder: "Code", id: "codeInput" },
						{ view: "text", placeholder: "Number", id: "numberInput" }
					]
				},
				{
					view: "toolbar", elements: [
						{ view: "button", value: "Save", width: 100, click: () => this.saveRow() },
						{ view: "button", value: "Delete", width: 100, click: () => this.deleteRow() }
					]
				},
				{
					view: "datatable",
					id: "cropTable",
					select: true, //enables selection 
					columns: [
						{ id: "name", header: "Name", width: "100" },
						{ id: "code", header: "Code", width: "100" },
						{ id: "number", header: "Number", width: "100" }
					],
				}
			]
		};
	}

	init() {
		this.loadData();
	}

	loadData() {
		this.$$("cropTable").load(() => {
			return this.webix.ajax().get("http://localhost:8080/crop");
		});
	}

	deleteRow() {
		const id = this.$$("cropTable").getSelectedId();
		this.webix.ajax().del("http://localhost:8080/crop/" + id).then(() => this.loadData());
	}

	saveRow() {
		const name = this.$$("nameInput").getValue();
		const code = this.$$("codeInput").getValue();
		const number = this.$$("numberInput").getValue();

		this.webix.ajax().headers({
			"Content-Type": "application/json"
		}).post("http://localhost:8080/crop/create", { name: name, code: code, number: number }).then(() => this.loadData());
	}
}