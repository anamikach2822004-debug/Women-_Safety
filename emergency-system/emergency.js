
import { getCurrentLocation } from "./location.js";

const API_BASE_URL = "http://127.0.0.1:5000";

let activeIncidentId = null;
let isSendingSOS = false;

// Display messages on the dashboard
function showStatus(message, type = "info") {
    let status = document.getElementById("sosStatus");

    if (!status) {
        status = document.createElement("p");
        status.id = "sosStatus";

        const sosButton = document.getElementById("sosButton");

        if (sosButton) {
            sosButton.insertAdjacentElement("afterend", status);
        } else {
            document.body.appendChild(status);
        }
    }

    status.textContent = message;
    status.dataset.type = type;
}

// Activate SOS emergency alert
async function activateSOS() {

    if (isSendingSOS || activeIncidentId) {
        return;
    }

    const confirmed = confirm(
        "Are you sure you want to send an SOS emergency alert?"
    );

    if (!confirmed) return;

    const sosButton = document.getElementById("sosButton");

    try {
        isSendingSOS = true;

        if (sosButton) {
            sosButton.disabled = true;
            sosButton.textContent = "Sending SOS...";
        }

        showStatus("Getting your current location...");

        // Get GPS location
        let location = null;

        try {
            location = await getCurrentLocation();
        } catch (locationError) {
            console.warn("Location unavailable:", locationError);
        }

        showStatus("Sending emergency alert...");

        // Send emergency details to Flask backend
        const response = await fetch(
            `${API_BASE_URL}/api/incidents/sos`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    latitude: location?.latitude ?? null,
                    longitude: location?.longitude ?? null,
                    location_shared: Boolean(location),
                    message: "I need emergency assistance!",
                    status: "active"
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || result.error || "Unable to send SOS alert"
            );
        }

        activeIncidentId =
            result.incident_id ?? result.id ?? null;

        showStatus(
            "SOS alert successfully submitted. Please contact emergency services if you are in immediate danger.",
            "success"
        );

        const cancelButton =
            document.getElementById("cancelSOSButton");

        if (cancelButton) {
            cancelButton.hidden = false;
        }

    } catch (error) {
        console.error("SOS Error:", error);

        showStatus(
            error.message || "Something went wrong while sending SOS.",
            "error"
        );

    } finally {
        isSendingSOS = false;

        if (sosButton) {
            sosButton.disabled = false;
            sosButton.textContent = "Send SOS to my circle";
        }
    }
}

// Cancel active SOS alert
async function cancelSOS() {

    if (!activeIncidentId) {
        showStatus("No active SOS alert found.");
        return;
    }

    const confirmed = confirm(
        "Do you want to cancel your active emergency alert?"
    );

    if (!confirmed) return;

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/incidents/${activeIncidentId}/cancel`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(
                result.message || "Unable to cancel alert"
            );
        }

        activeIncidentId = null;

        showStatus("Your SOS alert has been cancelled.", "success");

        const cancelButton =
            document.getElementById("cancelSOSButton");

        if (cancelButton) {
            cancelButton.hidden = true;
        }

    } catch (error) {
        console.error("Cancel SOS Error:", error);
        showStatus(error.message, "error");
    }
}

// Connect buttons when dashboard loads
document.addEventListener("DOMContentLoaded", () => {

    const sosButton = document.getElementById("sosButton");
    const cancelButton =
        document.getElementById("cancelSOSButton");

    if (sosButton) {
        sosButton.addEventListener("click", activateSOS);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", cancelSOS);
        cancelButton.hidden = true;
    }

});

// Export functions for other modules if needed
export {
    activateSOS,
    cancelSOS
};
