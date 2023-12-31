import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../utils';
import { UserOutlined, AppstoreOutlined, DropboxOutlined, ShoppingCartOutlined, AccountBookOutlined } from '@ant-design/icons'
import NavbarLoginComponent from '../../components/NavbarLoginComponent/NavbarLoginComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminProductCategory from '../../components/AdminProductCategory/AdminProductCategory';
import AdminOrder from '../../components/AdminOrder/AdminOrder';
import AdminCourse from '../../components/AdminCourse/AdminCourse';
import AdminCourseDetail from '../../components/AdminCourseDetail/AdminCourseDetail';

export const AdminPage = () => {
  const items  = [
    getItem('Người dùng', 'user', <UserOutlined />),

    getItem('Sản phẩm', 'product', <DropboxOutlined />),

    getItem('Danh mục', 'category', <AppstoreOutlined />),

    getItem('Đơn hàng', 'order', <ShoppingCartOutlined />),

    getItem('Danh sách Khóa học', 'course', <AccountBookOutlined />),

    getItem('Chi tiết đăng ký khóa học', 'course-detail', <AccountBookOutlined />),
  ];

  const [keySelected, setKeySelected] = useState('');

  const renderPage = (key) => {
    switch (key) {
      case 'user':
        return (
          <AdminUser></AdminUser>
        )
      
      case 'product':
        return (
          <AdminProduct></AdminProduct>
        )

      case 'category':
        return (
          <AdminProductCategory></AdminProductCategory>
        )

      case 'order':
        return (
          <AdminOrder></AdminOrder>
        )

      case 'course':
        return (
          <AdminCourse></AdminCourse>
        )

      case 'course-detail':
        return (
          <AdminCourseDetail></AdminCourseDetail>
        )

      default:
        return <></>
    }
  }


  const handleOnClick = ({ key }) => {
    setKeySelected(key)
  }

  return (
    <>
      <NavbarLoginComponent isHiddenAddress isHiddenCart></NavbarLoginComponent>
      <div style={{display: 'flex', }}>
        <Menu
          mode="inline"
          style={{ width: '256px', boxShadow: '1px 1px 2px #ccc' }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{padding: '15px', flex: '1'}}>
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  )
}
