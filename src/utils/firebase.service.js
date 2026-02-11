const admin = require("firebase-admin");
const path = require("path");

class FirebaseService {
    constructor() {
        this.initialized = false;
    }

    /**
     * Initialize Firebase Admin SDK
     */
    initialize() {
        if (this.initialized) {
            return;
        }

        try {
            const serviceAccountPath =
                process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

            if (!serviceAccountPath) {
                console.warn(
                    "Firebase service account path not configured. FCM notifications will not work.",
                );
                return;
            }

            const serviceAccount = require(path.resolve(serviceAccountPath));

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
            });

            this.initialized = true;
            console.log("Firebase Admin SDK initialized successfully");
        } catch (error) {
            console.error(
                "Failed to initialize Firebase Admin SDK:",
                error.message,
            );
        }
    }

    /**
     * Send push notification to a user via FCM
     * @param {string} fcmToken - User's FCM device token
     * @param {Object} notification - Notification payload
     * @param {string} notification.title - Notification title
     * @param {string} notification.body - Notification body
     * @param {Object} data - Additional data payload
     * @returns {Promise<string>} - Message ID if successful
     */
    async sendNotification(fcmToken, notification, data = {}) {
        if (!this.initialized) {
            throw new Error("Firebase Admin SDK is not initialized");
        }

        if (!fcmToken) {
            throw new Error("FCM token is required");
        }

        const message = {
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data: {
                ...data,
                timestamp: new Date().toISOString(),
            },
            token: fcmToken,
        };

        try {
            const response = await admin.messaging().send(message);
            console.log("Successfully sent notification:", response);
            return response;
        } catch (error) {
            console.error("Error sending notification:", error);
            throw error;
        }
    }

    /**
     * Send notifications to multiple users
     * @param {Array<string>} fcmTokens - Array of FCM device tokens
     * @param {Object} notification - Notification payload
     * @param {Object} data - Additional data payload
     * @returns {Promise<Object>} - Batch response
     */
    async sendMulticastNotification(fcmTokens, notification, data = {}) {
        if (!this.initialized) {
            throw new Error("Firebase Admin SDK is not initialized");
        }

        if (!fcmTokens || fcmTokens.length === 0) {
            throw new Error("At least one FCM token is required");
        }

        const message = {
            notification: {
                title: notification.title,
                body: notification.body,
            },
            data: {
                ...data,
                timestamp: new Date().toISOString(),
            },
            tokens: fcmTokens,
        };

        try {
            const response = await admin.messaging().sendMulticast(message);
            console.log(
                `Successfully sent ${response.successCount} notifications`,
            );
            if (response.failureCount > 0) {
                console.log(
                    `Failed to send ${response.failureCount} notifications`,
                );
            }
            return response;
        } catch (error) {
            console.error("Error sending multicast notification:", error);
            throw error;
        }
    }

    /**
     * Verify if a token is valid
     * @param {string} fcmToken - FCM device token
     * @returns {Promise<boolean>}
     */
    async verifyToken(fcmToken) {
        if (!this.initialized) {
            return false;
        }

        try {
            await admin.messaging().send(
                {
                    token: fcmToken,
                    data: { test: "true" },
                },
                true,
            ); // dry run
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Create singleton instance
const firebaseService = new FirebaseService();

module.exports = firebaseService;
