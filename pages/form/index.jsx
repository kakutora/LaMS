import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const alphanumericPattern = /^[A-Za-z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;

export default function ImageUploadForm() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [textField, setTextField] = useState("");
  const router = useRouter();

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleTextFieldChange = (e) => {
    setTextField(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!alphanumericPattern.test(textField)) {
      alert("テキストフィールドの値が不正です");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("text", textField);

    try {
      const response = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(response.data.message);
      router.push("/"); // リダイレクト先のURLを指定
    } catch (error) {
      // エラーハンドリング
      console.error("APIリクエストエラー:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={textField} onChange={handleTextFieldChange} />
      <input type="file" accept="image/*" onChange={handleImageChange} />
      <button type="submit">Upload</button>
    </form>
  );
}
