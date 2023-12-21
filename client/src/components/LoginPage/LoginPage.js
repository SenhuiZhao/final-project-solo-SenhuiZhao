import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginPage.css"
import axios from "axios";


export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); // Reset error message

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post('http://localhost:8000/login', { email, password });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      navigate('/welcome/HomePage');
    } catch (error) {
      setError(error.response && error.response.data.error ? error.response.data.error : 'Error during login');
    }
  };

  return (
    <>
      <div className='nameOfWebsite'>Fake Stack Overflow</div>
      <form onSubmit={handleSubmit} className='loginInfo'>
        {error && <p className='errorMessage'>{error}</p>}
        <label className='inputLabel'>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label className='inputLabel'>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type="submit" className='loginButton'>Login</button>
      </form>
    </>
  );
}
