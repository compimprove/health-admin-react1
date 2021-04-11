export default class ExerciseStep {
  constructor({ length, type, description, videoUrl }) {
    this.length = length || 0;
    this.type = type || "";
    this.description = description || "";
    this.videoUrl = videoUrl || "";
  }
}