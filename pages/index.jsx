import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Masonry from "react-masonry-css";

import Layout from "@/layouts/MainLayout";
import MyImage from "@/components/utils/MyImage";
import { userAuth } from "@/lib/auth";

import styles from "./index.module.css";

export async function getServerSideProps({ req }) {
  const user = await userAuth(req.headers.cookie);

  return {
    props: {
      user,
    },
  };
}

export default function Home({ user, data }) {
  return (
    <Layout user={user}>
      <Link href="/form">form</Link>
    </Layout>
  );
}
