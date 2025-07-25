import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    password2: '',
    role: 'user' // Default role
  });

  const { username, password, password2, role } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== password2) {
      console.error('Passwords do not match');
    } else {
      try {
        const res = await axios.post('/api/auth/register', {
          username,
          password,
          role
        });
        console.log(res.data);
        // TODO: Handle successful registration (e.g., redirect to login)
      } catch (err) {
        console.error(err.response.data);
        // TODO: Handle registration error (e.g., display error message)
      }
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={e => onSubmit(e)}>
        <div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={e => onChange(e)}
            minLength="6"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            value={password2}
            onChange={e => onChange(e)}
            minLength="6"
            required
          />
        </div>
        <div>
          <select name="role" value={role} onChange={e => onChange(e)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <input type="submit" value="Register" />
      </form>
    </div>
  );
};

export default Register;