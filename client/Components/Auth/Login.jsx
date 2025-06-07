import React, { useState, useEffect } from "react";

const Login = () => {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Check for user details on component mount
  useEffect(() => {
    try {
      const str = localStorage.getItem("userDetail");
      const parsedObj = JSON.parse(str);
      if (parsedObj?.name) {
        setUser(parsedObj);
      }
    } catch (error) {
      console.error("Error parsing user details from local storage", error);
    }
  }, []);

  // Handle login button click
  const handleLogin = () => {
    // Placeholder: Replace with actual login logic/verification
    if (email && password) {
      const userDetails = {
        name: "User", // Replace with actual name if needed
        email,
      };
      
      // Simulate login success by storing user details in localStorage
      localStorage.setItem("userDetail", JSON.stringify(userDetails));
      setUser(userDetails);
    } else {
      alert("Please enter both email and password.");
    }
  };

  return (
    <div
      className="tab-pane fade show active"
      id="login-tab-pane"
      role="tabpanel"
      aria-labelledby="login-tab"
      tabIndex="0"
    >
      <div className="auth-form">
        {user ? (
          ""
        ) : (
          <>
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-2 form-group">
              <i className="iconsax" data-icon="lock-2"></i>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                placeholder="Enter your password"
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </>
        )}

        <button
          onClick={user ? () => (window.location.href = "/chat") : handleLogin}
          data-cursor="pointer"
          className="btn-solid w-100 text-center mt-3"
        >
          {user ? "Start Chatting" : "Log me in"}
        </button>

        {user ? (
          ""
        ) : (
          <h4 className="text-title text-center mt-2">
            Don’t have an account? <a data-cursor="pointer">Sign up</a>
          </h4>
        )}
      </div>
    </div>
  );
};

export default Login;
