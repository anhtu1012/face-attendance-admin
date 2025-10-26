// Sample data for Contract Form

export const statusOptions = [
  { label: "Đang soạn thảo", value: "draft" },
  { label: "Chờ phê duyệt", value: "pending" },
  { label: "Đã phê duyệt", value: "approved" },
  { label: "Đang thực hiện", value: "active" },
  { label: "Đã kết thúc", value: "completed" },
  { label: "Đã hủy", value: "cancelled" },
];

export const branchOptions = [
  { label: "Chi nhánh Hà Nội", value: "HN" },
  { label: "Chi nhánh TP.HCM", value: "HCM" },
  { label: "Chi nhánh Đà Nẵng", value: "DN" },
  { label: "Chi nhánh Cần Thơ", value: "CT" },
  { label: "Chi nhánh Hải Phòng", value: "HP" },
];

export const positionOptions = [
  { label: "Nhân viên", value: "staff" },
  { label: "Trưởng nhóm", value: "team_lead" },
  { label: "Quản lý", value: "manager" },
  { label: "Giám đốc", value: "director" },
  { label: "Tổng giám đốc", value: "ceo" },
];

export const managerOptions = [
  { label: "Nguyễn Văn An", value: "nguyen_van_an" },
  { label: "Trần Thị Bình", value: "tran_thi_binh" },
  { label: "Lê Hoàng Cường", value: "le_hoang_cuong" },
  { label: "Phạm Minh Đức", value: "pham_minh_duc" },
];

// Template HTML cho hợp đồng (không còn sử dụng markdown)
export const contractTemplates = [
  {
    id: "basic",
    name: "Hợp đồng cơ bản",
    description: "Template cơ bản cho hợp đồng lao động",
    content: `
      <h1>HỢP ĐỒNG LAO ĐỘNG</h1>
      
      <h2>NỘI DUNG CÔNG VIỆC</h2>
      
      <h3>Vị trí làm việc</h3>
      <ul>
        <li><strong>Chức danh</strong>: [Chức danh công việc]</li>
        <li><strong>Phòng ban</strong>: [Tên phòng ban]</li>
        <li><strong>Địa điểm làm việc</strong>: [Địa điểm]</li>
      </ul>
      
      <h3>Mô tả công việc</h3>
      <ul>
        <li>Thực hiện các nhiệm vụ được giao theo đúng quy trình</li>
        <li>Tuân thủ nội quy, quy chế của công ty</li>
        <li>Báo cáo kết quả công việc định kỳ</li>
      </ul>
      
      <h2>THỜI GIAN LÀM VIỆC</h2>
      
      <ul>
        <li><strong>Thời gian</strong>: 8 giờ/ngày, 5 ngày/tuần</li>
        <li><strong>Giờ làm việc</strong>: 08:00 - 17:00 (nghỉ trưa 12:00-13:00)</li>
        <li><strong>Ngày nghỉ</strong>: Thứ 7, Chủ nhật và các ngày lễ theo quy định</li>
      </ul>
      
      <h2>LƯƠNG VÀ PHÚC LỢI</h2>
      
      <h3>Mức lương</h3>
      <ul>
        <li><strong>Lương cơ bản</strong>: [Mức lương] VNĐ/tháng</li>
        <li><strong>Phụ cấp</strong>: [Các khoản phụ cấp]</li>
        <li><strong>Thưởng</strong>: Theo quy định của công ty</li>
      </ul>
      
      <h3>Chế độ phúc lợi</h3>
      <ul>
        <li>Bảo hiểm xã hội, y tế, thất nghiệp theo luật định</li>
        <li>Nghỉ phép năm: 12 ngày/năm</li>
        <li>Khám sức khỏe định kỳ</li>
      </ul>
      
      <h2>QUYỀN VÀ NGHĨA VỤ</h2>
      
      <h3>Quyền của người lao động</h3>
      <ul>
        <li>Được hưởng đầy đủ các chế độ theo hợp đồng</li>
        <li>Được đào tạo, nâng cao trình độ chuyên môn</li>
        <li>Được nghỉ phép theo quy định</li>
      </ul>
      
      <h3>Nghĩa vụ của người lao động</h3>
      <ul>
        <li>Thực hiện đúng nhiệm vụ được giao</li>
        <li>Tuân thủ nội quy, quy chế công ty</li>
        <li>Bảo mật thông tin công ty</li>
      </ul>
      
      <h2>ĐIỀU KHOẢN CHUNG</h2>
      
      <ul>
        <li>Hợp đồng có hiệu lực từ ngày ký</li>
        <li>Mọi tranh chấp được giải quyết thông qua thương lượng</li>
        <li>Hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau</li>
      </ul>
    `,
  },
  {
    id: "detailed",
    name: "Hợp đồng chi tiết",
    description: "Template chi tiết với đầy đủ điều khoản",
    content: `
      <h1>HỢP ĐỒNG LAO ĐỘNG CHI TIẾT</h1>
      
      <h2>NỘI DUNG CÔNG VIỆC</h2>
      
      <h3>Thông tin vị trí</h3>
      <ul>
        <li><strong>Chức danh</strong>: [Tên chức danh cụ thể]</li>
        <li><strong>Cấp bậc</strong>: [Level/Grade]</li>
        <li><strong>Phòng ban</strong>: [Tên phòng ban]</li>
        <li><strong>Báo cáo cho</strong>: [Tên người quản lý trực tiếp]</li>
        <li><strong>Địa điểm</strong>: [Chi nhánh/Văn phòng làm việc]</li>
      </ul>
      
      <h3>Mô tả chi tiết công việc</h3>
      <h4>Mục tiêu chính</h4>
      <ul>
        <li>Đạt được các KPI được giao hàng tháng/quý</li>
        <li>Đóng góp vào sự phát triển của team và công ty</li>
        <li>Nâng cao chất lượng sản phẩm/dịch vụ</li>
      </ul>
      
      <h2>THỜI GIAN LÀM VIỆC</h2>
      
      <h3>Lịch làm việc tiêu chuẩn</h3>
      <ul>
        <li><strong>Số giờ</strong>: 40 giờ/tuần (8 giờ/ngày × 5 ngày)</li>
        <li><strong>Thời gian</strong>: 08:00 - 17:00 (Thứ 2 - Thứ 6)</li>
        <li><strong>Nghỉ trưa</strong>: 12:00 - 13:00</li>
        <li><strong>Nghỉ cuối tuần</strong>: Thứ 7, Chủ nhật</li>
      </ul>
      
      <h3>Chế độ linh hoạt</h3>
      <ul>
        <li><strong>Remote work</strong>: Tối đa 2 ngày/tuần (theo thỏa thuận)</li>
        <li><strong>Flexible time</strong>: Có thể điều chỉnh giờ vào/ra (±1 giờ)</li>
        <li><strong>Overtime</strong>: Được thanh toán 150% lương theo giờ</li>
      </ul>
      
      <h2>LƯƠNG VÀ PHÚC LỢI</h2>
      
      <h3>Cơ cấu lương</h3>
      <table border="1" style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr>
            <th>Khoản mục</th>
            <th>Mức tiền</th>
            <th>Ghi chú</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Lương cơ bản</strong></td>
            <td>[Số tiền] VNĐ</td>
            <td>Cố định hàng tháng</td>
          </tr>
          <tr>
            <td><strong>Phụ cấp ăn trưa</strong></td>
            <td>1,000,000 VNĐ</td>
            <td>22 ngày làm việc</td>
          </tr>
          <tr>
            <td><strong>Phụ cấp xăng xe</strong></td>
            <td>500,000 VNĐ</td>
            <td>Hỗ trợ đi lại</td>
          </tr>
        </tbody>
      </table>
      
      <h3>Bảo hiểm và phúc lợi</h3>
      <h4>Bảo hiểm bắt buộc</h4>
      <ul>
        <li>BHXH: 17.5% (Công ty: 10.5%, NV: 8%)</li>
        <li>BHYT: 4.5% (Công ty: 3%, NV: 1.5%)</li>
        <li>BHTN: 2% (Công ty: 1%, NV: 1%)</li>
      </ul>
    `,
  },
  {
    id: "probation",
    name: "Hợp đồng thử việc",
    description: "Template cho giai đoạn thử việc",
    content: `
      <h1>HỢP ĐỒNG THỬ VIỆC</h1>
      
      <h2>MỤC TIÊU THỬ VIỆC</h2>
      
      <h3>Mục tiêu cho ứng viên</h3>
      <ul>
        <li>Làm quen với môi trường làm việc</li>
        <li>Nắm vững quy trình, công cụ làm việc</li>
        <li>Hoàn thành các task được giao</li>
        <li>Thể hiện khả năng làm việc nhóm</li>
      </ul>
      
      <h3>Tiêu chí đánh giá</h3>
      <ol>
        <li><strong>Chuyên môn</strong> (40%):
          <ul>
            <li>Kỹ năng kỹ thuật</li>
            <li>Khả năng giải quyết vấn đề</li>
            <li>Chất lượng công việc</li>
          </ul>
        </li>
        <li><strong>Thái độ</strong> (30%):
          <ul>
            <li>Tích cực, chủ động</li>
            <li>Tinh thần trách nhiệm</li>
            <li>Khả năng học hỏi</li>
          </ul>
        </li>
        <li><strong>Teamwork</strong> (30%):
          <ul>
            <li>Giao tiếp hiệu quả</li>
            <li>Hỗ trợ đồng nghiệp</li>
            <li>Hòa nhập với team</li>
          </ul>
        </li>
      </ol>
      
      <h2>CHẾ ĐỘ THỬ VIỆC</h2>
      
      <h3>Lương thử việc</h3>
      <ul>
        <li><strong>Mức lương</strong>: 85% lương chính thức</li>
        <li><strong>Thanh toán</strong>: Cuối tháng</li>
        <li><strong>Phụ cấp</strong>: Ăn trưa + Xăng xe</li>
      </ul>
      
      <h3>Quyền lợi</h3>
      <ul>
        <li>Được hướng dẫn bởi mentor</li>
        <li>Tham gia training nội bộ</li>
        <li>Sử dụng đầy đủ trang thiết bị</li>
        <li>Nghỉ phép 1 ngày/tháng</li>
      </ul>
    `,
  },
];
