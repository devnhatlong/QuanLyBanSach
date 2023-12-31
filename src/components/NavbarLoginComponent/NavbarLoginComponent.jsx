import React, { useState, useEffect } from 'react';
import { WrapperContentPopup, WrapperHeaderContainerLogin, WrapperHeaderLogin, WrapperPopover } from './style'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import { Badge } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import * as UserService from '../../services/UserService'
import { useDispatch } from 'react-redux'
import { resetUser } from '../../redux/slice/userSlice'
import { resetOrder } from '../../redux/slice/orderSlice'
import Loading from '../LoadingComponent/Loading';
import Logo from '../../assets/images/logo-no-background.png'

const NavbarLoginComponent = ({ isHiddenAddress = false, isHiddenCart = false }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isOpenPopup, setIsOpenPopup] = useState(false);
    const user = useSelector((state) => state.user);
    const order = useSelector((state) => state.order);
    const [userName, setUserName] = useState('');
    const [userAvatar, setUserAvatar] = useState('');

    const navInfoArray = [
        { text: "Hotline: 0918.191.613", link: "#" },
        { text: "Địa chỉ: Số 2, đường 30, phường Tân Quy, quận 7, Tp.HCM", link: "#" },
    ];

    const navButtonArray = [
        { text: "Đăng ký", link: "/sign-up" },
        { text: "Đăng nhập", link: "/sign-in" },
    ];

    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        setLoading(true);
        setUserAvatar(user?.avatar);
        setUserName(user?.name);
        setLoading(false);
    }, [user?.name, user?.avatar])

    const handleLogout = async () => {
        setLoading(true);
        await UserService.logoutUser();
        localStorage.removeItem('access_token');
        dispatch(resetOrder());
        dispatch(resetUser());
        setLoading(false);
        navigate("/");
    }

    const content = (
        <div>
            {user?.is_admin && (
                <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>Quản lý hệ thống</WrapperContentPopup>
            )}
            <WrapperContentPopup onClick={() => handleClickNavigate("profile")}>Thông tin người dùng</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate("my-order")}>Đơn hàng của tôi</WrapperContentPopup>
            <WrapperContentPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperContentPopup>
        </div>
    );

    const handleClickNavigate = (type) => {
        if (type === 'profile') {
            navigate("/profile-user");
        }
        else if (type === 'admin') {
            navigate("/system/admin")
        }
        else if (type === 'my-order') {
            navigate("/my-order", {state: {
                id: user?.id,
                token: user?.access_token
            }})
        }
        else {
            handleLogout();
        }

        setIsOpenPopup(false);
    }

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const threshold = window.innerHeight * 0.2;

            setIsFixed(scrollPosition > threshold);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div style={{ position: isFixed ? 'fixed' : 'static', top: 0, left: 0, right: 0, zIndex: 999 }}>
            <WrapperHeaderContainerLogin>
                {!isHiddenAddress ? (
                    <WrapperHeaderLogin>
                        {navInfoArray.map((navItem, index) => (
                            <li key={index}>
                                <a
                                    href="#"
                                    onClick={() => {
                                        navigate(navItem.link);
                                    }}
                                >
                                    {navItem.text}
                                </a>
                            </li>
                        ))}
                    </WrapperHeaderLogin>
                ) : (
                    <img src={Logo} style={{cursor: 'pointer', height: '45px'}} alt="logo" onClick={() => {navigate("/")}}/>
                )}

                {!isHiddenCart && (
                    <div onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
                        <WrapperHeaderLogin style={{cursor: 'pointer', color: '#fff'}}>
                            <Badge count={order?.orderItems?.length} size='small' style={{top: '5px', right: '5px'}}>
                                <ShoppingCartOutlined style={{color: '#fff', fontSize: '30px'}}/>
                            </Badge>
                            <span style={{marginLeft: '4px'}}>Giỏ Hàng</span>
                        </WrapperHeaderLogin>
                    </div>
                )}
                <Loading isLoading={loading}>
                    { user?.access_token ? (
                        <>
                            <WrapperHeaderLogin>
                                {userAvatar ? (
                                    <img src={userAvatar} alt="avatar" style={{height: '40px', width: '40px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px'}}/>
                                ) : (
                                    <UserOutlined style={{fontSize: '30px', color: 'white', margin: '0 10px'}}/>
                                )}
                                <WrapperPopover content={content} trigger="click" open={isOpenPopup}>
                                    <div style={{color: 'white', cursor: 'pointer'}} onClick={() => setIsOpenPopup((prev) => !prev)}>{userName?.length ? userName : user?.email}</div>
                                </WrapperPopover>
                            </WrapperHeaderLogin>
                            
                        </>
                    ) : (
                        <WrapperHeaderLogin>
                            {navButtonArray.map((navItem, index) => (
                                <li key={index}>
                                    <a
                                        href="#"
                                        onClick={() => {
                                            navigate(navItem.link);
                                        }}
                                    >
                                        {navItem.text}
                                    </a>
                                </li>
                            ))}
                        </WrapperHeaderLogin>
                    )}
                </Loading>
                
            </WrapperHeaderContainerLogin>
        </div>
    )
}

export default NavbarLoginComponent