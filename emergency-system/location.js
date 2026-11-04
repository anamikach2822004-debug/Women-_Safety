
// Get the user's current GPS location

function getCurrentLocation() {

    return new Promise((resolve, reject) => {

        // Check whether browser supports GPS
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by your browser."));
            return;
        }

        // Request current location
        navigator.geolocation.getCurrentPosition(

            // If location is successfully obtained
            (position) => {

                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy
                };

                console.log("User Location:", location);

                resolve(location);
            },

            // If location access fails
            (error) => {

                let message = "";

                switch (error.code) {

                    case error.PERMISSION_DENIED:
                        message = "Location permission denied. Please allow location access.";
                        break;

                    case error.POSITION_UNAVAILABLE:
                        message = "Your location is currently unavailable.";
                        break;

                    case error.TIMEOUT:
                        message = "Location request timed out.";
                        break;

                    default:
                        message = "Unable to get your location.";
                }

                reject(new Error(message));
            },

            // Location settings
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0
            }

        );

    });
}

// Export function for emergency.js
export { getCurrentLocation };

