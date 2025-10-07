import React from "react";

interface JobOfferDetails {
  candidate: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  address: string;
  username: string;
  password: string;
  appDownloadLink: string;
  guidePersonName: string;
  guidePersonPhone: string;
  guidePersonEmail: string;
  notes: string;
  fullDateTime: string;
}

interface JobOfferInvitationProps {
  jobOfferDetails: JobOfferDetails;
}

const JobOfferInvitation: React.FC<JobOfferInvitationProps> = ({
  jobOfferDetails: details,
}) => {
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header with gradient */}
      <div
        style={{
          background:
            "linear-gradient(45deg, rgb(21, 101, 192), rgb(66, 165, 245), rgb(21, 101, 192), rgb(66, 165, 245))",
          backgroundSize: "300% 300%",
          padding: "30px",
          textAlign: "center" as const,
          color: "white",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2.2rem",
            fontWeight: 700,
            textShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
          }}
        >
          🎉 THƯ MỜI NHẬN VIỆC
        </h1>
        <p
          style={{
            margin: "10px 0 0 0",
            fontSize: "1.1rem",
            opacity: 0.95,
          }}
        >
          FaceAI Technology Solutions
        </p>
      </div>

      {/* Content */}
      <div style={{ padding: "40px" }}>
        {/* Greeting */}
        <div
          style={{
            background:
              "linear-gradient(45deg, rgba(21, 101, 192, 0.05), rgba(66, 165, 245, 0.08))",
            padding: "25px",
            borderRadius: "15px",
            borderLeft: "5px solid rgb(21, 101, 192)",
            marginBottom: "30px",
          }}
        >
          <h2
            style={{
              margin: "0 0 15px 0",
              color: "rgb(21, 101, 192)",
              fontSize: "1.5rem",
              fontWeight: 600,
            }}
          >
            Kính chào {details.candidate.fullName}!
          </h2>
          <p
            style={{
              margin: 0,
              color: "#333",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            Chúc mừng bạn đã được chọn để làm việc tại FaceAI Technology
            Solutions. Chúng tôi rất vui mừng được chào đón bạn gia nhập đội ngũ
            của chúng tôi.
          </p>
        </div>

        {/* Schedule Information */}
        <div
          style={{
            background: "white",
            border: "2px solid rgba(21, 101, 192, 0.2)",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "25px",
          }}
        >
          <h3
            style={{
              margin: "0 0 20px 0",
              color: "rgb(21, 101, 192)",
              fontSize: "1.3rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            📅 Thông tin lịch hẹn
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                background: "rgba(21, 101, 192, 0.05)",
                padding: "15px",
                borderRadius: "10px",
                borderLeft: "4px solid rgb(21, 101, 192)",
              }}
            >
              <strong style={{ color: "rgb(21, 101, 192)" }}>📅 Ngày:</strong>
              <br />
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {details.date}
              </span>
            </div>
            <div
              style={{
                background: "rgba(21, 101, 192, 0.05)",
                padding: "15px",
                borderRadius: "10px",
                borderLeft: "4px solid rgb(21, 101, 192)",
              }}
            >
              <strong style={{ color: "rgb(21, 101, 192)" }}>
                ⏰ Thời gian:
              </strong>
              <br />
              <span style={{ fontSize: "1.1rem", color: "#333" }}>
                {details.startTime} - {details.endTime}
              </span>
            </div>
          </div>

          <div
            style={{
              background: "rgba(21, 101, 192, 0.05)",
              padding: "15px",
              borderRadius: "10px",
              borderLeft: "4px solid rgb(21, 101, 192)",
            }}
          >
            <strong style={{ color: "rgb(21, 101, 192)" }}>📍 Địa chỉ:</strong>
            <br />
            <span style={{ fontSize: "1.1rem", color: "#333" }}>
              {details.address}
            </span>
          </div>
        </div>

        {/* Account Information */}
        <div
          style={{
            background: "white",
            border: "2px solid rgba(21, 101, 192, 0.2)",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "25px",
          }}
        >
          <h3
            style={{
              margin: "0 0 20px 0",
              color: "rgb(21, 101, 192)",
              fontSize: "1.3rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            🔐 Thông tin tài khoản
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                background: "rgba(21, 101, 192, 0.05)",
                padding: "15px",
                borderRadius: "10px",
                borderLeft: "4px solid rgb(21, 101, 192)",
              }}
            >
              <strong style={{ color: "rgb(21, 101, 192)" }}>
                👤 Tên đăng nhập:
              </strong>
              <br />
              <span
                style={{
                  fontSize: "1.1rem",
                  color: "#333",
                  fontFamily: "monospace",
                  background: "#f0f0f0",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {details.username}
              </span>
            </div>
            <div
              style={{
                background: "rgba(21, 101, 192, 0.05)",
                padding: "15px",
                borderRadius: "10px",
                borderLeft: "4px solid rgb(21, 101, 192)",
              }}
            >
              <strong style={{ color: "rgb(21, 101, 192)" }}>
                🔑 Mật khẩu:
              </strong>
              <br />
              <span
                style={{
                  fontSize: "1.1rem",
                  color: "#333",
                  fontFamily: "monospace",
                  background: "#f0f0f0",
                  padding: "2px 6px",
                  borderRadius: "4px",
                }}
              >
                {details.password}
              </span>
            </div>
          </div>

          <div
            style={{
              background: "rgba(21, 101, 192, 0.05)",
              padding: "15px",
              borderRadius: "10px",
              borderLeft: "4px solid rgb(21, 101, 192)",
            }}
          >
            <strong style={{ color: "rgb(21, 101, 192)" }}>
              📱 Link tải ứng dụng:
            </strong>
            <br />
            <a
              href={details.appDownloadLink}
              style={{
                color: "rgb(21, 101, 192)",
                textDecoration: "none",
                fontWeight: 600,
                background: "white",
                padding: "8px 12px",
                borderRadius: "6px",
                display: "inline-block",
                marginTop: "5px",
                border: "1px solid rgb(21, 101, 192)",
              }}
            >
              {details.appDownloadLink}
            </a>
          </div>
        </div>

        {/* Guide Person Information */}
        <div
          style={{
            background: "white",
            border: "2px solid rgba(21, 101, 192, 0.2)",
            borderRadius: "15px",
            padding: "25px",
            marginBottom: "25px",
          }}
        >
          <h3
            style={{
              margin: "0 0 20px 0",
              color: "rgb(21, 101, 192)",
              fontSize: "1.3rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            👨‍💼 Người hướng dẫn
          </h3>

          <div
            style={{
              background: "rgba(21, 101, 192, 0.05)",
              padding: "20px",
              borderRadius: "10px",
              borderLeft: "4px solid rgb(21, 101, 192)",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "rgb(21, 101, 192)" }}>👤 Họ tên:</strong>
              <span
                style={{
                  fontSize: "1.1rem",
                  color: "#333",
                  marginLeft: "10px",
                }}
              >
                {details.guidePersonName}
              </span>
            </div>
            <div style={{ marginBottom: "15px" }}>
              <strong style={{ color: "rgb(21, 101, 192)" }}>
                📞 Số điện thoại:
              </strong>
              <span
                style={{
                  fontSize: "1.1rem",
                  color: "#333",
                  marginLeft: "10px",
                }}
              >
                {details.guidePersonPhone}
              </span>
            </div>
            <div>
              <strong style={{ color: "rgb(21, 101, 192)" }}>✉️ Email:</strong>
              <span
                style={{
                  fontSize: "1.1rem",
                  color: "#333",
                  marginLeft: "10px",
                }}
              >
                {details.guidePersonEmail}
              </span>
            </div>
          </div>
        </div>

        {/* Notes */}
        {details.notes && (
          <div
            style={{
              background: "white",
              border: "2px solid rgba(21, 101, 192, 0.2)",
              borderRadius: "15px",
              padding: "25px",
              marginBottom: "25px",
            }}
          >
            <h3
              style={{
                margin: "0 0 15px 0",
                color: "rgb(21, 101, 192)",
                fontSize: "1.3rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              📝 Ghi chú
            </h3>
            <p
              style={{
                margin: 0,
                color: "#333",
                fontSize: "1rem",
                lineHeight: 1.6,
                background: "rgba(21, 101, 192, 0.05)",
                padding: "15px",
                borderRadius: "10px",
              }}
            >
              {details.notes}
            </p>
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            background:
              "linear-gradient(45deg, rgba(21, 101, 192, 0.05), rgba(66, 165, 245, 0.08))",
            padding: "25px",
            borderRadius: "15px",
            textAlign: "center" as const,
            border: "1px solid rgba(21, 101, 192, 0.2)",
          }}
        >
          <p
            style={{
              margin: "0 0 15px 0",
              color: "#333",
              fontSize: "1.1rem",
              lineHeight: 1.6,
            }}
          >
            Chúng tôi rất mong được làm việc cùng bạn! Vui lòng đến đúng giờ và
            mang theo các giấy tờ cần thiết.
          </p>
          <p
            style={{
              margin: 0,
              color: "rgb(21, 101, 192)",
              fontWeight: 600,
              fontSize: "1rem",
            }}
          >
            Trân trọng,
            <br />
            <strong>Phòng Nhân sự - FaceAI Technology Solutions</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobOfferInvitation;
