import React, { useContext, useState } from 'react'
import { Link ,Navigate} from 'react-router-dom'
import { Context, server } from '../main';
import toast from 'react-hot-toast';
import axios from 'axios';

function Login() {
    const [formdata,setFormData]=useState(
        {email:"",
        password:""});

        const {isAuthenticated,setIsAuthenticated,loading,setLoading}=useContext(Context)
        const submitHandler=async(e)=>{
            e.preventDefault();
            setLoading(true)
          try {
            const {data}=  await axios.post(`${server}/users/login`,formdata,{
                headers:{
                    "Content-Type":"application/json"
                },
                withCredentials: true
            })
            toast.success(data.message)
            setIsAuthenticated(true)
            setLoading(false)
          } catch (error) {
            toast.error(error.response.data.message)
            console.log(error)
            setIsAuthenticated(false)
            setLoading(false)
          }
        
        }
const onChangeHandler=(e)=>{
    e.preventDefault();
    setFormData({...formdata,[e.target.name]:e.target.value})

}
if(isAuthenticated) return <Navigate to={"/"}/>
  return (
    <div className='login'>
      <section>
        <form onSubmit={submitHandler}>
            <input name="email" value={formdata.email} onChange={onChangeHandler} type='email' placeholder='Email' required />
            <input name='password' value={formdata.password} onChange={onChangeHandler} type='password' placeholder='Password' required />
            <button disabled={loading} type="submit">Login</button>
            <h4>Or</h4>
            <Link to="/register">Sign Up</Link>
        </form>
      </section>
    </div>
  )
}

export default Login
