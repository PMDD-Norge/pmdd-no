import Text from "@/components/text/Text";
import styles from "./loadingPosts.module.css";

const LoadingPosts = async () => {
  return (
    <div className={styles.wrapper}>
      <Text className={styles.loading}>
        Laster...
      </Text>
    </div>
  );
};

export default LoadingPosts;
