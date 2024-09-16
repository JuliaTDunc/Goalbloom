import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkSignup } from "../../redux/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrors({
        confirmPassword:
          "Confirm Password field must be the same as the Password field",
      });
    }

    const serverResponse = await dispatch(
      thunkSignup({
        email,
        username,
        password,
      })
    );

    if (serverResponse) {
      setErrors(serverResponse);
    } else {
      closeModal();
    }
  };

  return (
    <>
      <h1 className='signup-header'>Sign Up</h1>
      {errors.server && <p className='errors'>{errors.server}</p>}
      <form className='signup-form' onSubmit={handleSubmit}>
        <label className='signup-form-label'>
          Email
          <input
            className='signup-form-input'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className="errors">{errors.email}</p>}
        <label className="signup-form-label">
          Username
          <input
            className="signup-form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        {errors.username && <p className="errors">{errors.username}</p>}
        <label className="signup-form-label">
          Password
          <input
            className="signup-form-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className="errors">{errors.password}</p>}
        <label className="signup-form-label">
          Confirm Password
          <input
            className="signup-form-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>
        {errors.confirmPassword && <p className="errors">{errors.confirmPassword}</p>}
        <button className='menu-button' type="submit">Sign Up</button>

        <div className='login-section'>
          <p>Have an account?</p>
          <button className='menu-button'><a href='/login'>Log In</a></button>
        </div>
      </form>
    </>
  );
}

export default SignupFormModal;
