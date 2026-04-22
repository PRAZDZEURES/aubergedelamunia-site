document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector(".php-email-form");

    if (!form) {
        return;
    }

    var submitButton = form.querySelector('button[type="submit"]');
    var defaultButtonLabel = submitButton ? submitButton.textContent : "";
    var nameInput = form.querySelector('input[name="Nom"]');
    var startDateInput = form.querySelector('input[name="Date d\'arrivée"]');
    var endDateInput = form.querySelector('input[name="Date de départ"]');
    var autoresponseInput = form.querySelector('input[name="_autoresponse"]');
    var states = {
        loading: form.querySelector('[data-form-state="loading"]'),
        error: form.querySelector('[data-form-state="error"]'),
        success: form.querySelector('[data-form-state="success"]')
    };

    function showState(stateName, message) {
        Object.keys(states).forEach(function (key) {
            if (states[key]) {
                states[key].classList.toggle("is-visible", key === stateName);
            }
        });

        if (message && states.error) {
            states.error.textContent = message;
        }
    }

    function clearState() {
        showState(null);
    }

    function todayAsIsoDate() {
        return new Date().toISOString().split("T")[0];
    }

    function buildAutoresponseMessage() {
        var visitorName = nameInput ? nameInput.value.trim() : "";
        var greeting = visitorName ? "Bonjour " + visitorName + "," : "Bonjour,";

        return [
            greeting,
            "",
            "Merci pour votre message et pour l'intérêt porté à l'Auberge de la Munia.",
            "",
            "Nous avons bien reçu votre demande et nous reviendrons vers vous sous 24h.",
            "",
            "Bien cordialement,",
            "L'équipe de la Munia"
        ].join("\n");
    }

    if (startDateInput && endDateInput) {
        startDateInput.min = todayAsIsoDate();

        startDateInput.addEventListener("change", function () {
            if (startDateInput.value) {
                endDateInput.min = startDateInput.value;
            } else {
                endDateInput.min = todayAsIsoDate();
            }

            if (endDateInput.value && startDateInput.value && endDateInput.value < startDateInput.value) {
                endDateInput.value = "";
            }

            endDateInput.setCustomValidity("");
        });

        endDateInput.addEventListener("change", function () {
            if (startDateInput.value && endDateInput.value && endDateInput.value < startDateInput.value) {
                endDateInput.setCustomValidity("La date de départ doit être postérieure ou égale à la date d'arrivée.");
            } else {
                endDateInput.setCustomValidity("");
            }
        });

        endDateInput.min = startDateInput.value || todayAsIsoDate();
    }

    form.addEventListener("input", function () {
        clearState();
    });

    form.addEventListener("submit", function (event) {
        if (typeof form.reportValidity === "function" && !form.reportValidity()) {
            event.preventDefault();
            return;
        }

        if (autoresponseInput) {
            autoresponseInput.value = buildAutoresponseMessage();
        }

        showState("loading");

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Envoi...";
        }
    });
});
