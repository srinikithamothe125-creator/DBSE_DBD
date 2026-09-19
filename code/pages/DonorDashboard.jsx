import {
  useEffect,
  useState
} from "react";


function DonorDashboard({ user }) {

  // ==========================================
  // DONATION FORM
  // ==========================================

  const [form, setForm] = useState({
    food_type: "",
    description: "",
    quantity: "",
    unit: "Meals",
    location: "",
    available_from: "",
    available_until: "",
    prepared_at: "",
    storage_method: "Refrigerated",
    packaging_condition: "Sealed",
    appearance_condition: "Normal",
    smell_condition: "Normal",
    visible_spoilage: "NO"
  });


  const [foodPhoto, setFoodPhoto] =
    useState("");

  const [sealPhoto, setSealPhoto] =
    useState("");

  const [result, setResult] =
    useState(null);

  const [error, setError] =
    useState("");


  // ==========================================
  // NGO ARRIVAL MESSAGES
  // ==========================================

  const [arrivalMessages, setArrivalMessages] =
    useState([]);


  // ==========================================
  // UPDATE FORM FIELD
  // ==========================================

  function updateField(event) {

    setForm({
      ...form,
      [event.target.name]:
        event.target.value
    });

  }


  // ==========================================
  // LOAD NGO ARRIVAL MESSAGES
  // ==========================================

  function loadArrivalMessages() {

    const allRequests =
      JSON.parse(
        localStorage.getItem(
          "foodconnect_requests"
        )
      ) || [];


    const myMessages =
      allRequests.filter(
        (request) =>
          request.donor_id ===
            user?.user_id &&
          request.status ===
            "ARRIVING"
      );


    setArrivalMessages(
      myMessages
    );

  }


  // ==========================================
  // LOAD ARRIVAL MESSAGES WHEN DONOR LOGS IN
  // ==========================================

  useEffect(() => {

    loadArrivalMessages();

  }, [user]);


  // ==========================================
  // FOODGUARD SCREENING
  // ==========================================

  function screenFood() {

    const rejectReasons = [];


    if (
      form.visible_spoilage ===
      "YES"
    ) {

      rejectReasons.push(
        "Visible spoilage reported."
      );

    }


    if (
      [
        "Abnormal",
        "Mold",
        "Discolored"
      ].includes(
        form.appearance_condition
      )
    ) {

      rejectReasons.push(
        "Appearance condition is abnormal."
      );

    }


    if (
      [
        "Bad",
        "Unusual",
        "Sour"
      ].includes(
        form.smell_condition
      )
    ) {

      rejectReasons.push(
        "Unusual or bad smell reported."
      );

    }


    if (
      rejectReasons.length > 0
    ) {

      return {

        status: "REJECTED",

        notes:
          rejectReasons.join(" ")

      };

    }


    const reviewReasons = [];


    if (
      [
        "Open",
        "Damaged",
        "Leaking"
      ].includes(
        form.packaging_condition
      )
    ) {

      reviewReasons.push(
        "Packaging condition requires review."
      );

    }


    if (
      form.storage_method ===
      "I don't know"
    ) {

      reviewReasons.push(
        "Storage method is unknown."
      );

    }


    if (
      reviewReasons.length > 0
    ) {

      return {

        status:
          "REVIEW_REQUIRED",

        notes:
          reviewReasons.join(" ")

      };

    }


    return {

      status:
        "SCREENING_PASSED",

      notes:
        "FoodGuard screening passed based on the submitted information."

    };

  }


  // ==========================================
  // IMAGE UPLOAD
  // ==========================================

  function handleImage(
    event,
    setter
  ) {

    const file =
      event.target.files[0];


    if (!file) {
      return;
    }


    if (
      !file.type.startsWith(
        "image/"
      )
    ) {

      setError(
        "Please select an image file."
      );

      return;

    }


    const reader =
      new FileReader();


    reader.onload = () => {

      setter(
        reader.result
      );

    };


    reader.readAsDataURL(file);

  }


  // ==========================================
  // SUBMIT FOOD DONATION
  // ==========================================

  function handleSubmit(event) {

    event.preventDefault();


    setError("");

    setResult(null);


    if (!foodPhoto) {

      setError(
        "Please upload the food photo."
      );

      return;

    }


    if (!sealPhoto) {

      setError(
        "Please upload the sealed package photo."
      );

      return;

    }


    if (
      Number(form.quantity) <= 0
    ) {

      setError(
        "Quantity must be greater than 0."
      );

      return;

    }


    const screening =
      screenFood();


    const donations =
      JSON.parse(
        localStorage.getItem(
          "foodconnect_donations"
        )
      ) || [];


    const newDonation = {

      donation_id:
        Date.now(),


      donor_id:
        user?.user_id || 1,


      food_type:
        form.food_type,


      description:
        form.description,


      quantity:
        Number(form.quantity),


      unit:
        form.unit,


      location:
        form.location,


      available_from:
        form.available_from,


      available_until:
        form.available_until,


      prepared_at:
        form.prepared_at,


      storage_method:
        form.storage_method,


      packaging_condition:
        form.packaging_condition,


      appearance_condition:
        form.appearance_condition,


      smell_condition:
        form.smell_condition,


      visible_spoilage:
        form.visible_spoilage,


      food_photo:
        foodPhoto,


      seal_photo:
        sealPhoto,


      quality_status:
        screening.status,


      quality_notes:
        screening.notes,


      status:
        screening.status ===
        "SCREENING_PASSED"

          ? "AVAILABLE"

          : screening.status ===
            "REVIEW_REQUIRED"

          ? "PENDING"

          : "CANCELLED",


      created_at:
        new Date().toISOString()

    };


    donations.push(
      newDonation
    );


    localStorage.setItem(
      "foodconnect_donations",
      JSON.stringify(
        donations
      )
    );


    setResult(
      newDonation
    );


    // ==========================================
    // RESET FORM
    // ==========================================

    setForm({

      food_type: "",
      description: "",
      quantity: "",
      unit: "Meals",
      location: "",
      available_from: "",
      available_until: "",
      prepared_at: "",
      storage_method: "Refrigerated",
      packaging_condition: "Sealed",
      appearance_condition: "Normal",
      smell_condition: "Normal",
      visible_spoilage: "NO"

    });


    setFoodPhoto("");

    setSealPhoto("");

  }


  // ==========================================
  // PAGE
  // ==========================================

  return (

    <section className="dashboard-page">


      {/* =====================================
          HEADER
      ====================================== */}

      <div className="dashboard-header">

        <div>

          <p className="hero-label">
            DONOR DASHBOARD
          </p>


          <h1>
            Welcome, {user?.name}
          </h1>


          <p>
            Add surplus food and
            submit it for FoodGuard
            screening.
          </p>

        </div>

      </div>



      {/* =====================================
          NGO ARRIVAL NOTIFICATIONS
      ====================================== */}

      {arrivalMessages.length > 0 && (

        <div className="dashboard-card arrival-card">

          <h2>
            🚗 NGO Arrival Notification
          </h2>


          {arrivalMessages.map(
            (request) => (

              <div
                className="arrival-message"
                key={
                  request.request_id
                }
              >


                <h3>
                  {request.ngo_name}
                </h3>


                <p>

                  <strong>
                    Message:
                  </strong>

                </p>


                <p className="ngo-message">

                  {request.arrival_message}

                </p>


                <p>

                  <strong>
                    Arrival Time:
                  </strong>{" "}

                  {request.arrival_at

                    ? new Date(
                        request.arrival_at
                      ).toLocaleString()

                    : "Not available"}

                </p>


                <p>

                  <strong>
                    Donation ID:
                  </strong>{" "}

                  {request.donation_id}

                </p>


                <span className="request-status ARRIVING">

                  NGO IS ARRIVING

                </span>


              </div>

            )
          )}

        </div>

      )}



      {/* =====================================
          FOOD DONATION
      ====================================== */}

      <div className="dashboard-card">

        <h2>
          Food Donation
        </h2>


        <form
          onSubmit={handleSubmit}
        >


          {/* FOOD TYPE */}

          <label>
            Food Type
          </label>


          <input
            name="food_type"
            value={
              form.food_type
            }
            onChange={
              updateField
            }
            placeholder="Example: Vegetable Rice"
            required
          />



          {/* DESCRIPTION */}

          <label>
            Description
          </label>


          <textarea
            name="description"
            value={
              form.description
            }
            onChange={
              updateField
            }
            placeholder="Describe the food"
          />



          {/* QUANTITY + UNIT */}

          <div className="two-column">

            <div>

              <label>
                Quantity
              </label>


              <input
                type="number"
                step="0.01"
                min="0.01"
                name="quantity"
                value={
                  form.quantity
                }
                onChange={
                  updateField
                }
                required
              />

            </div>


            <div>

              <label>
                Unit
              </label>


              <select
                name="unit"
                value={
                  form.unit
                }
                onChange={
                  updateField
                }
              >

                <option>
                  Meals
                </option>


                <option>
                  Kg
                </option>


                <option>
                  Litres
                </option>


                <option>
                  Packets
                </option>

              </select>

            </div>

          </div>



          {/* LOCATION */}

          <label>
            Location
          </label>


          <input
            name="location"
            value={
              form.location
            }
            onChange={
              updateField
            }
            placeholder="Food pickup location"
            required
          />



          {/* AVAILABILITY */}

          <div className="two-column">

            <div>

              <label>
                Available From
              </label>


              <input
                type="datetime-local"
                name="available_from"
                value={
                  form.available_from
                }
                onChange={
                  updateField
                }
                required
              />

            </div>


            <div>

              <label>
                Available Until
              </label>


              <input
                type="datetime-local"
                name="available_until"
                value={
                  form.available_until
                }
                onChange={
                  updateField
                }
                required
              />

            </div>

          </div>



          {/* PREPARATION TIME */}

          <label>
            Preparation Time
          </label>


          <input
            type="datetime-local"
            name="prepared_at"
            value={
              form.prepared_at
            }
            onChange={
              updateField
            }
            required
          />



          {/* =================================
              FOODGUARD
          ================================== */}

          <h3 className="foodguard-title">
            🛡️ FoodGuard Screening
          </h3>



          {/* STORAGE */}

          <label>
            Storage Method
          </label>


          <select
            name="storage_method"
            value={
              form.storage_method
            }
            onChange={
              updateField
            }
          >

            <option>
              Refrigerated
            </option>


            <option>
              Room Temperature
            </option>


            <option>
              Frozen
            </option>


            <option>
              I don't know
            </option>

          </select>



          {/* PACKAGING */}

          <label>
            Packaging Condition
          </label>


          <select
            name="packaging_condition"
            value={
              form.packaging_condition
            }
            onChange={
              updateField
            }
          >

            <option>
              Sealed
            </option>


            <option>
              Good
            </option>


            <option>
              Open
            </option>


            <option>
              Damaged
            </option>


            <option>
              Leaking
            </option>

          </select>



          {/* APPEARANCE */}

          <label>
            Appearance Condition
          </label>


          <select
            name="appearance_condition"
            value={
              form.appearance_condition
            }
            onChange={
              updateField
            }
          >

            <option>
              Normal
            </option>


            <option>
              Abnormal
            </option>


            <option>
              Mold
            </option>


            <option>
              Discolored
            </option>

          </select>



          {/* SMELL */}

          <label>
            Smell Condition
          </label>


          <select
            name="smell_condition"
            value={
              form.smell_condition
            }
            onChange={
              updateField
            }
          >

            <option>
              Normal
            </option>


            <option>
              Good
            </option>


            <option>
              Bad
            </option>


            <option>
              Unusual
            </option>


            <option>
              Sour
            </option>

          </select>



          {/* SPOILAGE */}

          <label>
            Visible Spoilage?
          </label>


          <select
            name="visible_spoilage"
            value={
              form.visible_spoilage
            }
            onChange={
              updateField
            }
          >

            <option value="NO">
              No
            </option>


            <option value="YES">
              Yes
            </option>

          </select>



          {/* =================================
              FOOD PHOTO
          ================================== */}

          <div className="file-section">

            <label>
              📷 Food Photo
            </label>


            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                handleImage(
                  event,
                  setFoodPhoto
                )
              }
              required
            />


            <small>
              Upload a clear photo
              of the actual food.
            </small>


            {foodPhoto && (

              <img
                src={foodPhoto}
                alt="Food preview"
                className="donation-photo"
                style={{
                  marginTop: "12px"
                }}
              />

            )}

          </div>



          {/* =================================
              SEALED PACKAGE PHOTO
          ================================== */}

          <div className="file-section">

            <label>
              📦 Sealed Package Photo
            </label>


            <input
              type="file"
              accept="image/*"
              onChange={(event) =>
                handleImage(
                  event,
                  setSealPhoto
                )
              }
              required
            />


            <small>
              Upload a clear photo
              showing the package
              condition.
            </small>


            {sealPhoto && (

              <img
                src={sealPhoto}
                alt="Package preview"
                className="donation-photo"
                style={{
                  marginTop: "12px"
                }}
              />

            )}

          </div>



          {/* =================================
              SUBMIT
          ================================== */}

          <button
            type="submit"
            className="primary-btn full-btn"
          >

            Submit Food for Screening

          </button>


        </form>



        {/* ERROR */}

        {error && (

          <div className="error-box">

            {error}

          </div>

        )}



        {/* =================================
            FOODGUARD RESULT
        ================================== */}

        {result && (

          <div
            className={`screening-result ${
              result.quality_status ===
              "SCREENING_PASSED"

                ? "screening-success"

                : result.quality_status ===
                  "REVIEW_REQUIRED"

                ? "screening-review"

                : "screening-rejected"
            }`}
          >


            <h3>
              🛡️ FoodGuard Result
            </h3>


            <p>

              <strong>
                Status:
              </strong>{" "}

              {result.quality_status}

            </p>


            <p>

              <strong>
                Notes:
              </strong>{" "}

              {result.quality_notes}

            </p>


          </div>

        )}

      </div>


    </section>

  );

}


export default DonorDashboard;