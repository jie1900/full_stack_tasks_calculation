import {Routes, Route} from 'react-router-dom'
import React, { useState } from 'react'
import "./App.css"
import Navbar from './Navbar'
import Items from './Items'
import Task_Activity from './Pay'
import Option from './History'
import Info from './Info'

function App() {
  return(
  <>
  <Navbar />
    <div className='container'>
      <Routes>
        <Route index element={<Items />} />
        <Route path='/items' element={<Items />} />
        <Route path='/task_active' element={<Task_Activity />} />
        <Route path='/Info' element={<Info />} />
      </Routes>
    </div>
  </>
  )
}

export default App;