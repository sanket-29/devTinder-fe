import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';
import Footer from './Footer';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../utils/userSlice';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Body = () => {
const dispatch = useDispatch();
const navigate = useNavigate();

const userData = useSelector((store) => store.user);

  const fetchUser = async () => {
  if(userData) return; // if user data already exists in the store, no need to fetch again
    try {
          const res = await axios.get(BASE_URL + "/profile/view", {
      withCredentials: true,
    });

    dispatch(addUser(res.data));

    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Unauthorized, redirect to login
        return navigate("/login");
      }
      console.error('Error fetching user data:', err);
    }

  }


  useEffect(() => {
    
      fetchUser();
    
  }, []);
  return (
    <div>
      <NavBar />
      <Outlet /> {/* any children of the route will be rendered here */}
      <Footer />
    </div>
  )
}

export default Body
