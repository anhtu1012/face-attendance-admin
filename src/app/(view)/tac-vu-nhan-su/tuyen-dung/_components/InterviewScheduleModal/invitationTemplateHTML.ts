export interface InterviewDetails {
  candidate: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
  date: string;
  startTime: string;
  endTime: string;
  interviewType: "online" | "offline";
  location?: {
    id: string;
    name: string;
    address: string;
    mapUrl: string;
  };
  meetingLink?: string;
  interviewer: string;
  interviewerEmail: string;
  notes: string;
  fullDateTime: string;
}

export const generateInvitationHTML = (
  interviewDetails: InterviewDetails
): string => {
  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; border: 1px solid #ddd; font-family: 'Times New Roman', serif;">
      <!-- Header Section -->
      <div style="text-align: center; padding: 40px 30px; border-bottom: 4px solid #1890ff; background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);">
        <div style="font-size: 28px; font-weight: bold; color: #1890ff; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 2px;">
          THÔNG BÁO MỜI PHỎNG VẤN
        </div>
        <div style="font-size: 20px; color: #333; margin-bottom: 8px; font-weight: 600;">
          FaceAI Technology Solutions
        </div>
        <div style="font-size: 16px; color: #666; font-style: italic;">
          Ngày: ${new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>

      <!-- Content Section -->
      <div style="padding: 40px 30px;">
        <!-- Greeting -->
        <div style="margin-bottom: 25px;">
          <div style="font-weight: bold; font-size: 18px; margin-bottom: 8px; color: #333;">Kính gửi:</div>
          <div style="font-size: 20px; color: #1890ff; font-weight: 600; border-bottom: 2px solid #1890ff; padding-bottom: 5px; display: inline-block;">
            ${interviewDetails.candidate.fullName}
  }
          </div>
        </div>

        <!-- Introduction -->
        <div style="margin-bottom: 35px; line-height: 1.8; text-align: justify; font-size: 16px; color: #555;">
          Công ty FaceAI Technology Solutions trân trọng thông báo về lịch phỏng vấn.
          Chúng tôi rất mong được gặp gỡ và trao đổi với Anh/Chị về cơ hội nghề nghiệp tại công ty.
        </div>

        <!-- Interview Details Box -->
        <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border-left: 5px solid #1890ff; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="font-weight: bold; font-size: 18px; color: #1890ff; margin-bottom: 20px; text-align: center; text-transform: uppercase;">
            📅 THÔNG TIN PHỎNG VẤN
          </div>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333; width: 120px;">Thời gian:</td>
              <td style="padding: 8px 0; color: #1890ff; font-weight: 600;">${
                interviewDetails.fullDateTime
              }</td>
            </tr>

            ${
              interviewDetails.interviewType === "offline" &&
              interviewDetails.location
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Hình thức:</td>
              <td style="padding: 8px 0;">Phỏng vấn trực tiếp tại công ty</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Địa điểm:</td>
              <td style="padding: 8px 0; font-weight: 600;">${interviewDetails.location.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Địa chỉ:</td>
              <td style="padding: 8px 0;">${interviewDetails.location.address}</td>
            </tr>
            `
                : `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Hình thức:</td>
              <td style="padding: 8px 0;">Phỏng vấn trực tuyến</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Link meeting:</td>
              <td style="padding: 8px 0; color: #1890ff;">
                <a href="${
                  interviewDetails.meetingLink || "#"
                }" style="color: #1890ff; text-decoration: none;">
                  ${
                    interviewDetails.meetingLink ||
                    "Sẽ được gửi trước buổi phỏng vấn"
                  }
                </a>
              </td>
            </tr>
            `
            }

            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Người phỏng vấn:</td>
              <td style="padding: 8px 0; font-weight: 600;">${
                interviewDetails.interviewer
              }</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Email liên hệ:</td>
              <td style="padding: 8px 0; color: #1890ff;">
                <a href="mailto:${
                  interviewDetails.interviewerEmail
                }" style="color: #1890ff; text-decoration: none;">
                  ${interviewDetails.interviewerEmail}
                </a>
              </td>
            </tr>

            ${
              interviewDetails.notes
                ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #333;">Ghi chú:</td>
              <td style="padding: 8px 0; font-style: italic;">${interviewDetails.notes}</td>
            </tr>
            `
                : ""
            }
          </table>
        </div>

        <!-- Closing Message -->
        <div style="margin-bottom: 35px; line-height: 1.8; text-align: justify; font-size: 16px; color: #555;">
          Vui lòng xác nhận tham dự và có mặt đúng giờ. Chúng tôi rất mong được gặp gỡ Anh/Chị!
          <br/><br/>
          Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ trực tiếp qua email hoặc số điện thoại bên dưới.
        </div>

        <!-- Signature Section -->
        <div style="text-align: center; border-top: 2px solid #ddd; padding-top: 25px;">
          <div style="font-weight: bold; font-size: 18px; margin-bottom: 15px; color: #333;">Trân trọng,</div>
          <div style="font-weight: bold; font-size: 20px; color: #1890ff; margin-bottom: 20px; text-transform: uppercase;">
            Ban Nhân sự
          </div>
          <div style="font-weight: bold; font-size: 18px; margin-bottom: 8px; color: #333;">
            FaceAI Technology Solutions
          </div>
          <div style="font-size: 16px; color: #666; line-height: 1.6;">
            <div>Email: <a href="mailto:hr@faceai.vn" style="color: #1890ff; text-decoration: none;">hr@faceai.vn</a></div>
            <div>Phone: <a href="tel:(028) 1234-5678" style="color: #1890ff; text-decoration: none;">(028) 1234-5678</a></div>
            <div>Website: <a href="https://www.faceai.vn" target="_blank" style="color: #1890ff; text-decoration: none;">www.faceai.vn</a></div>
          </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 14px; color: #999;">
          Tài liệu này được tạo tự động bởi hệ thống quản lý tuyển dụng FaceAI
        </div>
      </div>
    </div>
  `;
};
