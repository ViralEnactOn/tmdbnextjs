const jwt = require("jsonwebtoken");

// Function to check if a JWT token is expired
function isTokenExpired(token) {
  try {
    const decoded = jwt.decode(token);
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    // Check if the token's expiration time is in the past
    if (decoded.exp < currentTime) {
      return true; // Token is expired
    } else {
      return decoded; // Token is not expired
    }
  } catch (error) {
    // Token decoding or verification failed
    console.error("JWT decoding error:", error);
    return true; // Treat it as expired to be safe
  }
}

module.exports = {
  isTokenExpired,
};
