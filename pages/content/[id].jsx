import { connectDatabase, closeDatabase, saveDataToDB } from "/lib/db";
import Image from "next/image";
import styles from "./index.module.css";

export async function getServerSideProps({ params }) {
  // params.id を使用してデータを取得する処理を実行
  let connection;

  const query = "SELECT * FROM images WHERE title = ?";
  const values = [params.id];

  try {
    connection = await connectDatabase();
    const results = await saveDataToDB(connection, query, values);
    const parse = JSON.parse(JSON.stringify(results));
    const extract = parse[0];
    return {
      props: {
        data: extract,
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

export default function Post({ data }) {
  return (
    <>
      <p>{data.title}</p>
      <Image
        src={"/images/" + data.image_path}
        alt="My Image"
        priority
        fill
        className={styles.image}
      />
    </>
  );
}
