import Image from "next/image";
import styles from "./Loading.module.css";

type size = {
  width: number,
  height: number,
}

interface LoadingProps {
  size?: size;
}

const Loading = ({ size }: LoadingProps) => {
  return (
    <div className={styles.loading}>
      <Image
        fill={size ? false : true}
        src="/statics/images/loading.svg"
        alt="loading"
        width={size && size.width}
        height={size && size.height}
        priority
      />
    </div>
  );
};

export default Loading;
