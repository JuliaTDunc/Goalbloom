import { useDispatch } from 'react-redux';
import { loginWithGoogle } from '../../store/session';

const dispatch = useDispatch();

const handleGoogleResponse = async (response) => {
    const googleToken = response.credential;
    const data = await dispatch(loginWithGoogle(googleToken));

    if (data?.errors) {
        console.error(data.errors);
    } else {
        console.log("Logged in as:", data.username);
    }
};
