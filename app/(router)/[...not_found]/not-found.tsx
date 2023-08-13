import Link from "next/link";
import Image from "next/image";
import styles from "./not-found.module.css";
import Button from "../../_components/ui/Button";

const NotFound = () => {
  return (
    <div className={styles.notFound}>
      <div className={styles.header}>
        <Image
          src={"/statics/images/404.png"}
          alt="404 not found"
          width={128}
          height={128}
        />
        <h1>404 Not Found</h1>
      </div>
      <div className={styles.body}>
        <p>요청신 페이지를 찾을 수 없습니다.</p>
      </div>
      <div className={styles.footer}>
        <div className={styles.button}>
          <Button variant="success" size="md">
            <Link className={styles.href} href="/">
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
