document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector(".php-email-form");

    if (!form) {
        return;
    }

    var submitButton = form.querySelector('button[type="submit"]');
    var defaultButtonLabel = submitButton ? submitButton.textContent : "";
    var startDateInput = form.querySelector('input[name="start_date"]');
    var endDateInput = form.querySelector('input[name="end_date"]');
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
                endDateInput.setCustomValidity("La date de depart doit etre posterieure ou egale a la date d'arrivee.");
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

        showState("loading");

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Envoi...";
        }
    });
});
