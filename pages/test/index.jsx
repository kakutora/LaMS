import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import Link from "next/link";

import Layout from "@/layouts/MainLayout";
import MyImage from "@/components/utils/MyImage";
import { userAuth } from "@/lib/auth";
import { Database } from "/lib/pool";
import styles from "./index.module.css";

export async function getServerSideProps({ req }) {
  const user = await userAuth(req.headers.cookie);

  const db = new Database();
  const query = "SELECT id, title, image_path, time, uuid FROM images LIMIT 5";

  try {
    await db.connect();
    const results = await db.execQuery(query);
    const formattedData = results.map((item) => ({
      ...item,
      time: new Date(item.time).toISOString(),
      imageUrl: `/api/image/file/${item.image_path}`,
    }));
    console.log(formattedData);

    return {
      props: {
        user,
        initialData: formattedData,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        user,
        initialData: [],
      },
    };
  } finally {
    db.close();
  }
}

export default function Home({ user, initialData }) {
  const [data, setData] = useState(initialData);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop !==
          document.documentElement.offsetHeight ||
        loading
      ) {
        return;
      }

      setLoading(true);

      const res = await fetch(`/api/image/replace?page=${page}`);
      const newImages = await res.json();

      setData((prev) => [...prev, ...newImages]);
      setPage((prev) => prev + 1);
      setLoading(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, loading]);

  return (
    <Layout user={user}>
      <Link href="/form">form</Link>

      <Masonry
        breakpointCols={breakpointColumnsObj}
        className={styles.mymasonrygrid}
        columnClassName={styles.mymasonrygrid_column}
      >
        {data.map((item, index) => (
          <Link
            key={index}
            href={"/content/" + item.uuid}
            className={styles.link}
          >
            <MyImage
              imageSrc={item.imageUrl}
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
      {loading && <p>Loading...</p>}
    </Layout>
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
