document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("centreLoginForm");

    const centreId =
        document.getElementById("centreId");

    const operatorId =
        document.getElementById("operatorId");

    const password =
        document.getElementById("centrePassword");

    const errorBox =
        document.getElementById("centreLoginError");

    const passwordToggle =
        document.getElementById("centrePasswordToggle");


    /* ================================================
       DEMO CENTRE ACCOUNT

       Frontend hackathon prototype only.
    ================================================= */

    const DEMO_CENTRE_OPERATOR = {
        centreId: "BPC-01",
        operatorId: "operator01",
        password: "centre123",
        centreName: "Berasia Procurement Centre"
    };


    /* ================================================
       LOGIN
    ================================================= */

    loginForm.addEventListener("submit", (event) => {

        event.preventDefault();

        const enteredCentreId =
            centreId.value.trim();

        const enteredOperatorId =
            operatorId.value.trim();

        const enteredPassword =
            password.value;


        if (
            enteredCentreId ===
                DEMO_CENTRE_OPERATOR.centreId &&

            enteredOperatorId ===
                DEMO_CENTRE_OPERATOR.operatorId &&

            enteredPassword ===
                DEMO_CENTRE_OPERATOR.password
        ) {

            const centreSession = {
                loggedIn: true,

                centreId:
                    DEMO_CENTRE_OPERATOR.centreId,

                centreName:
                    DEMO_CENTRE_OPERATOR.centreName,

                operatorId:
                    DEMO_CENTRE_OPERATOR.operatorId
            };


            localStorage.setItem(
                "paddysetu_centre_session",
                JSON.stringify(centreSession)
            );


            window.location.href =
                "centre-dashboard.html";

        } else {

            errorBox.textContent =
                "Invalid Centre ID, Operator ID or password. Use the demo credentials shown below.";

            errorBox.classList.add("show");

        }

    });


    /* ================================================
       REMOVE ERROR WHILE TYPING
    ================================================= */

    [
        centreId,
        operatorId,
        password
    ].forEach((input) => {

        input.addEventListener("input", () => {

            errorBox.classList.remove("show");

        });

    });


    /* ================================================
       PASSWORD VISIBILITY
    ================================================= */

    passwordToggle.addEventListener("click", () => {

        const isVisible =
            password.type === "text";


        password.type =
            isVisible
                ? "password"
                : "text";


        passwordToggle.textContent =
            isVisible
                ? "👁"
                : "🙈";

    });

});