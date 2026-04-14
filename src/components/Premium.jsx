import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
const Premium = () => {

const [isUserPremium, setIsUserPremium] = useState(false);

  useEffect(() => {
    verifyPremiumUser();
  }, []);
  const verifyPremiumUser = async () =>{

    try {
      const res = await axios.get(`${BASE_URL}/payment/verify`, {}, {withCredentials: true});
      if(res.data.isPremium){
        setIsUserPremium(true);
      }
    } catch (error) {
      console.error(error);
    }
  }


  const handleBuyClick = async (type) => {
    
    const order = await axios.post(`${BASE_URL}/payment/create`, {
      membershipType: type
    },{withCredentials: true});


    const {amount,keyId,currency,notes,orderId} = order.data;
        const options = {
        key: keyId, 
        amount: amount,
        currency: currency,
        name: 'Dev Tinder',
        description: 'Connect to other developers',
        order_id: orderId, 
        prefill: {
          name: notes.firstName + " " + notes.lastName,
          email: notes.emailId,
        
        },
        theme: {
          color: '#F37254'
        },
        handler: verifyPremiumUser,
      };

    const rzp = new window.Razorpay(options);
    rzp.open();


  };




  return isUserPremium? (
    "You are already a premium user"
  ):(
    <div className = "m-20">
      
<div className="flex w-full justify-center items-center">
  <div className="card bg-base-300 rounded-box grid h-80 flex-grow place-items-center"><h1 className='text-2xl font-bold'>Silver Membership</h1>
  
  <ul>
    <li> Chat with other users</li>
    <li>100 connection requests per day</li>
    <li> Blue Tick</li>
    <li>3 months</li>
  </ul>
  <button className="btn btn-primary" onClick={() => handleBuyClick("silver")}> Buy Silver</button>
  </div>
  <div className="divider divider-horizontal"></div>
   <div className="card bg-base-300 rounded-box grid h-80 flex-grow place-items-center"><h1 className='text-2xl font-bold'>Gold Membership</h1>
  
  <ul>
    <li> Chat with other users</li>
    <li> 100 connection requests per day</li>
    <li> Blue Tick</li>
    <li> 6 months</li>
  </ul>
  <button className="btn btn-secondary" onClick={() => handleBuyClick("gold")}>Buy Gold</button>
  </div>
</div>


    </div>
  ) 
}

export default Premium
