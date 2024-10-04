import React, { useContext } from "react";
import SideNav from './SideNav';
import styles from './Layout.module.css';
import { AuthContext } from "./AuthProvider";

const Layout = ({children}) => {
    const {user, logout} = useContext(AuthContext);
    return (
        <div className={styles.layoutContainer}>
            <SideNav user= {user} onLogout={logout}/>
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    )
}

export default Layout;