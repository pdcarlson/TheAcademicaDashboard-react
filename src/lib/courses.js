import { databases, VITE_APPWRITE_DATABASE_ID, VITE_COURSES_COLLECTION_ID } from "../lib/appwrite";
import { ID, Query, Permission, Role } from "appwrite";

// get a single course document
export const getCourse = async (courseId) => {
    try {
        const response = await databases.getDocument(
            VITE_APPWRITE_DATABASE_ID,
            VITE_COURSES_COLLECTION_ID,
            courseId
        );
        return response;
    } catch (error) {
        console.error("failed to fetch course:", error);
    }
};

// get all courses for the current user
export const getCourses = async (userId) => {
    try {
        const response = await databases.listDocuments(
            VITE_APPWRITE_DATABASE_ID,
            VITE_COURSES_COLLECTION_ID,
            [Query.equal("userId", userId)]
        );
        return response.documents;
    } catch (error) {
        console.error("failed to fetch courses:", error);
        return [];
    }
};

// create a new course document
export const createCourse = async (courseData) => {
    try {
        // define permissions for this specific document
        const permissions = [
            Permission.read(Role.user(courseData.userId)),
            Permission.update(Role.user(courseData.userId)),
            Permission.delete(Role.user(courseData.userId)),
        ];

        const response = await databases.createDocument(
            VITE_APPWRITE_DATABASE_ID,
            VITE_COURSES_COLLECTION_ID,
            ID.unique(),
            courseData,
            permissions // pass the permissions array here
        );
        return response;
    } catch (error) {
        console.error("failed to create course:", error);
    }
};

// delete a course document
export const deleteCourse = async (courseId) => {
    try {
        await databases.deleteDocument(
            VITE_APPWRITE_DATABASE_ID,
            VITE_COURSES_COLLECTION_ID,
            courseId
        );
        return true;
    } catch (error) {
        console.error("failed to delete course:", error);
        return false;
    }
};