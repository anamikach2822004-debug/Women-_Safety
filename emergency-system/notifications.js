
const API_BASE_URL = "http://127.0.0.1:5000";

// Send emergency notification
async function sendEmergencyNotification(incidentId) {

    if (!incidentId) {
        console.error("Incident ID is required.");
        return false;
    }

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/notifications/emergency`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    incident_id: incidentId,
                    message: "An emergency SOS alert has been triggered. Please contact the user immediately."
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Notification could not be sent."
            );
        }

        console.log("Emergency notification:", result);

        showNotificationMessage(
            "Emergency notification request submitted.",
            "success"
        );

        return true;

    } catch (error) {

        console.error("Notification Error:", error);

        showNotificationMessage(
            error.message || "Failed to send emergency notification.",
            "error"
        );

        return false;
    }
}

// Display notification status
function showNotificationMessage(message, type) {

    let element = document.getElementById("notificationStatus");

    if (!element) {

        element = document.createElement("p");
        element.id = "notificationStatus";

        document.body.appendChild(element);
    }

    element.textContent = message;
    element.dataset.type = type;
}

// Export function
export {
    sendEmergencyNotification,
    showNotificationMessage
};
