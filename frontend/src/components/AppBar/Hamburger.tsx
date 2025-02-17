import React from 'react';
import style from './Hamburger.module.css'
interface Props {
    onClick: () => void;
    mobileMenuShow: boolean;
}
export const HamburgerMenu = (props: Props) => {


    // wrapperMenu.on('click', function () {
    //     wrapperMenu.classList.toggle('open');
    // })
    const handleMenu = (e: any) => {
        e.target.classList.toggle('open')
        props.onClick();
    }
    return (
        <div className={`wrapper-menu ${props.mobileMenuShow ? 'open' : ''}`} onClick={(e) => { e.stopPropagation(); e.preventDefault(); handleMenu(e) }} >
            <div className="line-menu start"></div>
            <div className="line-menu"></div>
            <div className="line-menu half end"></div>
        </div>
    )
}