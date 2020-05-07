import { JetView, plugins } from "webix-jet";
import { polyglot } from "jet-locales/ru.js";

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
        { value: polyglot.t("dependencies.crop"), id: "cls-crop" },
        { value: polyglot.t("dependencies.field"), id: "cls-field" },
        { value: polyglot.t("dependencies.resource"), id: "cls-resource" },
        {
          value: polyglot.t("dependencies.crop_variety"),
          id: "cls-crop-variety"
        },
        { value: polyglot.t("dependencies.role"), id: "cls-role" },
        {
          value: polyglot.t("dependencies.disease_feature"),
          id: "cls-disease-feature"
        },
        { value: polyglot.t("dependencies.fertilizer"), id: "cls-fertilizer" },
        { value: polyglot.t("dependencies.gps_module"), id: "cls-gps-module" },
        {
          value: polyglot.t("dependencies.plant_disease"),
          id: "cls-plant-disease"
        },
        {
          value: polyglot.t("dependencies.plant_organ"),
          id: "cls-plant-organ"
        },
        { value: polyglot.t("dependencies.plant_pest"), id: "cls-plant-pest" },
        {
          value: polyglot.t("dependencies.veget_period"),
          id: "cls-veget-period"
        },
        {
          value: polyglot.t("dependencies.weather_station"),
          id: "cls-weather-station"
        },
        {
          value: polyglot.t("dependencies.age_sex_group"),
          id: "cls-age-sex-group"
        },
        {
          value: polyglot.t("dependencies.animal_group_kind"),
          id: "cls-animal-group-kind"
        },
        {
          value: polyglot.t("dependencies.animal_retirement_cause"),
          id: "cls-animal-retirement-cause"
        },
        {
          value: polyglot.t("dependencies.animal_param_kind"),
          id: "cls-animal-param-kind"
        },
        { value: polyglot.t("dependencies.breed"), id: "cls-breed" },
        { value: polyglot.t("dependencies.user"), id: "cls-user" },
        {
          value: polyglot.t("dependencies.kind_animal"),
          id: "cls-kind-animal"
        },
        {
          value: polyglot.t("dependencies.type_animal_event"),
          id: "cls-type-animal-event"
        },
        {
          value: polyglot.t("dependencies.arbitrary_period"),
          id: "cls-arbitrary-period"
        },
        { value: polyglot.t("dependencies.area"), id: "cls-area" },
        { value: polyglot.t("dependencies.consumable"), id: "cls-consumable" },
        {
          value: polyglot.t("dependencies.consumable_kind"),
          id: "cls-consumable-kind"
        },
        { value: polyglot.t("dependencies.district"), id: "cls-district" },
        {
          value: polyglot.t("dependencies.equipment_kind"),
          id: "cls-equipment-kind"
        },
        {
          value: polyglot.t("dependencies.equipment_type"),
          id: "cls-equipment-type"
        },
        {
          value: polyglot.t("dependencies.legal_entity"),
          id: "cls-legal-entity"
        },
        {
          value: polyglot.t("dependencies.organization"),
          id: "cls-organization"
        },
        { value: polyglot.t("dependencies.partner"), id: "cls-partner" },
        { value: polyglot.t("dependencies.region"), id: "cls-region" },
        {
          value: polyglot.t("dependencies.standard_period"),
          id: "cls-standard-period"
        },
        { value: polyglot.t("dependencies.unit"), id: "cls-unit" },
        { value: polyglot.t("dependencies.unit_ratio"), id: "cls-unit-ratio" },
        { value: polyglot.t("dependencies.work_type"), id: "cls-work-type" },
        { value: polyglot.t("dependencies.depart"), id: "cls-depart" },
        { value: polyglot.t("dependencies.employee"), id: "cls-employee" },
        {
          value: polyglot.t("dependencies.protection_equipment"),
          id: "cls-protection-equipment"
        },
        {
          value: polyglot.t("dependencies.equipment_base"),
          id: "cls-equipment-base"
        },
        { value: polyglot.t("dependencies.position"), id: "cls-position" },
        { value: polyglot.t("dependencies.ranch"), id: "cls-ranch" }
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

  urlChange() {
    if (webix.storage.local.get("auth") == null) {
      this.app.show("/login");
    }
  }
}
