const localized = {
  lang: "vi",
  _getLang: function () {
    if (this[this.lang] == null) {
      return Error("Can't find lang", this.lang);
    } else return this[this.lang];
  },
  get: function (key) {
    let lang = this._getLang();
    if (lang[key] == null) {
      return key;
    } else return lang[key];
  },
  vi: {
    foodName: "Tên món ăn",
    description: "Mô tả",
    prepTime: "Thời gian chuẩn bị",
    cookTime: "Thời gian nấu",
    minute: "phút",
    type: "Loại",
    nutrition: "Dinh dưỡng",
    mainDish: "Bữa ăn chính",
    sideDish: "Bữa ăn phụ",
    ingredient: "Thành phần",
    ingredientName: "Tên",
    amount: "Số lượng"
  }
}

export default localized;