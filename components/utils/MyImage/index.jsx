import Image from "next/image";
import styles from "./index.module.css";

export default function MyImage({ customClass, imageSrc, imageAlt }) {
  return (
    <div className={customClass ?? ""}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        priority
        fill
        className={styles.image}
      />
    </div>
  );
}
