import React, {useState} from 'react'
import '../../assets/styles/authentication/signup.css'
import Header from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import '../../assets/styles/authentication/forget.css'

function Forget(){
const [email, setEmail] = useState('');

return (
    <>
    <Header />
     <div className='forget-div'>
       
        <form >
             <h2>Forget Password</h2>
        <p>Enter your email adddress to reset your password.</p>
            <div className='forget-input'>
 <label htmlFor="Email">Email</label>
            <input type="text" placeholder='Enter your email' className='forget-input' />
            </div>
          
           <a href="" className='reset-link'>Send Reset Link</a>
           <a href="/login" className='back-login'>Back to Login</a>
        </form>
    </div>
    <Footer />
    </>
   
);
}


export default Forget