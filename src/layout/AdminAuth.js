import React, { useEffect } from 'react'
import Header from '../admin/includes/header/Header';
import Sidebar from '../admin/includes/sidebar/Sidebar';
import '../admin/AdminStyle.css';
import { authUser } from '../utility/Utility';
import { useNavigate } from 'react-router';

const AdminAuth = ({ cmp }) => {
  const navigate = useNavigate()
  const Component = cmp;
  useEffect(() => {
    if(!authUser()?.token){
      navigate('/')
    }
  },[])
  return (
    <>
      <div className="layout-wrapper layout-content-navbar">
        <div className="layout-container">
          <Sidebar />
          <div className="layout-page">
            <Header />
            <Component/>
          </div>
        </div>
        <div className="layout-overlay layout-menu-toggle" />
        <div className="drag-target" />
      </div>
    </>
  )
}

export default AdminAuth