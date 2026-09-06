document.addEventListener("DOMContentLoaded", () => {

    const adminLoginForm =
        document.getElementById("adminLoginForm");

    const adminId =
        document.getElementById("adminId");

    const adminPassword =
        document.getElementById("adminPassword");

    const loginError =
        document.getElementById("adminLoginError");

    const passwordToggle =
        document.getElementById("adminPasswordToggle");


    /* ================================================
       DEMO ADMIN CREDENTIALS

       Frontend prototype only.
       Never use hard-coded credentials in production.
    ================================================= */

    const DEMO_ADMIN = {
        id: "admin2026",
        password: "admin123"
    };


    adminLoginForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();


            const enteredId =
                adminId.value.trim();

            const enteredPassword =
                adminPassword.value;


            if (
                enteredId === DEMO_ADMIN.id &&
                enteredPassword === DEMO_ADMIN.password
            ) {

                localStorage.setItem(
                    "paddysetu_admin_logged_in",
                    "true"
                );


                window.location.href =
                    "admin-dashboard.html";

            } else {

                loginError.textContent =
                    "Invalid Admin ID or password. Use the demo credentials shown below.";

                loginError.classList.add("show");

            }

        }
    );


    /* ================================================
       SHOW / HIDE PASSWORD
    ================================================= */

    passwordToggle.addEventListener(
        "click",
        () => {

            const passwordVisible =
                adminPassword.type === "text";


            adminPassword.type =
                passwordVisible
                    ? "password"
                    : "text";


            passwordToggle.textContent =
                passwordVisible
                    ? "👁"
                    : "🙈";

        }
    );

});