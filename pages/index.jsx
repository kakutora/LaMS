import { useEffect, useState } from "react";
import Image from "next/image";
import Layout from "/layouts/MainLayout";
import Link from "next/link";
import Masonry from "react-masonry-css";
import MyImage from "@/components/utils/MyImage";
import {
  connectDatabase,
  closeDatabase,
  saveDataToDB,
  convertResultsToJSON,
} from "/lib/db";
import { createTableQuery } from "../lib/createTable";
import styles from "./index.module.css";

export async function getServerSideProps() {
  let connection;

  const query = "SELECT id, title, image_path, time FROM images";

  try {
    connection = await connectDatabase();

    await saveDataToDB(connection, createTableQuery);

    const results = await saveDataToDB(connection, query);
    const jsonResults = convertResultsToJSON(results);

    return {
      props: {
        data: jsonResults,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        data: [],
      },
    };
  } finally {
    if (connection) {
      closeDatabase(connection);
    }
  }
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

export default function Home({ data }) {
  return (
    <Layout>
      <Link href="/form">form</Link>
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.mymasonrygrid}
        columnClassName={styles.mymasonrygrid_column}
      >
        {data.map((item, index) => (
          <Link
            key={index}
            href={"/content/" + item.title}
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
    </Layout>
  );
}
