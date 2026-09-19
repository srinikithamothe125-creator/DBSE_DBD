import { useState } from "react";

function Register({
  onNavigate
}) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "DONOR",
    organization_name: "",
    address: ""
  });

  const [message, setMessage] =
    useState("");

  function updateField(event) {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    setMessage("");

    const users =
      JSON.parse(
        localStorage.getItem(
          "foodconnect_users"
        )
      ) || [];

    const existingUser =
      users.find(
        (user) =>
          user.email.toLowerCase() ===
          form.email.toLowerCase()
      );

    if (existingUser) {
      setMessage(
        "Email already registered."
      );
      return;
    }

    const newUser = {
      user_id: Date.now(),

      name: form.name,

      email: form.email,

      phone: form.phone,

      password: form.password,

      role: form.role,

      organization_name:
        form.organization_name,

      address: form.address
    };

    users.push(newUser);

    localStorage.setItem(
      "foodconnect_users",
      JSON.stringify(users)
    );

    setMessage(
      "Registration successful! Please login."
    );

    setTimeout(() => {
      onNavigate("login");
    }, 1000);
  }

  return (
    <section className="form-page">

      <div className="form-card">

        <h1>
          Create Account
        </h1>

        <p>
          Join FoodConnect
        </p>

        <form
          onSubmit={handleSubmit}
        >

          <label>
            Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={updateField}
            required
          />

          <label>
            Email
          </label>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            required
          />

          <label>
            Phone
          </label>

          <input
            name="phone"
            value={form.phone}
            onChange={updateField}
          />

          <label>
            Password
          </label>

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={updateField}
            required
          />

          <label>
            Register As
          </label>

          <select
            name="role"
            value={form.role}
            onChange={updateField}
          >

            <option value="DONOR">
              Donor
            </option>

            <option value="NGO">
              NGO
            </option>

          </select>

          {form.role === "NGO" && (
            <>
              <label>
                NGO Organization Name
              </label>

              <input
                name="organization_name"
                value={
                  form.organization_name
                }
                onChange={updateField}
                required
              />
            </>
          )}

          <label>
            Address
          </label>

          <input
            name="address"
            value={form.address}
            onChange={updateField}
          />

          <button
            type="submit"
            className="primary-btn full-btn"
          >
            Create Account
          </button>

        </form>

        {message && (
          <div className="message-box">
            {message}
          </div>
        )}

      </div>

    </section>
  );
}

export default Register;