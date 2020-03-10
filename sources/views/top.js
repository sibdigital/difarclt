import { JetView, plugins } from "webix-jet";

export default class TopView extends JetView {
  config() {
    var header = {
      type: "header",
      template: this.app.config.name,
      css: "webix_header app_header"
    };

    var menu = {
      view: "menu",
      id: "top:menu",
      css: "app_menu",
      width: 180,
      layout: "y",
      scroll: "auto",
      select: true,
      template: "<span class='webix_icon #icon#'></span> #value# ",
      data: [
        { value: "Dashboard", id: "start", icon: "wxi-columns" },
        { value: "Crop", id: "cls-crop" },
        { value: "Field", id: "cls-field" },
        { value: "Resource", id: "cls-resource" },
        { value: "Crop variety", id: "cls-crop-variety" },
        { value: "Role", id: "cls-role" },
        { value: "Disease feature", id: "cls-disease-feature" },
        { value: "Fertilizer", id: "cls-fertilizer" },
        { value: "GPS", id: "cls-gps-module" },
        { value: "Plant disease", id: "cls-plant-disease" },
        { value: "Plant organ", id: "cls-plant-organ" },
        { value: "Plant pest", id: "cls-plant-pest" },
        { value: "Veget period", id: "cls-veget-period" },
        { value: "Weather station", id: "cls-weather-station" },
        { value: "Age sex group", id: "cls-age-sex-group" },
        { value: "Animal group kind", id: "cls-animal-group-kind" },
        { value: "Animal retirement cause", id: "cls-animal-retirement-cause" },
        { value: "Animal param kind", id: "cls-animal-param-kind" },
        { value: "Breed", id: "cls-breed" },
        { value: "User", id: "cls-user" },
        { value: "Kind animal", id: "cls-kind-animal" },
        { value: "Type animal event", id: "cls-type-animal-event" },
        { value: "Arbitrary period", id: "cls-arbitrary-period" },
        { value: "Area", id: "cls-area" },
        { value: "Consumable", id: "cls-consumable" },
        { value: "Consumable kind", id: "cls-consumable-kind" },
        { value: "District", id: "cls-district" },
        { value: "Equipment kind", id: "cls-equipment-kind" },
        { value: "Equipment type", id: "cls-equipment-type" },
        { value: "Legal entity", id: "cls-legal-entity" },
        { value: "Organization", id: "cls-organization" },
        { value: "Partner", id: "cls-partner" },
        { value: "Region", id: "cls-region" },
        { value: "Standard period", id: "cls-standard-period" },
        { value: "Unit", id: "cls-unit" },
        { value: "Unit ratio", id: "cls-unit-ratio" },
        { value: "Work type", id: "cls-work-type" },
        { value: "Depart", id: "cls-depart" },
        { value: "Employee", id: "cls-employee" },
        { value: "Protection equipment", id: "cls-protection-equipment" },
        { value: "Equipment base", id: "cls-equipment-base" },
        { value: "Position", id: "cls-position" },
        { value: "Ranch", id: "cls-ranch" },
        { value: "Test", id: "test" }
      ]
    };

    var ui = {
      type: "clean",
      paddingX: 5,
      css: "app_layout",
      cols: [
        {
          paddingX: 5,
          paddingY: 10,
          rows: [{ css: "webix_shadow_medium", rows: [header, menu] }]
        },
        {
          type: "wide",
          paddingY: 10,
          paddingX: 5,
          rows: [{ $subview: true }]
        }
      ]
    };

    return ui;
  }

  init() {
    this.use(plugins.Menu, "top:menu");
  }
}
