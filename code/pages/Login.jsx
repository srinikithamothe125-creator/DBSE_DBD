import { useState } from "react";

function Login({
  onLogin,
  onNavigate
}) {
  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const users =
      JSON.parse(
        localStorage.getItem(
          "foodconnect_users"
        )
      ) || [];

    const user =
      users.find(
        (item) =>
          item.email.toLowerCase() ===
            email.toLowerCase() &&
          item.password === password
      );

    if (!user) {
      setError(
        "Invalid email or password."
      );
      return;
    }

    onLogin(user);
  }

  return (
    <section className="form-page">

      <div className="form-card">

        <h1>
          Login
        </h1>

        <p>
          Welcome back to FoodConnect
        </p>

        <form
          onSubmit={handleSubmit}
        >

          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(
                event.target.value
              )
            }
            required
          />

          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(
                event.target.value
              )
            }
            required
          />

          <button
            type="submit"
            className="primary-btn full-btn"
          >
            Login
          </button>

        </form>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        <p className="small-text">

          Don't have an account?

          <button
            className="text-btn"
            onClick={() =>
              onNavigate("register")
            }
          >
            Register
          </button>

        </p>

      </div>

    </section>
  );
}

export default Login;