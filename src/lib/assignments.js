import { databases, VITE_APPWRITE_DATABASE_ID, VITE_ASSIGNMENTS_COLLECTION_ID } from "../lib/appwrite";
import { ID, Query, Permission, Role } from "appwrite";

// generic function to update any field in an assignment
export const updateAssignment = async (assignmentId, data) => {
    try {
        const response = await databases.updateDocument(
            VITE_APPWRITE_DATABASE_ID,
            VITE_ASSIGNMENTS_COLLECTION_ID,
            assignmentId,
            data
        );
        return response;
    } catch (error) {
        console.error("failed to update assignment:", error);
    }
};

// function to update the time spent on an assignment
export const updateAssignmentTime = async (assignmentId, newTimeSpent) => {
    try {
        const response = await databases.updateDocument(
            VITE_APPWRITE_DATABASE_ID,
            VITE_ASSIGNMENTS_COLLECTION_ID,
            assignmentId,
            { actualTimeSpent: newTimeSpent }
        );
        return response;
    } catch (error) {
        console.error("failed to update assignment time:", error);
    }
};

// get all assignments for a specific user
export const getAllAssignments = async (userId) => {
    try {
        const response = await databases.listDocuments(
            VITE_APPWRITE_DATABASE_ID,
            VITE_ASSIGNMENTS_COLLECTION_ID,
            [Query.equal("userId", userId)]
        );
        return response.documents;
    } catch (error) {
        console.error("failed to fetch all assignments:", error);
        return [];
    }
};

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
            permissions
        );
        return response;
    } catch (error) {
        console.error("failed to create assignment:", error);
    }
};