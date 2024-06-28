import Image from "next/image";
import styles from "./index.module.css";

export default function GenericImage({ imageSrc, imageAlt }) {
  return (
    <>
      <Image
        src={imageSrc}
        alt={imageAlt}
        priority
        fill
        className={styles.image}
      />
    </>
  );
}
