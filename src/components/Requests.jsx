import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useSelector } from "react-redux";

const Requests = () => {

  const requests = useSelector((store) => store.requests);

  const dispatch = useDispatch();



  const reviewRequest = async(status, _id) => {

      try {
        
        const res = await axios.post(BASE_URL + '/request/review/'+status + '/' + _id, {}, {
          withCredentials: true
        });

        dispatch(removeRequest(_id));

      } catch (err) {

        console.error("Error reviewing request:", err);
      }



  };

  const fetchRequests = async () => {

    try {
      const res = await axios.get(BASE_URL + '/user/requests/received', {
        withCredentials: true
      });

      dispatch(addRequests(res.data.data));

    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return;

  if (requests.length === 0) return <h1 className='text-center text-xl font-bold my-10'>No Requests Found</h1>

  return (
    <div className='text-center my-10'>
      <h1 className='text-3xl text-white font-bold'>Connection Requests</h1>

      {requests.map((request) => (
        <div className='flex justify-center justify-between items-center m-4 p-4 rounded-lg bg-base-300 max-w-2xl mx-auto' key={request.fromUserId._id}>
          <div>
            <img
              src={request.fromUserId.photoUrl}
              alt={`${request.fromUserId.firstName}'s photo`}
              className="w-16 h-16 rounded-full mx-auto my-4"
            />
          </div>
          <div className='text-left mx-4'>
            <h2 className="text-xl font-bold">{request.fromUserId.firstName} {request.fromUserId.lastName}</h2>
            {request.fromUserId.age && request.fromUserId.gender && <p>{request.fromUserId.age}, {request.fromUserId.gender}</p>}
            <p className="text-gray-600">{request.fromUserId.about}</p>
          </div>
          <div>
            <button className="btn btn-primary mx-2" onClick={() => reviewRequest('rejected', request._id)}>Reject</button>
            <button className="btn btn-secondary mx-2" onClick={() => reviewRequest('accepted', request._id)}>Accept</button>
          </div>


        </div>
      ))}
    </div>
  )
}

export default Requests
