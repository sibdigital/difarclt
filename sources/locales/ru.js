import Polyglot from "node-polyglot";

export const polyglot = new Polyglot();
polyglot.extend({
  base: {
    name: "Название",
    number: "Номер",
    code: "Код"
  },

  properties: {
    begin_age: "Начальный возраст",
    date_begin: "Дата начала",
    date_end: "Дата конца",
    end_age: "Конечный возраст",
    first_name: "Имя",
    inn: "ИНН",
    max_consum: "Нормативный расход максимальный",
    max_incub_period: "Максимальный инкубационный период",
    min_consum: "Нормативный расход минимальный",
    min_incub_period: "Минимальный инкубационный период",
    password: "Пароль",
    patronymic: "Отчество",
    period_type: "Тип периода",
    predefined: "Преопределенное",
    ratio: "Соотношение",
    separate: "Раздельный",
    sex: "Пол",
    surname: "Фамилия",
    type: "Тип"
  },

  form: {
    back: "Назад",
    delete: "Удалить",
    form: "Форма",
    save: "Сохранить",
    search: "Поиск",
    update: "Обновить"
  },

  dependencies: {
    age_sex_group: "Половозрастные группы",
    animal_group_kind: "Виды групп животных",
    animal_kind: "Вид животного",
    animal_param_kind: "Виды параметров животных",
    animal_retirement_cause: "Причины выбытия",
    arbitrary_period: "Произвольный период",
    area: "Местность",
    breed: "Породы",
    consumable: "Расходные материалы",
    consumable_kind: "Вид расходного материала",
    crop: "Сельскохозяйственная",
    crop_variety: "Сорт сельскохозяйственной культуры",
    depart: "Подразделение",
    disease_feature: "Тип проявления болезни",
    district: "Район",
    employee: "Сотрудник",
    equipment_base: "Базы техники",
    equipment_kind: "Вид техники",
    equipment_type: "Тип техники",
    fertilizer: "Удобрение",
    field: "Поле",
    gps_module: "GPS-модуль",
    kind_animal: "Виды животных",
    legal_entity: "Юридическое лицо",
    organization: "Организация",
    partner: "Контрагент",
    plant_disease: "Болезнь растения",
    plant_organ: "Орган растения",
    plant_pest: "Вредитель растения",
    position: "Должность",
    protection_equipment: "Средство защиты растений",
    ranch: "Ферма",
    region: "Регион",
    resource: "Ресурсы",
    role: "Роль",
    standard_period: "Стандартный период",
    type_animal_event: "Типы событий животных",
    unit: "Единица измерения",
    unit_ratio: "Отношение единиц измерения",
    user: "Пользователь",
    veget_period: "Вегетационный период",
    weather_station: "Метеостанция",
    work_type: "Виды работ"
  }
});
