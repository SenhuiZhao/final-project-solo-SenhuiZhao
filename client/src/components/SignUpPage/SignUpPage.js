import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./SignUpPage.css"
import axios from 'axios';


export default function SignUpPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   if (password !== confirmPassword) {
  //     setError('Passwords do not match');
  //     return;
  //   }

  //   try {
  //     const response = await axios.post('http://localhost:8000/register', { username, email, password });
  //     if (response.status === 201) {
  //       navigate('/welcome/LoginPage');
  //     } else {
  //       setError(response.data.error || 'Unable to create account');
  //     }
  //   } catch (error) {
  //     setError(error.message);
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError(null); // Reset error message

    if (username == null){
      setError('Username can not be empty');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/register', { username, email, password });
      if (response.status === 201) {
        navigate('/welcome/LoginPage');
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      setError(error.response && error.response.data.error ? error.response.data.error : 'Unable to create account');
    }
  };


  return (
    <>
      <div className='nameOfWebsite'>Fake Stack Overflow</div>

      <form onSubmit={handleSubmit} className='signUpInfo'>
        {error && <p>{error}</p>}
        <label className='inputLabel'>
          Username:<br />
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>
        <label className='inputLabel'>
          Email:<br />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className='inputLabel'>
          Password:<br />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <label className='inputLabel'>
          Confirm Password:<br />
          <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </label>
        <button type="submit" className='signUpButton'>Sign Up</button>
      </form>
    </>
  );
}
