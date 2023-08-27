"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "../../_components/ui/Button";
import styles from "./error.module.css";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // useEffect(() => {
  //   // Log the error to an error reporting service
  //   console.error(error);
  // }, [error]);
  return (
    <div className={styles.notFound}>
      <div className={styles.header}>
        <Image
          src={"/statics/images/404.png"}
          alt="404 not found"
          priority
          width={128}
          height={128}
        />
        {error.message}
        <h1>ERROR 500</h1>
      </div>
      <div className={styles.body}>
        <p>다시 시도하기 버튼을 클릭하시거나 잠시후 다시 시도해 주세요. </p>
      </div>
      <div className={styles.footer}>
        <div className={styles.button}>
          <Button variant="success" size="md" onClick={reset}>
              다시 시도하기
          </Button>
          <Button variant="primary" size="md">
            <Link className={styles.href} href="/">
              홈으로 돌아가기
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
