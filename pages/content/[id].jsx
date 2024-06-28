import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Database } from "/lib/pool";
import { userAuth } from "@/lib/auth";

import axios from "axios";

import styles from "./index.module.css";

export async function getServerSideProps({ params, req }) {
  const user = await userAuth(req.headers.cookie);
  // params.id を使用してデータを取得する処理を実行
  const db = new Database();

  const imageQuery = "SELECT * FROM images WHERE uuid = ?";
  const userQuery = "SELECT * FROM users WHERE userUUID = ?";
  const likeCountQuery =
    "SELECT COUNT(*) AS likeCount FROM likes WHERE image_uuid = ?";

  const imageValues = [params.id];
  const likeCountValues = [params.id];

  try {
    await db.connect();
    const imageResults = await db.execQuery(imageQuery, imageValues);
    const imageParse = JSON.parse(JSON.stringify(imageResults));
    const imageExtract = imageParse[0];

    const keysToExtract = ["useruuid", "userid", "username"];
    const userValues = [imageExtract.userUUID];
    const userResults = await db.execQuery(userQuery, userValues);
    const userParse = JSON.parse(JSON.stringify(userResults));
    const userExtract = Object.fromEntries(
      Object.entries(userParse[0]).filter(([key]) =>
        keysToExtract.includes(key)
      )
    );

    const likeCountResults = await db.execQuery(
      likeCountQuery,
      likeCountValues
    );
    const likeCount = likeCountResults[0].likeCount;

    let isLiked = false;
    if (user) {
      const userLikeQuery =
        "SELECT COUNT(*) AS isLiked FROM likes WHERE image_uuid = ? AND user_uuid = ?";
      const userLikeValues = [params.id, user.useruuid];
      const userLikeResults = await db.execQuery(userLikeQuery, userLikeValues);
      isLiked = userLikeResults[0].isLiked > 0;
    }

    return {
      props: {
        user,
        imageData: imageExtract,
        userData: userExtract,
        initialLikeCount: likeCount,
        isLiked: isLiked,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        user,
        imageData: null,
        userData: null,
        initialLikeCount: 0,
        isLiked: false,
      },
    };
  } finally {
    db.close();
  }
}

export default function Post({
  user,
  imageData,
  userData,
  initialLikeCount,
  isLiked,
}) {
  const router = useRouter();
  const [liked, setLiked] = useState(isLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const handleLike = async () => {
    try {
      if (liked) {
        await axios.delete("/api/content/unlike", {
          data: { user_uuid: user.useruuid, image_uuid: imageData.uuid },
        });
        setLikeCount(likeCount - 1);
      } else {
        await axios.post("/api/content/like", {
          user_uuid: user.useruuid,
          image_uuid: imageData.uuid,
        });
        setLikeCount(likeCount + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`/api/image/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image_uuid: imageData.uuid }), // リクエストボディにIDを含める
      });
      if (response.ok) {
        router.push("/"); // 削除成功後のリダイレクト
      } else {
        console.error("Failed to delete");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <p>
        <Link href={`/user/${userData.userid}`}>{userData.userid}</Link>
      </p>
      <p>{imageData.title}</p>
      <div className={styles.test}>
        <Image
          src={`/images/${imageData.image_path}`}
          alt="My Image"
          priority
          fill
          className={styles.image}
        />
      </div>
      {user?.useruuid === userData.useruuid && (
        <form onSubmit={handleSubmit}>
          <button type="submit">Delete</button>
        </form>
      )}
      {user ? (
        <>
          <button onClick={handleLike}>
            {liked ? "Unlike" : "Like"} ({likeCount})
          </button>
          <p>{user.useruuid}</p>
        </>
      ) : (
        <p>Please log in to like this content.</p>
      )}
    </>
  );
}
