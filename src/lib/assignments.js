import { databases, VITE_APPWRITE_DATABASE_ID, VITE_ASSIGNMENTS_COLLECTION_ID } from "../lib/appwrite";
import { ID, Query, Permission, Role } from "appwrite";

// get all assignments for a specific course
export const getAssignmentsForCourse = async (courseId) => {
    try {
        const response = await databases.listDocuments(
            VITE_APPWRITE_DATABASE_ID,
            VITE_ASSIGNMENTS_COLLECTION_ID,
            [Query.equal("courseId", courseId)]
        );
        return response.documents;
    } catch (error) {
        console.error("failed to fetch assignments:", error);
        return [];
    }
};

// create a new assignment document
export const createAssignment = async (assignmentData) => {
    try {
        // define permissions for this specific document
        const permissions = [
            Permission.read(Role.user(assignmentData.userId)),
            Permission.update(Role.user(assignmentData.userId)),
            Permission.delete(Role.user(assignmentData.userId)),
        ];

        const response = await databases.createDocument(
            VITE_APPWRITE_DATABASE_ID,
            VITE_ASSIGNMENTS_COLLECTION_ID,
            ID.unique(),
            assignmentData,
            permissions // pass the permissions array here
        );
        return response;
    } catch (error) {
        console.error("failed to create assignment:", error);
    }
};