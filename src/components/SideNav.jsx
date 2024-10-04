import React from 'react';
import styles from './SideNav.module.css';

const SideNav = ({ user, onLogout }) => {
    

    return (
        <div className={styles.sideNavContainer}>
            <img 
                src={user.avatar || 'https://api.multiavatar.com/seed3.svg'} 
                className={styles.avatar} 
            />
                <h3>{user.username}</h3>
                <button className={styles.logoutButton} onClick={onLogout}>Logga ut</button>
        </div>
    );
};

export default SideNav;