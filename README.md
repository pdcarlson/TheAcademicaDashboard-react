### **Project Plan: The Academica Dashboard**

A personalized academic hub designed to unify scheduling, task management, and performance tracking into a single, intelligent interface.

#### **1. Core Objective**
To create a centralized dashboard for students to proactively manage their academic life, replacing the need to juggle multiple apps like Google Tasks and Calendar. The app will provide tools for detailed planning, focused work sessions, and insightful performance analytics.

#### **2. Core Feature Set (Initial Version)**

**Module 1: Dashboard & Scheduling**
* **Unified Dashboard:** A main view showing upcoming assignments, tests, and a weekly/monthly calendar view.
* **Google Calendar Integration:**
    * Automatically push new assignments with due dates to a dedicated Google Calendar.
    * Render the user's Google Calendar directly on the dashboard to show academic and personal commitments in one place.

**Module 2: Task & Course Management**
* **Course Creation:** Ability to add courses for the semester, assign a custom color for easy identification.
* **Comprehensive Task Creation:** Add tasks (assignments, exams, quizzes, labs, etc.) with the following properties:
    * Title & Description
    * Associated Course
    * Task Type (Homework, Exam, Project, etc.)
    * Due Date & Time
    * Estimated Time to Complete
* **Sub-tasks:** Break down larger assignments (e.g., a research paper) into smaller, checkable sub-tasks (e.g., "Outline," "Draft Intro," "Find Sources").

**Module 3: Productivity & Time Tracking**
* **Integrated Pomodoro Timer:** A built-in timer that users can start for any task.
    * Tracks "focus sessions" (e.g., 25-minute sprints).
    * Automatically logs the time spent towards the task's `actualTimeSpent`.
* **Focus Mode (Companion Feature):** When a Pomodoro session is active, trigger a "focus mode" that could interface with a browser extension to block a user-defined list of distracting websites.

**Module 4: Analytics & Review**
* **Grade Tracking:** Ability to input a score/grade for each completed assignment.
* **Grade Projection:** The dashboard will automatically calculate the current weighted average for each course and provide a simple calculator to determine what grade is needed on future assignments to achieve a target overall grade.
* **Weekly/Monthly Review:** An analytics page that visualizes key data points over a selected period, such as:
    * Total time spent studying (overall and per course).
    * Comparison of estimated vs. actual time spent on tasks.
    * Number of tasks completed.
    * Grade performance over time.

**Module 5: Notifications**
* **Smart Email Reminders:** Automated email notifications sent a configurable amount of time before a due date. The timing could eventually be made smarter based on the task's estimated duration.

#### **3. Proposed Tech Stack**
* **Frontend:** **React.js** with JavaScript (or TypeScript for better type safety).
* **Backend & Deployment:** **Appwrite** (Cloud or Self-Hosted)
    * **Authentication:** For user sign-up and login.
    * **Databases:** To store user data, courses, tasks, etc.
    * **Cloud Functions:** To handle server-side logic like sending automated email reminders.

#### **4. Basic Data Models (for Appwrite Databases)**

* **Users:** `(userId, name, email, googleAuthToken)`
* **Courses:** `(courseId, userId, courseName, professor, colorCode)`
* **Assignments:** `(assignmentId, courseId, title, type, dueDate, estimatedTime, actualTimeSpent, status, gradeReceived, maxGrade)`
* **Subtasks:** `(subtaskId, assignmentId, title, isCompleted)`
* **TimeSessions:** `(sessionId, assignmentId, startTime, endTime, duration)`

#### **5. Future Enhancements (Post-MVP)**

* **AI-Powered Smart Scheduling:** An algorithm that analyzes a user's free time on their Google Calendar and suggests optimal times to work on specific tasks based on deadlines, estimated time, and priority.
* **Automated Syllabus Parsing:** A feature to upload a course syllabus and have the app automatically extract and create all the assignments for the semester.
* **Spaced Repetition Study Planner:** A tool for exam preparation where users can input key topics, and the app schedules review sessions at scientifically-backed intervals to improve memory retention.