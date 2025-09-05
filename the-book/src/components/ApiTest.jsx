import { useState, useEffect } from 'react';
import apiService from '../services/api';

function ApiTest() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const testApiConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await apiService.getWeatherForecast();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const testUserCreation = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const userData = {
        name: "Test User",
        birthYear: 1990,
        bio: "This is a test user created via API"
      };
      
      const response = await apiService.createUser(userData);
      console.log('User created:', response);
      alert('User created successfully! Check console for details.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', margin: '20px' }}>
      <h3>API Connection Test</h3>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={testApiConnection} 
          disabled={loading}
          style={{ 
            padding: '10px 15px', 
            marginRight: '10px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Test Weather API'}
        </button>
        
        <button 
          onClick={testUserCreation} 
          disabled={loading}
          style={{ 
            padding: '10px 15px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Loading...' : 'Test User Creation'}
        </button>
      </div>

      {error && (
        <div style={{ 
          color: 'red', 
          backgroundColor: '#fee', 
          padding: '10px', 
          borderRadius: '4px',
          marginBottom: '15px'
        }}>
          Error: {error}
        </div>
      )}

      {weatherData && (
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}>
          <h4>Weather Forecast Data:</h4>
          <pre>{JSON.stringify(weatherData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default ApiTest;
