import { databases, VITE_APPWRITE_DATABASE_ID, VITE_COURSES_COLLECTION_ID } from "../lib/appwrite";
import { ID, Query } from "appwrite";

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
        const response = await databases.createDocument(
            VITE_APPWRITE_DATABASE_ID,
            VITE_COURSES_COLLECTION_ID,
            ID.unique(),
            courseData
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