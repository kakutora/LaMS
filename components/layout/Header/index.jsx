import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import classNames from "classnames";

import styles from "./index.module.css";

export default function Header({ user }) {
  const [isActive, setIsActive] = useState(false);
  const [isActiveNav, setIsActiveNav] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const handleClickNav = () => {
    setIsActiveNav(!isActiveNav);
  };

  return (
    <>
      <header className={styles.header}>
        <h1 className={styles.header_title}>
          <Link href="/" className={styles.header_titleLink}>
            L@MS
          </Link>
        </h1>
        <nav
          className={classNames(styles.header_nav, {
            [styles.active]: isActive,
          })}
        >
          <ul className={styles.header_list}>
            <li className={styles.header_item}>
              <Link href="/form" className={styles.header_itemLink}>
                UPLOAD
              </Link>
            </li>
            <li className={styles.header_item}>
              <p className={styles.header_item}>CATEGORIES</p>
            </li>
            <li className={styles.header_item}>HELP</li>
          </ul>

          <ul className={styles.header_accountList}>
            <li className={styles.header_accountItem}>
              <p className={styles.header_accountItemImgBox}>
                <Image
                  src="/icon/notifications.png"
                  alt="My Image"
                  priority
                  fill
                  className={styles.header_accountItemImg}
                />
              </p>
            </li>
            <li className={styles.header_accountItem}>
              <Link
                href={user ? `/user/${user.userid}` : "/auth/login"}
                className={styles.header_accountItemBox}
              >
                <p className={styles.header_accountItemText}>
                  {user ? user.username : "LOGIN"}
                </p>
                <p className={styles.header_accountItemImgBox}>
                  <Image
                    src="/icon/user.png"
                    alt="My Image"
                    priority
                    fill
                    className={styles.header_accountItemImg}
                  />
                </p>
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.header_searchBtn} onClick={handleClickNav}>
          <Image
            src="/icon/search.png"
            alt="My Image"
            priority
            fill
            className={styles.header_searchBtnImg}
          />
        </div>

        <div
          className={classNames(styles.header_searchBox, {
            [styles.active]: isActiveNav,
          })}
        >
          <input
            type="text"
            placeholder="SEARCH"
            className={styles.header_search}
          />
        </div>

        <button
          className={classNames(styles.header_navBtn, {
            [styles.active]: isActive,
          })}
          onClick={handleClick}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </header>
    </>
  );
}
