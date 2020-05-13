import { JetView } from "webix-jet";
import {
  ROOT_URL,
  CLS_ORGANIZATION,
  CLS_CROP,
  CLS_DEPART,
  CLS_DISTRICT,
  CLS_RANCH,
  CLS_REGION,
  CLS_UNIT,
  CLS_LEGAL_ENTITY,
  CLS_CONSUMABLE_KIND,
  CLS_STANDARD_PERIOD,
  CLS_EQUIPMENT_TYPE,
  CLS_KIND_ANIMAL
} from "~/util/constants.js";
import { fetchData } from "./api";
import { polyglot } from "jet-locales/ru";

const win = {
  view: "window",
  position: "center",
  height: 400,
  width: 400,
  close: true,
  modal: true
};

const table = {
  view: "datatable",
  columnWidth: 200,
  select: true,
  columns: [
    { id: "name", header: polyglot.t("base.name") },
    { id: "number", header: polyglot.t("base.number") }
  ]
};

class OrganizationWindow extends JetView {
  config() {
    return {
      ...win,
      id: "organization_win",
      head: polyglot.t("dependencies.organization"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_ORGANIZATION);
        },
        on: {
          onItemDblClick(id) {
            $$("organization_combo").setValue(id);
            $$("organization_win").close();
          }
        }
      }
    };
  }
}

class CropWindow extends JetView {
  config() {
    return {
      ...win,
      id: "crop_win",
      head: polyglot.t("dependencies.crop"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_CROP);
        },
        on: {
          onItemDblClick(id) {
            $$("crop_combo").setValue(id);
            $$("crop_win").close();
          }
        }
      }
    };
  }
}

class ConsumableKindWindow extends JetView {
  config() {
    return {
      ...win,
      id: "consumable_kind_win",
      head: polyglot.t("dependencies.consumable_kind"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_CONSUMABLE_KIND);
        },
        on: {
          onItemDblClick(id) {
            $$("consumable_kind_combo").setValue(id);
            $$("consumable_kind_win").close();
          }
        }
      }
    };
  }
}

class DepartWindow extends JetView {
  config() {
    return {
      ...win,
      id: "depart_win",
      head: polyglot.t("dependencies.depart"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_DEPART);
        },
        on: {
          onItemDblClick(id) {
            $$("depart_combo").setValue(id);
            $$("depart_win").close();
          }
        }
      }
    };
  }
}

class DistrictWindow extends JetView {
  config() {
    return {
      ...win,
      id: "district_win",
      head: polyglot.t("dependencies.district"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_DISTRICT);
        },
        on: {
          onItemDblClick(id) {
            $$("district_combo").setValue(id);
            $$("district_win").close();
          }
        }
      }
    };
  }
}

class UnitWindow extends JetView {
  config() {
    return {
      ...win,
      id: "unit_win",
      head: polyglot.t("dependencies.unit"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_UNIT);
        },
        on: {
          onItemDblClick(id) {
            $$("unit_combo").setValue(id);
            $$("unit_win").close();
          }
        }
      }
    };
  }
}

class RanchWindow extends JetView {
  config() {
    return {
      ...win,
      id: "ranch_win",
      head: polyglot.t("dependencies.ranch"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_RANCH);
        },
        on: {
          onItemDblClick(id) {
            $$("ranch_combo").setValue(id);
            $$("ranch_win").close();
          }
        }
      }
    };
  }
}

class RegionWindow extends JetView {
  config() {
    return {
      ...win,
      id: "region_win",
      head: polyglot.t("dependencies.region"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_REGION);
        },
        on: {
          onItemDblClick(id) {
            $$("region_combo").setValue(id);
            $$("region_win").close();
          }
        }
      }
    };
  }
}

class StandardPeriodWindow extends JetView {
  config() {
    return {
      ...win,
      id: "standard_period_win",
      head: polyglot.t("dependencies.standard_period"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_STANDARD_PERIOD);
        },
        on: {
          onItemDblClick(id) {
            $$("standard_period_combo").setValue(id);
            $$("standard_period_win").close();
          }
        }
      }
    };
  }
}

class LegalEntityWindow extends JetView {
  config() {
    return {
      ...win,
      id: "legal_entity_win",
      head: polyglot.t("dependencies.legal_entity"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_LEGAL_ENTITY);
        },
        on: {
          onItemDblClick(id) {
            $$("legal_entity_combo").setValue(id);
            $$("legal_entity_win").hide();
          }
        }
      }
    };
  }
}

class EquipmentTypeWindow extends JetView {
  config() {
    return {
      ...win,
      id: "kind_animal_win",
      head: polyglot.t("dependencies.equipment_type"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_EQUIPMENT_TYPE);
        },
        on: {
          onItemDblClick(id) {
            $$("kind_animal_combo").setValue(id);
            $$("kind_animal_win").hide();
          }
        }
      }
    };
  }
}

class KindAnimalWindow extends JetView {
  config() {
    return {
      ...win,
      id: "kind_animal_win",
      head: polyglot.t("dependencies.kind_animal"),
      body: {
        ...table,
        url: () => {
          return fetchData(CLS_KIND_ANIMAL);
        },
        on: {
          onItemDblClick(id) {
            $$("kind_animal_combo").setValue(id);
            $$("kind_animal_win").hide();
          }
        }
      }
    };
  }
}

export {
  OrganizationWindow,
  StandardPeriodWindow,
  RegionWindow,
  CropWindow,
  DepartWindow,
  DistrictWindow,
  KindAnimalWindow,
  LegalEntityWindow,
  ConsumableKindWindow,
  EquipmentTypeWindow,
  RanchWindow,
  UnitWindow
};
