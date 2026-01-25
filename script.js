// script.js

const webhookURL = "https://discord.com/api/v10/webhooks/1465099927142137998/vmdgURrjqUPlZhoNYMTaDzjsVHXX4JCdy3ylFwo2h2n9_cHLlb1F2lN0Cm4n7h6kMYb6";

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contactForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const name = form.name.value.trim();
        const email = form.email.value.trim();
        const phone = form.phone.value.trim() || "N/A";
        const message = form.message.value.trim();

        // build Discord webhook payload
        const payload = {
            content: null,
            embeds: [{
                title: "📩 New Contact Form Submission",
                color: 5814783,
                fields: [
                    { name: "👤 Name", value: name, inline: true },
                    { name: "📧 Email", value: email, inline: true },
                    { name: "📱 Phone", value: phone, inline: true },
                    { name: "💬 Message", value: message, inline: false }
                ],
                timestamp: new Date().toISOString()
            }]
        };

        try {
            const response = await fetch(webhookURL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                showPopup("✅ Thank you! Your message has been sent.");
                form.reset();
            } else {
                showPopup("⚠️ Something went wrong. Please try again.");
            }
        } catch (error) {
            console.error(error);
            showPopup("❌ Error sending message. Please try again later.");
        }
    });
});

// Popup notification function
function showPopup(message) {
    const popup = document.createElement("div");
    popup.className = "form-popup";
    popup.textContent = message;
    document.body.appendChild(popup);

    // slide in
    setTimeout(() => popup.classList.add("show"), 10);

    // remove after a few seconds
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 300);
    }, 4000);
}
