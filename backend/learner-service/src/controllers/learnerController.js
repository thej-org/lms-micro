import Learner from "../schema/learnerSchema.js";
import axios from "axios";
import sendEmail from "../utils/emailUtils.js";
import sendSMS from "../utils/smsUtils.js";

//get Course list from the course Microservice
const COURSE_MICRO_SERVICE_BASE_URL = process.env.COURSE_API;

//user Microservice URL
const USER_MICRO_SERVICE_BASE_URL = process.env.AUTH_API;

// get courses
const getCourses = async (req, res) => {
  try {
    // make GET request to course microservice to fetch list of courses
    const response = await axios.get(COURSE_MICRO_SERVICE_BASE_URL);

    // extract courses from response data
    const courses = response.data.courses;

    // return courses as a JSON response
    return res.status(200).json({ courses });
  } catch (error) {
    // log error and return an error response
    console.error("Error fetching courses:", error);
    return res.status(500).json({ error: "Failed to fetch courses" });
  }
};

// add learner
const addLearner = async (req, res) => {
  try {
    const userId = req.headers.userid;
    const user = await axios.get(
      `${USER_MICRO_SERVICE_BASE_URL}/user/${userId}`
    );

    const learner = user.data;

    let learnerData = {
      learnerId: learner._id,
      userName: learner.name,
      email: learner.email,
      enrolledCourses: [],
      progress: [],
    };

    const newLearner = await Learner.create(learnerData);

    newLearner.save();

    return res.status(200).json({ newLearner });
  } catch (error) {
    console.error("Error adding learner:", error);
    return res.status(500).json({ error: "Failed to add learner" });
  }
};

// get current learner
const getCurrentLearner = async (req, res) => {
  try {
    //get the course microsrvice
    const userId = req.headers.userid;
    const learner = await Learner.findOne({ learnerId: userId });

    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    return res.status(200).json({ learner });
  } catch (error) {
    console.error("Error getting learner");
    return res.status(500).json({ error: "Error getting learner" });
  }
};

const learnerEnroltoCourses = async (req, res) => {
  try {
    const { courseCode } = req.body;
    const learner = await Learner.findOne({ learnerId: req.headers.userid });

    if (!learner) {
      res.status(404).json({ message: " Learner not found" });
      return;
    }

    if (!learner.enrolledCourses.includes(courseCode)) {
      learner.enrolledCourses.push(courseCode);
    }

    await learner.save();

    // // Fetch the enrolled course data
    // const enrolledCourseResponse = await axios.get(
    //   `${COURSE_MICRO_SERVICE_BASE_URL}/courseCode/${courseCode}`
    // );
    // const enrolledCourse = enrolledCourseResponse.data;

    //send email if enrolment is success
    const emailContent = `Dear ${learner.userName},\n\n You have succesfully enrolled to the course ${courseCode}. \n\n Please check your updated profile!\n\n -Learner Manager-`;
    await sendEmail(learner.email, "New Course Enrolment", emailContent);

    await sendSMS(emailContent);

    return res
      .status(200)
      .json({ message: "Successfully Enrolled to Course", learner });
  } catch (error) {
    console.error("Error enrolling to course");
    return res.status(500).json({ error: "Error enroling to course" });
  }
};

const learnerViewCourse = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const learnerId = req.headers.userid;

    // Find the learner
    const learner = await Learner.findOne({ learnerId });

    // Check if the learner exists
    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    // Check if the learner is enrolled in the course
    if (!learner.enrolledCourses.includes(courseCode)) {
      return res.status(403).json({
        message:
          "You are not enrolled in this course. Please enroll to access it.",
      });
    }
    const courseContent = await await axios.get(
      `${COURSE_MICRO_SERVICE_BASE_URL}/courseCode/${courseCode}`
    );

    return res.status(200).json({ courseContent });
  } catch (error) {
    console.error("Error viewing course:", error);
    return res.status(500).json({ error: "Error viewing course" });
  }
};

const learnerUnenrolFromCourse = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const learner = await Learner.findOne({ learnerId: req.headers.userid });

    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    if (!learner.enrolledCourses.includes(courseCode)) {
      return res
        .status(400)
        .json({ message: "Learner is not enrolled in this course" });
    }

    // Remove the courseCode from the enrolledCourses array
    learner.enrolledCourses = learner.enrolledCourses.filter(
      (code) => code !== courseCode
    );

    // Save the updated learner
    await learner.save();

    // to provide confirmation that the unenrollment was successful
    const updatedLearner = await Learner.findOne({
      learnerId: req.headers.userid,
    });

    const emailContent = `Dear ${updatedLearner.userName},\n\n This is to infrom that you have un enrolled from the course ${courseCode}. \n\n Please enrol again if you need to acess course content\n\n -Learner Manager-`;
    await sendEmail(updatedLearner.email, "Course Un-Enrolment", emailContent);

    await sendSMS(emailContent);

    return res.status(200).json({
      message: "Successfully Unenrolled from Course",
      learner: updatedLearner,
    });
  } catch (error) {
    console.error("Error unenrolling from course:", error);
    return res.status(500).json({ error: "Error unenrolling from course" });
  }
};

const addCourseProgress = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const learner = await Learner.findOne({ learnerId: req.headers.userid });

    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    if (!learner.enrolledCourses.includes(courseCode)) {
      return res
        .status(400)
        .json({ message: "Please enroll in the course to add progress" });
    }

    const { completedLectures, quizScores } = req.body;

    // Input validation
    if (typeof completedLectures !== "number" || !Array.isArray(quizScores)) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const totalQuizzes = 5; // assuming total number of quizzes per course is 5
    const totalLectures = 12; // assuming total number of lectures per course is 12
    const maxScorePerQuiz = 10; // assuming maximum score per quiz is 10

    // Calculating the average quiz score
    const totalQuizScore = quizScores.reduce(
      (acc, curr) => acc + curr.score,
      0
    );
    const averageQuizScore = totalQuizScore / totalQuizzes;

    // Type casting and calculating overall completion
    const lecturesCompletion = (completedLectures / totalLectures) * 100;
    const quizzesCompletion = (averageQuizScore / maxScorePerQuiz) * 100;
    const overallCompletion = (lecturesCompletion + quizzesCompletion) / 2; // Taking average

    // Create progress data object
    const progressData = {
      course: courseCode,
      completedLectures: completedLectures,
      quizScores: quizScores,
      overallCompletion: overallCompletion,
    };

    // Push progress data to learner's progress array
    learner.progress.push(progressData);

    // Save the learner document
    await learner.save();

    // Return success response
    return res
      .status(200)
      .json({ message: "Progress added for course", learner });
  } catch (error) {
    console.error("Error adding course progress:", error);
    return res.status(500).json({ error: "Error adding course progress" });
  }
};

const updateCourseProgress = async (req, res) => {
  try {
    const { courseCode } = req.params;
    const { completedLectures, quizScores } = req.body;

    // Find the learner
    const learner = await Learner.findOne({ learnerId: req.headers.userid });

    // Check if the learner exists
    if (!learner) {
      return res.status(404).json({ message: "Learner not found" });
    }

    // Check if the learner is enrolled in the course
    if (!learner.enrolledCourses.includes(courseCode)) {
      return res
        .status(400)
        .json({ message: "Learner is not enrolled in the course" });
    }

    // Find the progress for the specified course
    const progressIndex = learner.progress.findIndex(
      (progress) => progress.course === courseCode
    );

    // Check if progress for the course exists
    if (progressIndex === -1) {
      return res
        .status(404)
        .json({ message: "Progress for the course not found" });
    }

    // Update completed lectures and quiz scores
    learner.progress[progressIndex].completedLectures = completedLectures;
    learner.progress[progressIndex].quizScores = quizScores;

    // Recalculate overall completion
    const totalQuizzes = 5;
    const totalLectures = 12;
    const maxScorePerQuiz = 10;
    const lecturesCompletion = (completedLectures / totalLectures) * 100;
    const quizzesCompletion =
      (quizScores / (totalQuizzes * maxScorePerQuiz)) * 100;
    learner.progress[progressIndex].overallCompletion =
      (lecturesCompletion + quizzesCompletion) / 2;

    // Save the updated learner document
    await learner.save();

    return res
      .status(200)
      .json({ message: "Progress updated for course", learner });
  } catch (error) {
    console.error("Error updating course progress:", error);
    return res.status(500).json({ error: "Error updating course progress" });
  }
};

export {
  getCourses,
  getCurrentLearner,
  addLearner,
  learnerEnroltoCourses,
  learnerUnenrolFromCourse,
  addCourseProgress,
  updateCourseProgress,
  learnerViewCourse,
};
