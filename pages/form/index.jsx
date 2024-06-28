import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { userAuth } from "@/lib/auth";

import axios from "axios";

const alphanumericPattern = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;

export async function getServerSideProps({ req }) {
  const user = await userAuth(req.headers.cookie);

  if (!user || !req.headers.cookie) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
}

export default function ImageUploadForm({ user }) {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);
  const [titleField, setTitleField] = useState("");

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleTitleFieldChange = (e) => {
    setTitleField(e.target.value);
  };

  const handleSubmit = (user) => async (event) => {
    event.preventDefault();

    if (!alphanumericPattern.test(titleField)) {
      alert("テキストフィールドの値が不正です");
      return;
    }
    console.log(selectedImage);
    if (!selectedImage) {
      //alert("画像がセットされてないよ");
      //return;
    }

    if (!user || !user.userid) {
      alert("ユーザー情報が見つかりません");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("title", titleField);
    formData.append("userUUID", user.useruuid);

    try {
      const response = await axios.post("/api/image/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      router.push("/test"); // リダイレクト先のURLを指定
    } catch (error) {
      // エラーハンドリング
      console.error("APIリクエストエラー:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(user)}>
      <input
        type="text"
        value={titleField}
        required
        onChange={handleTitleFieldChange}
      />
      <input
        type="file"
        accept="image/*"
        //required
        onChange={handleImageChange}
      />
      <button type="submit">Upload</button>
    </form>
  );
}
