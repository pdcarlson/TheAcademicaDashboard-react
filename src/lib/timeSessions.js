import { databases, VITE_APPWRITE_DATABASE_ID, VITE_TIME_SESSIONS_COLLECTION_ID } from "../lib/appwrite";
import { ID, Permission, Role } from "appwrite";

// create a new time session document
export const createTimeSession = async (sessionData) => {
    try {
        const permissions = [
            Permission.read(Role.user(sessionData.userId)),
            Permission.update(Role.user(sessionData.userId)),
            Permission.delete(Role.user(sessionData.userId)),
        ];

        const response = await databases.createDocument(
            VITE_APPWRITE_DATABASE_ID,
            VITE_TIME_SESSIONS_COLLECTION_ID,
            ID.unique(),
            sessionData,
            permissions
        );
        return response;
    } catch (error) {
        console.error("failed to create time session:", error);
    }
};