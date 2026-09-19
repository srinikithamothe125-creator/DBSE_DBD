function Home({
  onNavigate
}) {
  return (
    <section className="home-page">

      <div className="hero">

        <div className="hero-text">

          <p className="hero-label">
            FOOD DONATION PLATFORM
          </p>

          <h1>
            Share Food.
            <br />
            Reduce Waste.
            <br />
            Help People.
          </h1>

          <p className="hero-description">
            FoodConnect helps households,
            restaurants and organizations
            connect surplus food with NGOs
            and communities in need.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() =>
                onNavigate("donations")
              }
            >
              View Donations
            </button>

            <button
              className="secondary-btn"
              onClick={() =>
                onNavigate("register")
              }
            >
              Join FoodConnect
            </button>

          </div>

        </div>

        <div className="hero-card">

          <div className="hero-icon">
            🍲
          </div>

          <h2>
            FoodGuard
          </h2>

          <p>
            Smart food quality screening
            using food details and photo
            evidence before donation requests.
          </p>

          <div className="hero-mini">

            <div>
              <strong>📸</strong>
              <span>Food Photo</span>
            </div>

            <div>
              <strong>📦</strong>
              <span>Package Photo</span>
            </div>

            <div>
              <strong>✓</strong>
              <span>Screening</span>
            </div>

          </div>

        </div>

      </div>

      <div className="stats">

        <div className="stat-card">
          <strong>
            7:00 AM
          </strong>
          <span>
            Opening Time
          </span>
        </div>

        <div className="stat-card">
          <strong>
            10:00 PM
          </strong>
          <span>
            Closing Time
          </span>
        </div>

        <div className="stat-card">
          <strong>
            100%
          </strong>
          <span>
            Digital Connection
          </span>
        </div>

      </div>

    </section>
  );
}

export default Home;