import { useState } from "react"
import "./App.css"

export default function AuthPage({ onLogin, mousePosition }) {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthYear: "",
    bio: "",
    password: ""
  })
  const [errors, setErrors] = useState({})

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
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
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

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    if (isLogin) {
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("memorialUsers") || "{}")
      const user = users[formData.email]
      
      if (!user || user.password !== formData.password) {
        setErrors({ general: "Invalid email or password" })
        return
      }
      
      onLogin(user)
    } else {
      // Registration
      const users = JSON.parse(localStorage.getItem("memorialUsers") || "{}")
      
      if (users[formData.email]) {
        setErrors({ email: "An account with this email already exists" })
        return
      }
      
      const newUser = {
        name: formData.name,
        email: formData.email,
        birthYear: formData.birthYear,
        bio: formData.bio,
        password: formData.password,
        createdAt: new Date().toISOString(),
        bookId: Date.now().toString() // Simple unique ID
      }
      
      users[formData.email] = newUser
      localStorage.setItem("memorialUsers", JSON.stringify(users))
      
      onLogin(newUser)
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

            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`form-input ${errors.name ? "error" : ""}`}
                placeholder="Enter your full name"
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
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

            <button type="submit" className="auth-submit-btn vintage-button">
              {isLogin ? "Enter Your Story" : "Create Your Book"}
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
