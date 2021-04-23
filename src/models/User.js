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
  Trainer: "trainer",
  Admin: "admin",
  User: "user",
  PremiumUser: "premiumUser"
}

export default UserData;