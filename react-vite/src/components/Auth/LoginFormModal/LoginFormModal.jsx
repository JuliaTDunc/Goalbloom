import { useState } from "react";
import { thunkLogin } from "../../../redux/session";
import { useDispatch} from "react-redux";
import { useModal } from "../../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal} = useModal();

  const handleDemo = async (e) => {
    e.preventDefault();
    try {
      await dispatch(thunkLogin({ email: "demo@aa.io", password: "password" }));
      closeModal();
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors)
      } else {
        setErrors({ email: 'Unsuccessful Demo Login' })
      }
    }
  }
 
  const handleSubmit = async (e) => {
    e.preventDefault();

    const serverResponse = await dispatch(
      thunkLogin({
        email,
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
      <h1 className='login-header'>Log In</h1>
      <form className='login-form' onSubmit={handleSubmit}>
        <label className='login-form-label'>
          Email
          <input
            className='login-form-input'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        {errors.email && <p className='errors'>{errors.email}</p>}
        <label className='login-form-label'>
          Password
          <input
            className='login-form-input'
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {errors.password && <p className='errors'>{errors.password}</p>}
        <button className='option-buttons-login' type="submit">Log In</button>
        <button className='option-buttons-login' onClick={handleDemo}>Demo Login</button>
        <button className='option-buttons-sign-up-login'><a className='login-modal-a' href="/signup">Sign Up</a></button>
      </form>
    </>
  );
}

export default LoginFormModal;
