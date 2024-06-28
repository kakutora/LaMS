import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import classNames from "classnames";

import styles from "./index.module.css";
import IconImage from "@/components/utils/IconImage";

export default function Header({ user }) {
  const [isActive, setIsActive] = useState(false);
  const [isActiveNav, setIsActiveNav] = useState(false);
  const [isActiveNavSubList, setIsActiveNavSubList] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const handleClickNav = () => {
    setIsActiveNav(!isActiveNav);
  };

  const handleClickNavSubList = () => {
    setIsActiveNavSubList(!isActiveNavSubList);
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
          <ul className={styles.header_navList}>
            <li className={styles.header_navItem}>
              <p
                className={classNames(styles.header_navItemText, {
                  [styles.active]: isActiveNavSubList,
                })}
                onClick={handleClickNavSubList}
              >
                <span className={styles.header_navItemLink}>CATEGORIES</span>
              </p>
              <ul
                className={styles.header_navSubList}
                className={classNames(styles.header_navSubList, {
                  [styles.active]: isActiveNavSubList,
                })}
              >
                <li className={styles.header_navSubItem}>
                  <Link href="/" className={styles.header_navItemLink}>
                    POPULAR
                  </Link>
                </li>
                <li className={styles.header_navSubItem}>
                  <Link href="/" className={styles.header_navItemLink}>
                    FEATURE
                  </Link>
                </li>
                <li className={styles.header_navSubItem}>
                  <Link href="/" className={styles.header_navItemLink}>
                    LATEST
                  </Link>
                </li>
              </ul>
            </li>
            <li className={styles.header_navItem}>
              <Link href="/form" className={styles.header_navItemLink}>
                UPLOAD
              </Link>
            </li>
            <li className={styles.header_navItem}>
              <Link href="/" className={styles.header_navItemLink}>
                HELP
              </Link>
            </li>
          </ul>

          <ul className={styles.header_accountList}>
            <li className={styles.header_accountItem}>
              <p className={styles.header_accountImg}>
                <IconImage
                  imageSrc="/icon/notifications.png"
                  imageAlt="My Image"
                />
              </p>
            </li>
            <li className={styles.header_accountItem}>
              <Link
                href={user ? `/user/${user.userid}` : "/auth/login"}
                className={styles.header_accountBox}
              >
                <p className={styles.header_accountUsername}>
                  {user ? user.username : "LOGIN"}
                </p>
                <p className={styles.header_accountImg}>
                  <IconImage imageSrc="/icon/user.png" imageAlt="My Image" />
                </p>
              </Link>
            </li>
          </ul>
        </nav>

        <div className={styles.header_searchBtn} onClick={handleClickNav}>
          <IconImage imageSrc="/icon/search.png" imageAlt="My Image" />
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
