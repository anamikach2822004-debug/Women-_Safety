
const API_BASE_URL = "http://127.0.0.1:5000";

// Get all trusted contacts
async function getContacts() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/contacts`,
            {
                method: "GET",
                credentials: "include"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to fetch contacts");
        }

        displayContacts(result.contacts || result);

        return result.contacts || result;

    } catch (error) {
        console.error("Contacts Error:", error);
        showContactMessage(error.message, "error");
        return [];
    }
}

// Add a new trusted contact
async function addContact(name, phone, email = "") {

    if (!name.trim() || !phone.trim()) {
        showContactMessage("Name and phone number are required.", "error");
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/contacts`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    name: name.trim(),
                    phone: phone.trim(),
                    email: email.trim()
                })
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to add contact");
        }

        showContactMessage("Contact added successfully!", "success");

        await getContacts();

        return result;

    } catch (error) {
        console.error("Add Contact Error:", error);
        showContactMessage(error.message, "error");
    }
}

// Display contacts on dashboard
function displayContacts(contacts) {

    const container = document.getElementById("contactsList");

    if (!container) return;

    container.replaceChildren();

    if (!contacts || contacts.length === 0) {
        container.textContent = "No trusted contacts added yet.";
        return;
    }

    contacts.forEach(contact => {

        const card = document.createElement("div");
        card.className = "contact-card";

        const name = document.createElement("h4");
        name.textContent = contact.name;

        const phone = document.createElement("p");
        phone.textContent = contact.phone;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Remove";
        deleteButton.type = "button";

        deleteButton.addEventListener("click", () => {
            deleteContact(contact.id);
        });

        card.append(name, phone, deleteButton);
        container.appendChild(card);
    });
}

// Delete a trusted contact
async function deleteContact(contactId) {

    if (!confirm("Are you sure you want to remove this contact?")) {
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/contacts/${contactId}`,
            {
                method: "DELETE",
                credentials: "include"
            }
        );

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to delete contact");
        }

        showContactMessage("Contact removed successfully!", "success");

        await getContacts();

    } catch (error) {
        console.error("Delete Contact Error:", error);
        showContactMessage(error.message, "error");
    }
}

// Show contact messages
function showContactMessage(message, type) {

    let element = document.getElementById("contactMessage");

    if (!element) {
        element = document.createElement("p");
        element.id = "contactMessage";

        const container = document.getElementById("contactsList");

        if (container) {
            container.before(element);
        } else {
            document.body.appendChild(element);
        }
    }

    element.textContent = message;
    element.dataset.type = type;
}

// Export functions
export {
    getContacts,
    addContact,
    deleteContact,
    displayContacts
};
