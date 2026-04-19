import React, { useEffect } from 'react'
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from 'react-redux';
import { addConnections } from '../utils/connectionSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


const Connections = () => {

    const connections = useSelector((store) => store.connections);

    const dispatch = useDispatch();
    const fetchConnections = async () => {

        try {

            const res = await axios.get(`${BASE_URL}/user/connections`, { withCredentials: true });

            dispatch(addConnections(res.data.data));

        } catch (err) {
            console.error("Error fetching connections:", err);
        }

    }

    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return;

    if(connections.length === 0) return <h1 className='text-center text-xl font-bold my-10'>No Connections Found</h1>

  return (
    <div className='text-center my-10'>
      <h1 className='text-3xl text-white font-bold'>Connections</h1>

      {connections.map((connection) => (
        <div className='flex justify-center m-4 p-4 rounded-lg bg-base-300 max-w-lg mx-auto' key={connection._id}>
            <div>
            <img
            src={connection.photoUrl}
            alt={`${connection.firstName}'s photo`}
            className="w-16 h-16 rounded-full mx-auto my-4"
          />
            </div>
            <div className='text-left mx-4'>
            <h2 className="text-xl font-bold">{connection.firstName} {connection.lastName}</h2>
           {connection.age && connection.gender && <p>{connection.age}, {connection.gender}</p>}
           <p className="text-gray-600">{connection.about}</p>

          
            </div>

            <Link to={`/chat/${connection._id}`} className="btn btn-primary">
            <button className="btn btn-primary mx-4">Chat</button>
            
            </Link>
             



        </div>
      ))}
    </div>
  )
}

export default Connections
