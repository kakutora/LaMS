import Image from "next/image";
import Masonry from "react-masonry-css";
import Link from "next/link";

import Layout from "@/layouts/MainLayout";
import MyImage from "@/components/utils/MyImage";
import Logout from "@/components/utils/Logout";

import { Database } from "/lib/pool";

import styles from "./index.module.css";

export async function getServerSideProps({ params }) {
  // params.id を使用してデータを取得する処理を実行
  const db = new Database();

  const userQuery = "SELECT * FROM users WHERE userid = ?";
  const imageQuery =
    "SELECT id, title, image_path, time, uuid FROM images WHERE userUUID = ?";
  const userValues = [params.id];

  try {
    await db.connect();
    const userResults = await db.execQuery(userQuery, userValues);
    const userParse = JSON.parse(JSON.stringify(userResults));
    const userExtract = userParse[0];

    const imageValues = [userExtract.useruuid];
    const imageResults = await db.execQuery(imageQuery, imageValues);
    const formattedData = imageResults.map((item) => ({
      ...item,
      time: new Date(item.time).toISOString(),
    }));
    const imageExtract = formattedData;

    return {
      props: {
        userData: userExtract,
        imageData: imageExtract,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        userData: null,
        imageData: null,
      },
    };
  } finally {
    db.close();
  }
}

export default function Post({ userData, imageData }) {
  if (!userData) {
    return <div>Error loading user data</div>;
  }
  return (
    <>
      <p>{userData.username}</p>
      <Logout />
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.mymasonrygrid}
        columnClassName={styles.mymasonrygrid_column}
      >
        {imageData.map((item, index) => (
          <Link
            key={index}
            href={"/content/" + item.uuid}
            className={styles.link}
          >
            <MyImage
              imageSrc={"/images/" + item.image_path}
              imageAlt="My Image"
              customClass={styles.link_image}
            />
            <div className={styles.link_box}>
              <p className={styles.link_title}>{item.title}</p>
            </div>
            <p className={styles.link_date}>{formatDate(item.time)}</p>
          </Link>
        ))}
      </Masonry>
    </>
  );
}

const breakpointColumnsObj = {
  default: 5,
  1350: 4,
  1048: 3,
  576: 2,
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
