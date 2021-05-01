export default class ExerciseStep {
  constructor({ length, exerciseType, description, videoUrl, title }) {
    this.length = length || 0;
    this.title = title || "";
    this.exerciseType = exerciseType || "";
    this.description = description || "";
    this.videoUrl = videoUrl || "";
  }
}