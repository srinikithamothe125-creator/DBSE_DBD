import {
  useEffect,
  useState
} from "react";

function NgoDashboard({ user }) {
  const [requests, setRequests] = useState([]);

  // ==========================================
  // LOAD NGO REQUESTS
  // ==========================================

  function loadRequests() {
    const allRequests =
      JSON.parse(
        localStorage.getItem("foodconnect_requests")
      ) || [];

    const myRequests =
      allRequests.filter(
        (request) =>
          request.ngo_id === user?.user_id
      );

    setRequests(myRequests);
  }

  useEffect(() => {
    loadRequests();
  }, [user]);

  // ==========================================
  // SEND ARRIVAL MESSAGE TO DONOR
  // ==========================================

  function sendArrivalMessage(requestId) {
    const message = window.prompt(
      "Enter message for the donor:",
      "Hi, I am arriving to collect the food donation."
    );

    // If user cancels or enters empty message
    if (
      message === null ||
      message.trim() === ""
    ) {
      return;
    }

    const allRequests =
      JSON.parse(
        localStorage.getItem(
          "foodconnect_requests"
        )
      ) || [];

    const updatedRequests =
      allRequests.map((request) => {
        if (
          request.request_id === requestId
        ) {
          return {
            ...request,

            // Change status
            status: "ARRIVING",

            // NGO name
            ngo_name: user?.name,

            // Message to donor
            arrival_message: message,

            // Arrival time
            arrival_at:
              new Date().toISOString()
          };
        }

        return request;
      });

    localStorage.setItem(
      "foodconnect_requests",
      JSON.stringify(updatedRequests)
    );

    alert(
      "Arrival message sent to the donor!"
    );

    loadRequests();
  }

  // ==========================================
  // MARK DONATION AS DELIVERED
  // ==========================================

  function markAsDelivered(requestId) {
    const allRequests =
      JSON.parse(
        localStorage.getItem(
          "foodconnect_requests"
        )
      ) || [];

    const updatedRequests =
      allRequests.map((request) => {
        if (
          request.request_id === requestId
        ) {
          return {
            ...request,

            status: "DELIVERED",

            delivered_at:
              new Date().toISOString()
          };
        }

        return request;
      });

    localStorage.setItem(
      "foodconnect_requests",
      JSON.stringify(updatedRequests)
    );

    // ==========================================
    // UPDATE DONATION STATUS
    // ==========================================

    const allDonations =
      JSON.parse(
        localStorage.getItem(
          "foodconnect_donations"
        )
      ) || [];

    const request =
      allRequests.find(
        (item) =>
          item.request_id === requestId
      );

    if (request) {
      const updatedDonations =
        allDonations.map((donation) => {
          if (
            donation.donation_id ===
            request.donation_id
          ) {
            return {
              ...donation,
              status: "COMPLETED"
            };
          }

          return donation;
        });

      localStorage.setItem(
        "foodconnect_donations",
        JSON.stringify(updatedDonations)
      );
    }

    alert(
      "Donation marked as delivered successfully!"
    );

    loadRequests();
  }

  // ==========================================
  // SEPARATE ACTIVE & DELIVERED REQUESTS
  // ==========================================

  const activeRequests =
    requests.filter(
      (request) =>
        request.status !== "DELIVERED"
    );

  const deliveredRequests =
    requests.filter(
      (request) =>
        request.status === "DELIVERED"
    );

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
            NGO DASHBOARD
          </p>

          <h1>
            Welcome, {user?.name}
          </h1>

          <p>
            Manage your food
            donation requests.
          </p>

        </div>

        <div className="dashboard-stat">

          <strong>
            {requests.length}
          </strong>

          <span>
            Total Requests
          </span>

        </div>

      </div>


      {/* =====================================
          ACTIVE REQUESTS
      ====================================== */}

      <div className="dashboard-card">

        <h2>
          My Donation Requests
        </h2>

        {activeRequests.length === 0 ? (

          <div className="no-donations">

            <p>
              No active donation
              requests.
            </p>

          </div>

        ) : (

          <div className="request-list">

            {activeRequests.map(
              (request) => (

                <div
                  className="request-card"
                  key={request.request_id}
                >

                  <h3>
                    Request #
                    {request.request_id}
                  </h3>

                  <p>
                    <strong>
                      Donation ID:
                    </strong>{" "}
                    {request.donation_id}
                  </p>

                  <p>
                    <strong>
                      Requested Quantity:
                    </strong>{" "}
                    {request.requested_quantity}
                  </p>

                  <p>
                    <strong>
                      Message:
                    </strong>{" "}
                    {request.message ||
                      "No message"}
                  </p>

                  <p>
                    <strong>
                      Requested At:
                    </strong>{" "}
                    {request.requested_at
                      ? new Date(
                          request.requested_at
                        ).toLocaleString()
                      : "Not available"}
                  </p>

                  {/* ARRIVAL MESSAGE */}
                  {request.status ===
                    "ARRIVING" && (
                    <div className="arrival-info">

                      <p>
                        <strong>
                          🚗 Arrival Message:
                        </strong>
                      </p>

                      <p className="arrival-text">
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

                    </div>
                  )}

                  {/* STATUS */}

                  <span
                    className={
                      `request-status ${request.status}`
                    }
                  >
                    {request.status}
                  </span>


                  {/* =================================
                      I'M ARRIVING BUTTON
                  ================================== */}

                  {request.status ===
                    "PENDING" && (

                    <button
                      className="primary-btn arrival-btn"
                      onClick={() =>
                        sendArrivalMessage(
                          request.request_id
                        )
                      }
                    >
                      🚗 I'm Arriving
                    </button>

                  )}


                  {/* =================================
                      MARK DELIVERED BUTTON
                  ================================== */}

                  {request.status ===
                    "ARRIVING" && (

                    <button
                      className="primary-btn delivery-btn"
                      onClick={() =>
                        markAsDelivered(
                          request.request_id
                        )
                      }
                    >
                      ✓ Mark as Delivered
                    </button>

                  )}

                </div>

              )
            )}

          </div>

        )}

      </div>


      {/* =====================================
          DONATION DELIVERY HISTORY
      ====================================== */}

      <div className="dashboard-card history-card">

        <h2>
          Donation Delivery History
        </h2>

        <p className="history-description">
          History of food donations
          successfully delivered to the NGO.
        </p>


        {deliveredRequests.length === 0 ? (

          <div className="no-donations">

            <p>
              No delivered donations yet.
            </p>

          </div>

        ) : (

          <div className="request-list">

            {deliveredRequests.map(
              (request) => (

                <div
                  className="request-card delivered-card"
                  key={request.request_id}
                >

                  <h3>
                    Donation Delivered ✓
                  </h3>

                  <p>
                    <strong>
                      Request ID:
                    </strong>{" "}
                    {request.request_id}
                  </p>

                  <p>
                    <strong>
                      Donation ID:
                    </strong>{" "}
                    {request.donation_id}
                  </p>

                  <p>
                    <strong>
                      Quantity Received:
                    </strong>{" "}
                    {request.requested_quantity}
                  </p>

                  <p>
                    <strong>
                      Requested On:
                    </strong>{" "}
                    {request.requested_at
                      ? new Date(
                          request.requested_at
                        ).toLocaleString()
                      : "Not available"}
                  </p>

                  <p>
                    <strong>
                      Delivered On:
                    </strong>{" "}
                    {request.delivered_at
                      ? new Date(
                          request.delivered_at
                        ).toLocaleString()
                      : "Not available"}
                  </p>

                  <p>
                    <strong>
                      Message:
                    </strong>{" "}
                    {request.message ||
                      "No message"}
                  </p>

                  {/* SHOW ARRIVAL MESSAGE IN HISTORY */}

                  {request.arrival_message && (
                    <div className="arrival-info">

                      <p>
                        <strong>
                          🚗 Arrival Message:
                        </strong>
                      </p>

                      <p className="arrival-text">
                        {request.arrival_message}
                      </p>

                    </div>
                  )}

                  <span className="request-status DELIVERED">
                    DELIVERED
                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </section>
  );
}

export default NgoDashboard;