import React, { useState } from "react";

const SignUp = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState({
    nameError: "",
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  const handleFormFieldChange = (fieldName, e) => {
    setUser({ ...user, [fieldName]: e.target.value });
  };

  const validateFields = () => {
    const newErrors = {};

    // Name validation (only alphabets)
    if (!/^[a-zA-Z\s]*$/.test(user.name)) {
      newErrors.nameError = "Name can only contain letters.";
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(user.email)) {
      newErrors.emailError = "Please enter a valid email address.";
    }

    // Password validation (at least 6 characters)
    if (user.password.length < 6) {
      newErrors.passwordError = "Password must be at least 6 characters long.";
    }

    // Confirm Password validation
    if (user.password !== user.passwordConfirm) {
      newErrors.confirmPasswordError = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createAccount = (e) => {
    e.preventDefault();
    if (validateFields()) {
      const jsonObj = JSON.stringify(user);
      localStorage.setItem("userDetail", jsonObj);
      window.location.reload();
    }
  };

  return (
    <div
      className="tab-pane fade"
      id="signup-tab-pane"
      role="tabpanel"
      aria-labelledby="signup-tab"
      tabIndex="0"
    >
      <div className="auth-form">
        <div className="mb-3 form-group">
          <i className="iconsax" data-icon="user-1"></i>
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            className="form-control"
            id="name"
            onChange={(e) => handleFormFieldChange("name", e)}
          />
          {errors.nameError && <small className="text-danger">{errors.nameError}</small>}
        </div>
        <div className="mb-3 form-group">
          <i className="iconsax" data-icon="mail"></i>
          <label htmlFor="emailid" className="form-label">
            Email ID
          </label>
          <input
            type="email"
            placeholder="Enter your mail id"
            className="form-control"
            id="emailid"
            onChange={(e) => handleFormFieldChange("email", e)}
          />
          {errors.emailError && <small className="text-danger">{errors.emailError}</small>}
        </div>
        <div className="mb-3 form-group">
          <i className="iconsax" data-icon="lock-2"></i>
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            placeholder="Enter your password"
            type="password"
            className="form-control"
            id="password"
            onChange={(e) => handleFormFieldChange("password", e)}
          />
          {errors.passwordError && <small className="text-danger">{errors.passwordError}</small>}
        </div>
        <div className="mb-3 form-group">
          <i className="iconsax" data-icon="lock-2"></i>
          <label htmlFor="password1" className="form-label">
            Confirm Password
          </label>
          <input
            placeholder="Enter your password"
            type="password"
            className="form-control"
            id="password1"
            onChange={(e) => handleFormFieldChange("passwordConfirm", e)}
          />
          {errors.confirmPasswordError && <small className="text-danger">{errors.confirmPasswordError}</small>}
        </div>
        <button
          className="btn-solid w-100 text-center mt-4"
          onClick={(e) => createAccount(e)}
        >
          Sign up
        </button>
        <h4 className="text-title text-center mt-2">
          Already have an account?{" "}
          <a data-cursor="pointer" href="/login">
            Sign in
          </a>
        </h4>
      </div>
    </div>
  );
};

export default SignUp;
