"use client";
import { BsGearWideConnected } from "react-icons/bs";
import { FaCode, FaHardHat, FaRocket, FaTools } from "react-icons/fa";
import { MdConstruction, MdSecurity, MdSpeed } from "react-icons/md";
import styles from "./page.module.scss";

function UnderDevelopmentCard() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            <MdConstruction />
          </div>
          <div className={styles.iconBackground}></div>
          <div className={styles.iconParticles}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className={styles.particle}></div>
            ))}
          </div>
        </div>

        <h1 className={styles.title}>Tính Năng Đang Phát Triển</h1>

        {/* <div className={styles.iconRow}>
          <div className={styles.iconItem}>
            <FaUsers />
            <span>Quản lý người dùng</span>
          </div>
          <div className={styles.iconItem}>
            <FaShieldAlt />
            <span>Phân quyền</span>
          </div>
          <div className={styles.iconItem}>
            <FaCog />
            <span>Cấu hình</span>
          </div>
          <div className={styles.iconItem}>
            <FaChartLine />
            <span>Báo cáo</span>
          </div>
        </div> */}

        <div className={styles.iconRow}>
          <div className={styles.iconItem}>
            <MdSecurity />
            <span>Bảo mật</span>
          </div>
          <div className={styles.iconItem}>
            <BsGearWideConnected />
            <span>Tích hợp</span>
          </div>
          <div className={styles.iconItem}>
            <MdSpeed />
            <span>Tối ưu</span>
          </div>
          <div className={styles.iconItem}>
            <FaRocket />
            <span>Triển khai</span>
          </div>
        </div>

        <p className={styles.description}>
          Chúng tôi đang nỗ lực phát triển tính năng mới. Tính năng này sẽ sớm
          được ra mắt với nhiều cải tiến mới.
        </p>

        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progress}></div>
          </div>
          <div className={styles.progressInfo}>
            <p className={styles.progressText}>Hoàn thành 70%</p>
            <p className={styles.estimatedTime}>Dự kiến hoàn thành: 2 tuần</p>
          </div>
        </div>

        <div className={styles.developmentIcons}>
          <FaTools className={styles.devIcon} />
          <FaHardHat className={styles.devIcon} />
          <FaCode className={styles.devIcon} />
        </div>
      </div>
    </div>
  );
}

export default UnderDevelopmentCard;
