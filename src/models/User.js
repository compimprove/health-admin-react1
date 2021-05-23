class UserData {
  constructor(data) {
    for (let key in data) {
      this[key] = data[key];
    }
  }
  isTrainer() {
    return this.role === UserData.Role.Trainer;
  }
  isNormalUser() {
    return this.role === UserData.Role.User;
  }
}

UserData.Role = {
  Admin: "admin",
  Trainer: "trainer",
  User: "user",
}

UserData.RoleName = {
  [UserData.Role.Admin]: "Quản trị viên",
  [UserData.Role.Trainer]: "Huấn luyện viên",
  [UserData.Role.User]: "Người dùng",
}

export default UserData;