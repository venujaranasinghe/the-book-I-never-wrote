// Simple test to verify API connection
const API_BASE_URL = 'http://localhost:5031/api';

async function testConnection() {
  try {
    // Test registration
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      fullName: 'Test User',
      birthYear: 1990,
      bio: 'Test biography'
    };

    console.log('Testing registration...');
    const registerResponse = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser)
    });

    if (registerResponse.ok) {
      const data = await registerResponse.json();
      console.log('✅ Registration successful:', data.user.username);
      
      // Test login
      console.log('Testing login...');
      const loginResponse = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          usernameOrEmail: testUser.email,
          password: testUser.password
        })
      });

      if (loginResponse.ok) {
        const loginData = await loginResponse.json();
        console.log('✅ Login successful');
        
        // Test protected endpoint
        const profileResponse = await fetch(`${API_BASE_URL}/user/profile`, {
          headers: { 'Authorization': `Bearer ${loginData.token}` }
        });

        if (profileResponse.ok) {
          console.log('✅ Protected endpoint accessible');
          console.log('🎉 All tests passed! Frontend-Backend connection is working.');
        } else {
          console.log('❌ Protected endpoint failed');
        }
      } else {
        console.log('❌ Login failed');
      }
    } else {
      const error = await registerResponse.text();
      console.log('❌ Registration failed:', error);
    }
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('Make sure the backend is running on http://localhost:5031');
  }
}

testConnection();