// sign-up.js - Frontend JavaScript untuk integrasi dengan backend AWS

document.addEventListener("DOMContentLoaded", function () {
  const signupBtn = document.getElementById("signupBtn");
  const nameInput = document.getElementById("firstName");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.querySelector(".password-toggle");

  // Toggle password visibility
  passwordToggle.addEventListener("click", function () {
    const type =
      passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);

    // Update icon (with slash when showing password)
    const svg = passwordToggle.querySelector("svg");
    if (type === "text") {
      passwordToggle.classList.add("showing");
      // Add slash line for eye-off
      svg.innerHTML =
        '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#222" stroke-width="2" fill="none"/>' +
        '<path d="M4 4l16 16" stroke="#c33" stroke-width="2" />';
    } else {
      passwordToggle.classList.remove("showing");
      // Normal eye
      svg.innerHTML =
        '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#222" stroke-width="2" fill="none"/>' +
        '<circle cx="12" cy="12" r="3" stroke="#222" stroke-width="2" fill="none"/>';
    }
  });

  // Handle form submission
  signupBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    // Get form data
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    // Basic validation
    if (!name || !email || !password) {
      showError("Please fill in all fields");
      return;
    }

    if (!isValidEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      showError("Password must be at least 6 characters long");
      return;
    }

    // Show loading state
    const originalText = signupBtn.textContent;
    signupBtn.textContent = "CREATING ACCOUNT...";
    signupBtn.disabled = true;

    try {
      // Call backend API
      const response = await fetch("Link Backend API Endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        // Success - redirect to success page
        window.location.href = `/register-success?message=${encodeURIComponent(
          data.message
        )}&userId=${data.data.userId}`;
      } else {
        // Handle API error
        showError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showError("Network error. Please check your connection and try again.");
    } finally {
      // Reset button state
      signupBtn.textContent = originalText;
      signupBtn.disabled = false;
    }
  });

  // Helper functions
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(message) {
    // Remove existing error message
    const existingError = document.querySelector(".error-message");
    if (existingError) {
      existingError.remove();
    }

    // Create new error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error-message";
    errorDiv.style.cssText = `
            background-color: #fee;
            color: #c33;
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 15px;
            border: 1px solid #fcc;
            font-size: 14px;
        `;
    errorDiv.textContent = message;

    // Insert before the button
    signupBtn.parentNode.insertBefore(errorDiv, signupBtn);

    // Auto remove after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove();
      }
    }, 5000);
  }

  // Real-time validation feedback
  emailInput.addEventListener("blur", function () {
    if (emailInput.value.trim() && !isValidEmail(emailInput.value.trim())) {
      emailInput.style.borderColor = "#c33";
    } else {
      emailInput.style.borderColor = "";
    }
  });

  passwordInput.addEventListener("input", function () {
    if (passwordInput.value.length > 0 && passwordInput.value.length < 6) {
      passwordInput.style.borderColor = "#c33";
    } else {
      passwordInput.style.borderColor = "";
    }
  });
});
