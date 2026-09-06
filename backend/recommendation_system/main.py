from math import radians, sin, cos, sqrt, atan2


# ============================================================
# 1. CENTER DATA
# ============================================================

centers = [
    {
        "id": 1,
        "name": "Center 1",
        "latitude": 28.123,
        "longitude": 77.456,
        "total_capacity": 500,
        "booked_weight": 300
    },
    {
        "id": 2,
        "name": "Center 2",
        "latitude": 28.223,
        "longitude": 77.556,
        "total_capacity": 500,
        "booked_weight": 450
    },
    {
        "id": 3,
        "name": "Center 3",
        "latitude": 28.323,
        "longitude": 77.656,
        "total_capacity": 500,
        "booked_weight": 500
    }
]


# ============================================================
# 2. BOOKING DATA
# ============================================================

bookings = []


# ============================================================
# 3. CALCULATE REMAINING CAPACITY
# ============================================================

def calculate_remaining_capacity(center):
    """
    Remaining capacity calculate karta hai.

    Remaining = Total Capacity - Booked Weight
    """

    remaining = (
        center["total_capacity"]
        - center["booked_weight"]
    )

    # Capacity negative nahi honi chahiye
    if remaining < 0:
        remaining = 0

    return remaining


# ============================================================
# 4. DISTANCE CALCULATION
# ============================================================

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Haversine formula ka use karke
    do locations ke beech distance KM me calculate karta hai.
    """

    earth_radius = 6371.0  # KM

    lat1 = radians(lat1)
    lon1 = radians(lon1)
    lat2 = radians(lat2)
    lon2 = radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        sin(dlat / 2) ** 2
        + cos(lat1)
        * cos(lat2)
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(
        sqrt(a),
        sqrt(1 - a)
    )

    distance = earth_radius * c

    return distance


# ============================================================
# 5. UPDATE CENTER DATA
# ============================================================

def update_center_information(
    farmer_latitude,
    farmer_longitude
):
    """
    Har center ke liye:
    - remaining capacity
    - farmer se distance

    calculate karta hai.
    """

    for center in centers:

        center["remaining_weight"] = (
            calculate_remaining_capacity(center)
        )

        center["distance"] = calculate_distance(
            farmer_latitude,
            farmer_longitude,
            center["latitude"],
            center["longitude"]
        )


# ============================================================
# 6. FIND ELIGIBLE CENTERS
# ============================================================

def find_eligible_centers(farmer_weight):
    """
    Sirf wahi centers return karega
    jo farmer ka complete weight accommodate
    kar sakte hain.
    """

    eligible_centers = []

    for center in centers:

        if center["remaining_weight"] >= farmer_weight:

            eligible_centers.append(center)

    return eligible_centers


# ============================================================
# 7. RECOMMEND CENTER
# ============================================================

def recommend_center(farmer_weight):
    """
    Recommendation rules:

    0 eligible centers
        -> No suitable center available

    1 eligible center
        -> Wahi center

    2 ya 3 eligible centers
        -> Nearest center
    """

    eligible_centers = find_eligible_centers(
        farmer_weight
    )

    # -----------------------------------------
    # CASE 1: No suitable center
    # -----------------------------------------

    if len(eligible_centers) == 0:

        return None, eligible_centers


    # -----------------------------------------
    # CASE 2: Only one suitable center
    # -----------------------------------------

    if len(eligible_centers) == 1:

        return eligible_centers[0], eligible_centers


    # -----------------------------------------
    # CASE 3: Multiple suitable centers
    # Nearest center select
    # -----------------------------------------

    recommended_center = min(
        eligible_centers,
        key=lambda center: center["distance"]
    )

    return recommended_center, eligible_centers


# ============================================================
# 8. DISPLAY ALL THREE CENTERS
# ============================================================

def display_center_information():
    """
    Teeno centers ki current information display karta hai.
    """

    print("\n")
    print("=" * 70)
    print("CENTER INFORMATION")
    print("=" * 70)

    for center in centers:

        print(
            f"\n{center['name']}"
        )

        print(
            f"  Total Capacity   : "
            f"{center['total_capacity']} Q"
        )

        print(
            f"  Booked Weight    : "
            f"{center['booked_weight']} Q"
        )

        print(
            f"  Remaining Weight : "
            f"{center['remaining_weight']} Q"
        )

        print(
            f"  Distance         : "
            f"{center['distance']:.2f} KM"
        )

    print("=" * 70)


# ============================================================
# 9. DISPLAY ELIGIBLE CENTERS
# ============================================================

def display_eligible_centers(
    eligible_centers
):
    """
    Sirf eligible centers display karta hai.
    """

    print("\n")
    print("=" * 70)
    print("ELIGIBLE CENTERS")
    print("=" * 70)

    if len(eligible_centers) == 0:

        print(
            "No suitable center available"
        )

        print("=" * 70)

        return

    for center in eligible_centers:

        print(
            f"\n{center['name']}"
        )

        print(
            f"  Remaining Weight : "
            f"{center['remaining_weight']} Q"
        )

        print(
            f"  Distance         : "
            f"{center['distance']:.2f} KM"
        )

    print("=" * 70)


# ============================================================
# 10. DISPLAY RECOMMENDATION
# ============================================================

def display_recommendation(
    recommended_center,
    farmer_weight
):
    """
    Final recommendation display karta hai.
    """

    print("\n")
    print("=" * 70)
    print("CENTER RECOMMENDATION")
    print("=" * 70)

    if recommended_center is None:

        print(
            "\nNo suitable center available"
        )

        print(
            "Farmer ke requested weight ke liye "
            "kisi bhi center me sufficient capacity nahi hai."
        )

        print("=" * 70)

        return

    print(
        f"\nRecommended Center : "
        f"{recommended_center['name']}"
    )

    print(
        f"Farmer Weight      : "
        f"{farmer_weight} Q"
    )

    print(
        f"Distance            : "
        f"{recommended_center['distance']:.2f} KM"
    )

    print(
        f"Remaining Capacity  : "
        f"{recommended_center['remaining_weight']} Q"
    )

    print(
        "\nStatus              : Available"
    )

    print("=" * 70)


# ============================================================
# 11. FINAL VALIDATION
# ============================================================

def validate_booking(
    center,
    farmer_weight
):
    """
    Booking confirm karne se just pehle
    capacity dobara check karta hai.
    """

    # Current capacity dobara calculate
    center["remaining_weight"] = (
        calculate_remaining_capacity(center)
    )

    if center["remaining_weight"] >= farmer_weight:

        return True

    return False


# ============================================================
# 12. CREATE BOOKING
# ============================================================

def create_booking(
    farmer_id,
    center_id,
    weight
):
    """
    Booking record create karta hai.
    """

    booking = {
        "farmer_id": farmer_id,
        "center_id": center_id,
        "weight": weight,
        "status": "confirmed"
    }

    bookings.append(booking)

    return booking


# ============================================================
# 13. CONFIRM BOOKING
# ============================================================

def confirm_booking(
    farmer_id,
    center,
    farmer_weight
):
    """
    Final booking confirmation.

    Pehle capacity validate karega,
    phir booking create karega,
    phir booked weight update karega.
    """

    # -----------------------------------------
    # Final capacity check
    # -----------------------------------------

    is_valid = validate_booking(
        center,
        farmer_weight
    )

    if not is_valid:

        return {
            "status": "failed",
            "message": "No suitable center available"
        }


    # -----------------------------------------
    # Booking create
    # -----------------------------------------

    booking = create_booking(
        farmer_id,
        center["id"],
        farmer_weight
    )


    # -----------------------------------------
    # Center booked weight update
    # -----------------------------------------

    center["booked_weight"] += farmer_weight


    # -----------------------------------------
    # New remaining capacity
    # -----------------------------------------

    center["remaining_weight"] = (
        calculate_remaining_capacity(center)
    )


    return {
        "status": "success",
        "message": "Booking confirmed",
        "booking": booking,
        "new_remaining_weight":
            center["remaining_weight"]
    }


# ============================================================
# 14. MAIN PROGRAM
# ============================================================

def main():

    print("\n")
    print("=" * 70)
    print("FARMER CENTER RECOMMENDATION SYSTEM")
    print("=" * 70)


    # --------------------------------------------------------
    # FARMER INFORMATION
    # --------------------------------------------------------

    farmer_id = 101

    farmer_weight = 40  # Quintal

    farmer_latitude = 28.150

    farmer_longitude = 77.500


    print("\nFARMER INFORMATION")
    print("-" * 70)

    print(
        f"Farmer ID      : {farmer_id}"
    )

    print(
        f"Required Weight: {farmer_weight} Q"
    )

    print(
        f"Latitude       : {farmer_latitude}"
    )

    print(
        f"Longitude      : {farmer_longitude}"
    )


    # --------------------------------------------------------
    # UPDATE CENTER INFORMATION
    # --------------------------------------------------------

    update_center_information(
        farmer_latitude,
        farmer_longitude
    )


    # --------------------------------------------------------
    # DISPLAY ALL CENTERS
    # --------------------------------------------------------

    display_center_information()


    # --------------------------------------------------------
    # FIND ELIGIBLE CENTERS
    # --------------------------------------------------------

    recommended_center, eligible_centers = (
        recommend_center(farmer_weight)
    )


    # --------------------------------------------------------
    # DISPLAY ELIGIBLE CENTERS
    # --------------------------------------------------------

    display_eligible_centers(
        eligible_centers
    )


    # --------------------------------------------------------
    # DISPLAY RECOMMENDATION
    # --------------------------------------------------------

    display_recommendation(
        recommended_center,
        farmer_weight
    )


    # --------------------------------------------------------
    # BOOKING
    # --------------------------------------------------------

    if recommended_center is not None:

        print("\n")
        print("=" * 70)
        print("BOOKING")
        print("=" * 70)

        print(
            "\nRecommended center ko confirm "
            "kar rahe hain..."
        )


        booking_result = confirm_booking(
            farmer_id,
            recommended_center,
            farmer_weight
        )


        print(
            f"\nStatus  : "
            f"{booking_result['status']}"
        )

        print(
            f"Message : "
            f"{booking_result['message']}"
        )


        if booking_result["status"] == "success":

            print(
                f"New Remaining Capacity: "
                f"{booking_result['new_remaining_weight']} Q"
            )


    # --------------------------------------------------------
    # FINAL CENTER STATUS
    # --------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("CENTER STATUS AFTER BOOKING")
    print("=" * 70)

    for center in centers:

        print(
            f"{center['name']} "
            f"→ Remaining: "
            f"{center['remaining_weight']} Q"
        )

    print("=" * 70)


    # --------------------------------------------------------
    # ALL BOOKINGS
    # --------------------------------------------------------

    print("\n")
    print("=" * 70)
    print("BOOKING RECORDS")
    print("=" * 70)

    for booking in bookings:

        print(booking)

    print("=" * 70)


# ============================================================
# PROGRAM START
# ============================================================

if __name__ == "__main__":
    main()