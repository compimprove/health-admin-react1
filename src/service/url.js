const host = process.env.REACT_APP_HOST;
const Url = {
  Websocket: host + "/websocket",
  Login: host + "/auth/login",
  RefreshToken: host + "/auth/refresh-token",
  UserData: host + "/user",
  Room: host + "/room",
  TrainerRoom: host + "/trainer/room",
  TrainerMeal: host + "/trainer/meal",
  TrainerTraining: host + "/trainer/training",
  TrainerExercise: host + "/trainer/exercise",
  TrainerTrainee: host + "/trainer/trainee",
  TrainerMealProgram: host + "/trainer/meal-program"
};
export default Url;