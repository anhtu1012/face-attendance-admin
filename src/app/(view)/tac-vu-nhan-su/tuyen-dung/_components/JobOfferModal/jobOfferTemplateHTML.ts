import type { JobOfferDetails } from "./JobOfferModal";

export const generateJobOfferHTML = (details: JobOfferDetails): string => {
  return `
    <div style="
      max-width: 800px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    ">
      <!-- Header with gradient -->
      <div style="
        background: linear-gradient(45deg, rgb(21, 101, 192), rgb(66, 165, 245), rgb(21, 101, 192), rgb(66, 165, 245));
        background-size: 300% 300%;
        animation: gradientShift 3s ease infinite;
        padding: 30px;
        text-align: center;
        color: white;
      ">
        <h1 style="
          margin: 0;
          font-size: 2.2rem;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        ">
          🎉 THƯ MỜI NHẬN VIỆC
        </h1>
        <p style="
          margin: 10px 0 0 0;
          font-size: 1.1rem;
          opacity: 0.95;
        ">
          FaceAI Technology Solutions
        </p>
      </div>

      <!-- Content -->
      <div style="padding: 40px;">
        <!-- Greeting -->
        <div style="
          background: linear-gradient(45deg, rgba(21, 101, 192, 0.05), rgba(66, 165, 245, 0.08));
          padding: 25px;
          border-radius: 15px;
          border-left: 5px solid rgb(21, 101, 192);
          margin-bottom: 30px;
        ">
          <h2 style="
            margin: 0 0 15px 0;
            color: rgb(21, 101, 192);
            font-size: 1.5rem;
            font-weight: 600;
          ">
            Kính chào ${details.candidate.lastName} ${
    details.candidate.firstName
  }!
          </h2>
          <p style="
            margin: 0;
            color: #333;
            font-size: 1.1rem;
            line-height: 1.6;
          ">
            Chúc mừng bạn đã được chọn để làm việc tại FaceAI Technology Solutions. Chúng tôi rất vui mừng được chào đón bạn gia nhập đội ngũ của chúng tôi.
          </p>
        </div>

        <!-- Schedule Information -->
        <div style="
          background: white;
          border: 2px solid rgba(21, 101, 192, 0.2);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 25px;
        ">
          <h3 style="
            margin: 0 0 20px 0;
            color: rgb(21, 101, 192);
            font-size: 1.3rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          ">
            📅 Thông tin lịch hẹn
          </h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="
              background: rgba(21, 101, 192, 0.05);
              padding: 15px;
              border-radius: 10px;
              border-left: 4px solid rgb(21, 101, 192);
            ">
              <strong style="color: rgb(21, 101, 192);">📅 Ngày:</strong><br>
              <span style="font-size: 1.1rem; color: #333;">${
                details.date
              }</span>
            </div>
            <div style="
              background: rgba(21, 101, 192, 0.05);
              padding: 15px;
              border-radius: 10px;
              border-left: 4px solid rgb(21, 101, 192);
            ">
              <strong style="color: rgb(21, 101, 192);">⏰ Thời gian:</strong><br>
              <span style="font-size: 1.1rem; color: #333;">${
                details.startTime
              } - ${details.endTime}</span>
            </div>
          </div>

          <div style="
            background: rgba(21, 101, 192, 0.05);
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid rgb(21, 101, 192);
          ">
            <strong style="color: rgb(21, 101, 192);">📍 Địa chỉ:</strong><br>
            <span style="font-size: 1.1rem; color: #333;">${
              details.address
            }</span>
          </div>
        </div>

        <!-- Account Information -->
        <div style="
          background: white;
          border: 2px solid rgba(21, 101, 192, 0.2);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 25px;
        ">
          <h3 style="
            margin: 0 0 20px 0;
            color: rgb(21, 101, 192);
            font-size: 1.3rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          ">
            🔐 Thông tin tài khoản
          </h3>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
            <div style="
              background: rgba(21, 101, 192, 0.05);
              padding: 15px;
              border-radius: 10px;
              border-left: 4px solid rgb(21, 101, 192);
            ">
              <strong style="color: rgb(21, 101, 192);">👤 Tên đăng nhập:</strong><br>
              <span style="font-size: 1.1rem; color: #333; font-family: monospace; background: #f0f0f0; padding: 2px 6px; border-radius: 4px;">${
                details.username
              }</span>
            </div>
            <div style="
              background: rgba(21, 101, 192, 0.05);
              padding: 15px;
              border-radius: 10px;
              border-left: 4px solid rgb(21, 101, 192);
            ">
              <strong style="color: rgb(21, 101, 192);">🔑 Mật khẩu:</strong><br>
              <span style="font-size: 1.1rem; color: #333; font-family: monospace; background: #f0f0f0; padding: 2px 6px; border-radius: 4px;">${
                details.password
              }</span>
            </div>
          </div>

          <div style="
            background: rgba(21, 101, 192, 0.05);
            padding: 15px;
            border-radius: 10px;
            border-left: 4px solid rgb(21, 101, 192);
          ">
            <strong style="color: rgb(21, 101, 192);">📱 Link tải ứng dụng:</strong><br>
            <a href="${details.appDownloadLink}" style="
              color: rgb(21, 101, 192);
              text-decoration: none;
              font-weight: 600;
              background: white;
              padding: 8px 12px;
              border-radius: 6px;
              display: inline-block;
              margin-top: 5px;
              border: 1px solid rgb(21, 101, 192);
            ">${details.appDownloadLink}</a>
          </div>
        </div>

        <!-- Guide Person Information -->
        <div style="
          background: white;
          border: 2px solid rgba(21, 101, 192, 0.2);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 25px;
        ">
          <h3 style="
            margin: 0 0 20px 0;
            color: rgb(21, 101, 192);
            font-size: 1.3rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          ">
            👨‍💼 Người hướng dẫn
          </h3>
          
          <div style="
            background: rgba(21, 101, 192, 0.05);
            padding: 20px;
            border-radius: 10px;
            border-left: 4px solid rgb(21, 101, 192);
          ">
            <div style="margin-bottom: 15px;">
              <strong style="color: rgb(21, 101, 192);">👤 Họ tên:</strong>
              <span style="font-size: 1.1rem; color: #333; margin-left: 10px;">${
                details.guidePersonName
              }</span>
            </div>
            <div style="margin-bottom: 15px;">
              <strong style="color: rgb(21, 101, 192);">📞 Số điện thoại:</strong>
              <span style="font-size: 1.1rem; color: #333; margin-left: 10px;">${
                details.guidePersonPhone
              }</span>
            </div>
            <div>
              <strong style="color: rgb(21, 101, 192);">✉️ Email:</strong>
              <span style="font-size: 1.1rem; color: #333; margin-left: 10px;">${
                details.guidePersonEmail
              }</span>
            </div>
          </div>
        </div>

        ${
          details.notes
            ? `
        <!-- Notes -->
        <div style="
          background: white;
          border: 2px solid rgba(21, 101, 192, 0.2);
          border-radius: 15px;
          padding: 25px;
          margin-bottom: 25px;
        ">
          <h3 style="
            margin: 0 0 15px 0;
            color: rgb(21, 101, 192);
            font-size: 1.3rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          ">
            📝 Ghi chú
          </h3>
          <p style="
            margin: 0;
            color: #333;
            font-size: 1rem;
            line-height: 1.6;
            background: rgba(21, 101, 192, 0.05);
            padding: 15px;
            border-radius: 10px;
          ">
            ${details.notes}
          </p>
        </div>
        `
            : ""
        }

        <!-- Footer -->
        <div style="
          background: linear-gradient(45deg, rgba(21, 101, 192, 0.05), rgba(66, 165, 245, 0.08));
          padding: 25px;
          border-radius: 15px;
          text-align: center;
          border: 1px solid rgba(21, 101, 192, 0.2);
        ">
          <p style="
            margin: 0 0 15px 0;
            color: #333;
            font-size: 1.1rem;
            line-height: 1.6;
          ">
            Chúng tôi rất mong được làm việc cùng bạn! Vui lòng đến đúng giờ và mang theo các giấy tờ cần thiết.
          </p>
          <p style="
            margin: 0;
            color: rgb(21, 101, 192);
            font-weight: 600;
            font-size: 1rem;
          ">
            Trân trọng,<br>
            <strong>Phòng Nhân sự - FaceAI Technology Solutions</strong>
          </p>
        </div>
      </div>
    </div>

    <style>
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    </style>
  `;
};
