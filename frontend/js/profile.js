document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       GET STORED DATA
    ====================================================== */

    const farmer = Storage.get("farmer", {});
    const lands = Storage.get("lands", []);
    const farmerId = Storage.get("farmerId", {});
    const procurement = Storage.get("procurement", {});
    const token = Storage.get("token", {});


    /* =====================================================
       HELPERS
    ====================================================== */

    function getElement(id) {
        return document.getElementById(id);
    }


    function setText(id, value, fallback = "—") {

        const element = getElement(id);

        if (!element) return;

        element.textContent =
            value !== undefined &&
            value !== null &&
            value !== ""
                ? value
                : fallback;
    }


    function showToast(message) {

        const toast = getElement("profileToast");

        if (!toast) return;

        toast.textContent = message;

        toast.classList.add("show");

        setTimeout(() => {
            toast.classList.remove("show");
        }, 2500);

    }


    /* =====================================================
       FARMER INITIALS
    ====================================================== */

    function getInitials(name) {

        if (!name) {
            return "FR";
        }

        const parts = name
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        if (parts.length === 1) {
            return parts[0]
                .substring(0, 2)
                .toUpperCase();
        }

        return (
            parts[0][0] +
            parts[parts.length - 1][0]
        ).toUpperCase();
    }


    /* =====================================================
       LAND CALCULATION
    ====================================================== */

    function calculateTotalLand() {

        return lands.reduce((total, land) => {

            let area = Number(land.area) || 0;

            if (land.unit === "Hectare") {
                area *= 2.47105;
            }

            return total + area;

        }, 0);
    }


    /* =====================================================
       RENDER PROFILE
    ====================================================== */

    function renderProfile() {

        const totalLand = calculateTotalLand();


        /* Farmer top section */

        setText(
            "profileInitials",
            getInitials(farmer.name)
        );

        setText(
            "profileFarmerName",
            farmer.name
        );

        setText(
            "profileLocation",
            `${farmer.village || "—"}, ${farmer.state || "—"}`
        );

        setText(
            "profileFarmerIdBadge",
            farmerId.id
                ? `Farmer ID: ${farmerId.id}`
                : "Farmer ID: Not Generated"
        );


        /* Personal details */

        setText(
            "detailFarmerName",
            farmer.name
        );

        setText(
            "detailMobile",
            farmer.mobile
        );

        setText(
            "detailTehsil",
            farmer.tehsil
        );

        setText(
            "detailVillage",
            farmer.village
        );

        setText(
            "detailState",
            farmer.state
        );

        setText(
            "detailDistrict",
            farmer.district
        );


        /* Farmer / procurement details */

        setText(
            "detailFarmerId",
            farmerId.id || "Not Generated"
        );

        setText(
            "detailEligibleQuantity",
            procurement.eligibleQuantity
                ? `${procurement.eligibleQuantity} Quintal`
                : "Not Registered"
        );

        setText(
            "detailRegisteredLand",
            `${totalLand.toFixed(1)} Acre`
        );

        setText(
            "detailLandParcels",
            lands.length
        );

        setText(
            "detailCrop",
            procurement.crop || "Not Registered"
        );

        setText(
            "detailSeason",
            procurement.season || "Not Registered"
        );


        /* =================================================
           DEMO PROCUREMENT SUMMARY

           Prototype values only.
           Later history data can replace these.
        ================================================== */

        const hasCurrentProcurement =
            Boolean(procurement.id);

        const totalProcurements =
            hasCurrentProcurement ? 6 : 5;

        const completedProcurements = 5;

        const activeProcurements =
            hasCurrentProcurement ? 1 : 0;

        const previousQuantity = 154;

        const currentQuantity =
            Number(procurement.eligibleQuantity) || 0;

        const totalQuantity =
            previousQuantity + currentQuantity;


        setText(
            "summaryTotal",
            totalProcurements
        );

        setText(
            "summaryCompleted",
            completedProcurements
        );

        setText(
            "summaryActive",
            activeProcurements
        );

        setText(
            "summaryQuantity",
            `${totalQuantity} Quintal`
        );

    }


    /* =====================================================
       EDIT PROFILE
    ====================================================== */

    const editProfileButton =
        getElement("editProfileButton");

    const saveProfileButton =
        getElement("saveProfileButton");

    const cancelEditButton =
        getElement("cancelEditButton");


    function fillEditInputs() {

        getElement("editFarmerName").value =
            farmer.name || "";

        getElement("editMobile").value =
            farmer.mobile || "";

        getElement("editTehsil").value =
            farmer.tehsil || "";

        getElement("editVillage").value =
            farmer.village || "";

        getElement("editState").value =
            farmer.state || "";

        getElement("editDistrict").value =
            farmer.district || "";
    }


    function enableEditMode() {

        fillEditInputs();

        document.body.classList.add(
            "profile-editing"
        );

        editProfileButton.textContent =
            "Editing Profile";
    }


    function disableEditMode() {

        document.body.classList.remove(
            "profile-editing"
        );

        editProfileButton.textContent =
            "✎ Edit Profile";
    }


    if (editProfileButton) {

        editProfileButton.addEventListener(
            "click",
            enableEditMode
        );

    }


    if (cancelEditButton) {

        cancelEditButton.addEventListener(
            "click",
            disableEditMode
        );

    }


    /* =====================================================
       SAVE PROFILE CHANGES
    ====================================================== */

    if (saveProfileButton) {

        saveProfileButton.addEventListener(
            "click",
            () => {

                const updatedFarmer = {
                    ...farmer,

                    name:
                        getElement("editFarmerName")
                            .value
                            .trim(),

                    mobile:
                        getElement("editMobile")
                            .value
                            .trim(),

                    tehsil:
                        getElement("editTehsil")
                            .value
                            .trim(),

                    village:
                        getElement("editVillage")
                            .value
                            .trim(),

                    state:
                        getElement("editState")
                            .value
                            .trim(),

                    district:
                        getElement("editDistrict")
                            .value
                            .trim()
                };


                if (!updatedFarmer.name) {

                    showToast(
                        "Farmer name cannot be empty."
                    );

                    return;
                }


                Storage.set(
                    "farmer",
                    updatedFarmer
                );


                showToast(
                    "Profile updated successfully."
                );


                setTimeout(() => {
                    location.reload();
                }, 700);

            }
        );

    }


    /* =====================================================
       ACCOUNT OPTIONS
    ====================================================== */

    const changePasswordButton =
        getElement("changePasswordButton");

    const notificationButton =
        getElement("notificationButton");

    const languageButton =
        getElement("languageButton");


    if (changePasswordButton) {

        changePasswordButton.addEventListener(
            "click",
            () => {

                showToast(
                    "Change Password is a demo feature."
                );

            }
        );

    }


    if (notificationButton) {

        notificationButton.addEventListener(
            "click",
            () => {

                const currentSetting =
                    Storage.get(
                        "notificationsEnabled",
                        true
                    );


                Storage.set(
                    "notificationsEnabled",
                    !currentSetting
                );


                showToast(
                    !currentSetting
                        ? "Notifications enabled."
                        : "Notifications disabled."
                );

            }
        );

    }


    /* =====================================================
       LANGUAGE DEMO
    ====================================================== */

    if (languageButton) {

        languageButton.addEventListener(
            "click",
            () => {

                const languageValue =
                    getElement("languageValue");


                const currentLanguage =
                    Storage.get(
                        "profileLanguage",
                        "English"
                    );


                const nextLanguage =
                    currentLanguage === "English"
                        ? "हिन्दी"
                        : "English";


                Storage.set(
                    "profileLanguage",
                    nextLanguage
                );


                languageValue.textContent =
                    nextLanguage;


                showToast(
                    `Language changed to ${nextLanguage}.`
                );

            }
        );

    }


    /* Restore language */

    const savedLanguage =
        Storage.get(
            "profileLanguage",
            "English"
        );

    setText(
        "languageValue",
        savedLanguage
    );


    /* =====================================================
       LOGOUT
    ====================================================== */

    const logoutButton =
        getElement("logoutButton");


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            () => {

                /*
                  Prototype logout.

                  Farmer procurement data is intentionally
                  NOT deleted because LocalStorage is being
                  used as the prototype database.
                */

                showToast(
                    "Logged out successfully."
                );


                setTimeout(() => {

                    window.location.href =
                        "../index.html";

                }, 600);

            }
        );

    }


    /* =====================================================
       INITIAL RENDER
    ====================================================== */

    renderProfile();

});