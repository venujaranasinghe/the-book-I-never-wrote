import { useState } from "react"
import "./App.css"
import apiService from "./services/api"

export default function AuthPage({ onLogin, mousePosition }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    birthYear: "",
    bio: "",
    password: ""
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!isLogin && !formData.username.trim()) {
      newErrors.username = "Username is required"
    } else if (!isLogin && formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
    }
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    
    if (!isLogin) {
      if (!formData.birthYear.trim()) {
        newErrors.birthYear = "Birth year is required"
      } else if (!/^\d{4}$/.test(formData.birthYear)) {
        newErrors.birthYear = "Please enter a valid 4-digit year"
      }
      
      if (!formData.bio.trim()) {
        newErrors.bio = "Biography is required"
      }
    }
    
    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setErrors({})

    try {
      if (isLogin) {
        // Login
        const credentials = {
          usernameOrEmail: formData.email, // Use email for login
          password: formData.password
        }
        
        const response = await apiService.login(credentials)
        
        // Store token and user data
        localStorage.setItem("authToken", response.token)
        localStorage.setItem("userData", JSON.stringify(response.user))
        
        onLogin(response.user)
      } else {
        // Registration
        const registrationData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          birthYear: parseInt(formData.birthYear),
          bio: formData.bio
        }
        
        const response = await apiService.register(registrationData)
        
        // Store token and user data
        localStorage.setItem("authToken", response.token)
        localStorage.setItem("userData", JSON.stringify(response.user))
        
        onLogin(response.user)
      }
    } catch (error) {
      console.error("Auth error:", error)
      setErrors({ general: error.message || "An error occurred. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container vintage-paper auth-page">
      <div className="paper-texture" />
      <div className="vintage-border" />
      <div
        className="cursor-glow"
        style={{
          left: mousePosition.x - 10,
          top: mousePosition.y - 10,
        }}
      />

      <header className="header">
        <div className="header-ornament">❦</div>
        <div className="header-meta">
          <span className="page-number">WELCOME</span>
          <span className="section">THE UNWRITTEN STORIES</span>
        </div>
        <div className="header-ornament">❦</div>
      </header>

      <main className="auth-content">
        <div className="auth-header">
          <h1 className="auth-title">
            {isLogin ? "Welcome Back" : "Begin Your Story"}
          </h1>
          <p className="auth-subtitle">
            {isLogin 
              ? "Continue writing the book you never wrote"
              : "Create your personal memoir to share with the world"
            }
          </p>
        </div>

        <div className="auth-form-container">
          <div className="auth-toggle">
            <button 
              className={`auth-toggle-btn ${isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button 
              className={`auth-toggle-btn ${!isLogin ? "active" : ""}`}
              onClick={() => setIsLogin(false)}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {errors.general && (
              <div className="error-message general-error">{errors.general}</div>
            )}

            {!isLogin && (
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`form-input ${errors.username ? "error" : ""}`}
                  placeholder="Choose a unique username"
                />
                {errors.username && <div className="error-message">{errors.username}</div>}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`form-input ${errors.fullName ? "error" : ""}`}
                placeholder="Enter your full name"
              />
              {errors.fullName && <div className="error-message">{errors.fullName}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-input ${errors.email ? "error" : ""}`}
                placeholder="Enter your email"
              />
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            {!isLogin && (
              <>
                <div className="form-group">
                  <label htmlFor="birthYear" className="form-label">Birth Year</label>
                  <input
                    type="number"
                    id="birthYear"
                    name="birthYear"
                    value={formData.birthYear}
                    onChange={handleInputChange}
                    className={`form-input ${errors.birthYear ? "error" : ""}`}
                    placeholder="e.g. 1990"
                    min="1900"
                    max={new Date().getFullYear()}
                  />
                  {errors.birthYear && <div className="error-message">{errors.birthYear}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="bio" className="form-label">Short Biography</label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    className={`form-input form-textarea ${errors.bio ? "error" : ""}`}
                    placeholder="Tell us a little about yourself... Your passions, dreams, or what makes your story unique."
                    rows="4"
                  />
                  {errors.bio && <div className="error-message">{errors.bio}</div>}
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`form-input ${errors.password ? "error" : ""}`}
                placeholder={isLogin ? "Enter your password" : "Create a password (min 6 characters)"}
              />
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <button type="submit" className="auth-submit-btn vintage-button" disabled={isLoading}>
              {isLoading ? "Please wait..." : (isLogin ? "Enter Your Story" : "Create Your Book")}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Every story deserves to be told. Every life has chapters worth sharing.
          </p>
        </div>
      </main>
    </div>
  )
}
