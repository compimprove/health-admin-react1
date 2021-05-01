export const ExerciseType = {
  Rest: "rest",
  Warmup: "warmup",
  Cooldown: "cooldown",
  Active: "active",
  getString: function (type) {
    let map = [
      { label: 'Nghỉ', value: 'rest' },
      { label: 'Tập luyện', value: 'active' },
      { label: 'Khởi động', value: 'warmup' },
      { label: 'Giãn cơ', value: 'cooldown' }
    ];
    let result = map.find(value => value.value == type);
    if (result != null) return result.label;
    return "Loại không rõ";
  }
}