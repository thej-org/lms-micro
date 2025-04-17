import mongoose from "mongoose";

const Schema = mongoose.Schema;

const lectureContentSchema = new Schema({
  lectureNumber: {
    type: Number,
    required: true,
  },
  lecturePdfUrl: {
    type: String,
    default: "No pdf uploaded",
  },
  lectureVideoUrl: {
    type: String,
    default: "No video uploaded",
  },
  lectureQuizUrl: {
    type: String,
    default: "No quiz yet",
  },
  day: {
    type: String,
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
});

const courseSchema = new Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    courseContent: [lectureContentSchema],
    approval: {
      type: String,
      default: 'pending',
    },
  },
  { timestamps: true }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
