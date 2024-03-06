import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { Context, server } from '../main';
import TodoItem from '../components/TodoItem';
import { Navigate } from 'react-router-dom';

function Home() {
  const [formdata,setFormData]=useState(
    {title:"",
    description:""});

 const [loading,setLoading]=useState(false)
const [tasks,setTasks]=useState([])
const [refresh,setRefresh]=useState(false)
const {isAuthenticated}=useContext(Context)

const updateHandler=async(id)=>{

  try {
   const {data}= await axios.put(`${server}/task/${id}`,{},{
      withCredentials:true
    })
    toast.success(data.message)
    setRefresh(prev=> !prev)
  } catch (error) {
    toast.error(error.response.data.message)
  }
toast.success(id)
}
const deleteHandler=async(id)=>{

  try {
    const{data}=await axios.delete(`${server}/task/${id}`,{
      withCredentials:true
    })
    toast.success(data.message)
    setRefresh(prev=> !prev)
  } catch (error) {
    toast.error(error.response.data.message)
  }
  
toast.success(id)
}
    const submitHandler=async(e)=>{
        e.preventDefault();
        try {
          setLoading(true)
          const {data}= await axios.post(`${server}/task/new`,formdata,{
            withCredentials:true,
            headers:{
              "Content-Type":"application/json"
            }
          })
          
          toast.success(data.message)
          setFormData({title:"",
          description:""})
          setLoading(false)
          setRefresh(prev=> !prev)
          
        } catch (error) {
            toast.error(error.response.data.message)
            setLoading(false)
        }
  }

    const onChangeHandler=(e)=>{
      e.preventDefault();
      setFormData({...formdata,[e.target.name]:e.target.value})
  
  }

  useEffect(()=>{
      axios.get(`${server}/task/my`,{
        withCredentials:true
      }).then((res)=>{
setTasks(res.data.tasks)
      }).catch((e)=>{
        toast.error(e.response.data.message)
      })
  },[refresh])


  if(!isAuthenticated) return <Navigate to={"/login"}/>
  return (
    <div className='container'>
      <div className='login'>
      <section>
        <form onSubmit={submitHandler}>
            <input name="title" value={formdata.title} onChange={onChangeHandler} type='text' placeholder='Title' required />
            <input name="description" value={formdata.description} onChange={onChangeHandler} type='text' placeholder='Description' required />
            <button disabled={loading}  type="submit">Add task</button>
        </form>
      </section>
    </div>
    <section className="todosContainer">
      {tasks.map(item=>(
        <TodoItem key={item._id} id={item._id} title={item.title} description={item.description} isCompleted={item.isCompleted} updateHandler={updateHandler} deleteHandler={deleteHandler} />    ))}
      </section>
    </div>
  )
}

export default Home
