import styles from "./Following.module.css";

const Following = () => {
  return (
    <div className={styles.feed}>
      <div className={styles.emptyFeed}>
        <h3>Following</h3>
        <p>Posts from people you follow will appear here</p>
      </div>
    </div>
  );
};

export default Following;