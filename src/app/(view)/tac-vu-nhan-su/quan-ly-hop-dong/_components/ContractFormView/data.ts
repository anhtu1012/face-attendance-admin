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

// Template markdown cho hợp đồng
export const contractTemplates = [
  {
    id: "basic",
    name: "Hợp đồng cơ bản",
    description: "Template cơ bản cho hợp đồng lao động",
    content: `# HỢP ĐỒNG LAO ĐỘNG

## NỘI DUNG CÔNG VIỆC

### Vị trí làm việc
- **Chức danh**: [Chức danh công việc]
- **Phòng ban**: [Tên phòng ban]
- **Địa điểm làm việc**: [Địa điểm]

### Mô tả công việc
- Thực hiện các nhiệm vụ được giao theo đúng quy trình
- Tuân thủ nội quy, quy chế của công ty
- Báo cáo kết quả công việc định kỳ

## THỜI GIAN LÀM VIỆC

- **Thời gian**: 8 giờ/ngày, 5 ngày/tuần
- **Giờ làm việc**: 08:00 - 17:00 (nghỉ trưa 12:00-13:00)
- **Ngày nghỉ**: Thứ 7, Chủ nhật và các ngày lễ theo quy định

## LƯƠNG VÀ PHÚC LỢI

### Mức lương
- **Lương cơ bản**: [Mức lương] VNĐ/tháng
- **Phụ cấp**: [Các khoản phụ cấp]
- **Thưởng**: Theo quy định của công ty

### Chế độ phúc lợi
- Bảo hiểm xã hội, y tế, thất nghiệp theo luật định
- Nghỉ phép năm: 12 ngày/năm
- Khám sức khỏe định kỳ

## QUYỀN VÀ NGHĨA VỤ

### Quyền của người lao động
- Được hưởng đầy đủ các chế độ theo hợp đồng
- Được đào tạo, nâng cao trình độ chuyên môn
- Được nghỉ phép theo quy định

### Nghĩa vụ của người lao động
- Thực hiện đúng nhiệm vụ được giao
- Tuân thủ nội quy, quy chế công ty
- Bảo mật thông tin công ty

## ĐIỀU KHOẢN CHUNG

- Hợp đồng có hiệu lực từ ngày ký
- Mọi tranh chấp được giải quyết thông qua thương lượng
- Hợp đồng được lập thành 02 bản có giá trị pháp lý như nhau

---
*Ngày ký: [Ngày/Tháng/Năm]*

**BÊN A**                    **BÊN B**
*(Ký tên, đóng dấu)*         *(Ký tên)*`,
  },
  {
    id: "detailed",
    name: "Hợp đồng chi tiết",
    description: "Template chi tiết với đầy đủ điều khoản",
    content: `# HỢP ĐỒNG LAO ĐỘNG CHI TIẾT

## NỘI DUNG CÔNG VIỆC

### Thông tin vị trí
- **Chức danh**: [Tên chức danh cụ thể]
- **Cấp bậc**: [Level/Grade]
- **Phòng ban**: [Tên phòng ban]
- **Báo cáo cho**: [Tên người quản lý trực tiếp]
- **Địa điểm**: [Chi nhánh/Văn phòng làm việc]

### Mô tả chi tiết công việc
#### Mục tiêu chính
- Đạt được các KPI được giao hàng tháng/quý
- Đóng góp vào sự phát triển của team và công ty
- Nâng cao chất lượng sản phẩm/dịch vụ

#### Nhiệm vụ cụ thể
1. **Nhiệm vụ hàng ngày**:
   - Thực hiện các công việc được giao theo kế hoạch
   - Tham gia các cuộc họp team/dự án
   - Cập nhật tiến độ công việc

2. **Nhiệm vụ định kỳ**:
   - Báo cáo kết quả công việc hàng tuần
   - Đánh giá và cải thiện quy trình làm việc
   - Tham gia đào tạo nâng cao kỹ năng

3. **Trách nhiệm khác**:
   - Hỗ trợ đồng nghiệp khi cần thiết
   - Đề xuất cải tiến quy trình
   - Tuân thủ các quy định về bảo mật

## THỜI GIAN LÀM VIỆC

### Lịch làm việc tiêu chuẩn
- **Số giờ**: 40 giờ/tuần (8 giờ/ngày × 5 ngày)
- **Thời gian**: 08:00 - 17:00 (Thứ 2 - Thứ 6)
- **Nghỉ trưa**: 12:00 - 13:00
- **Nghỉ cuối tuần**: Thứ 7, Chủ nhật

### Chế độ linh hoạt
- **Remote work**: Tối đa 2 ngày/tuần (theo thỏa thuận)
- **Flexible time**: Có thể điều chỉnh giờ vào/ra (±1 giờ)
- **Overtime**: Được thanh toán 150% lương theo giờ

### Ngày nghỉ lễ
- Tất cả ngày lễ theo quy định của Nhà nước
- Nghỉ Tết Nguyên đán: 7-10 ngày
- Nghỉ phép năm: 12-15 ngày (tùy theo thâm niên)

## LƯƠNG VÀ PHÚC LỢI

### Cơ cấu lương
| Khoản mục | Mức tiền | Ghi chú |
|-----------|----------|---------|
| **Lương cơ bản** | [Số tiền] VNĐ | Cố định hàng tháng |
| **Phụ cấp ăn trưa** | 1,000,000 VNĐ | 22 ngày làm việc |
| **Phụ cấp xăng xe** | 500,000 VNĐ | Hỗ trợ đi lại |
| **Phụ cấp điện thoại** | 200,000 VNĐ | Hỗ trợ liên lạc công việc |

### Thưởng và bonus
- **Thưởng tháng 13**: 1 tháng lương cơ bản
- **Thưởng hiệu suất**: 10-30% lương cơ bản (theo KPI)
- **Thưởng dự án**: Theo quy định riêng
- **Thưởng lễ/tết**: Theo chính sách công ty

### Bảo hiểm và phúc lợi
#### Bảo hiểm bắt buộc
- BHXH: 17.5% (Công ty: 10.5%, NV: 8%)
- BHYT: 4.5% (Công ty: 3%, NV: 1.5%)
- BHTN: 2% (Công ty: 1%, NV: 1%)

#### Bảo hiểm bổ sung
- **Bảo hiểm sức khỏe**: Bao gồm cả gia đình
- **Bảo hiểm nha khoa**: 5,000,000 VNĐ/năm
- **Gói khám sức khỏe**: Định kỳ 6 tháng/lần

#### Phúc lợi khác
- **Sinh nhật**: Quà sinh nhật + 1 ngày nghỉ
- **Thai sản**: Hỗ trợ thêm 2 tháng lương
- **Du lịch**: Team building 2 lần/năm
- **Đào tạo**: Ngân sách 10,000,000 VNĐ/năm

## QUYỀN VÀ NGHĨA VỤ

### Quyền lợi của người lao động
1. **Về công việc**:
   - Được làm việc trong môi trường an toàn, văn minh
   - Được cung cấp đầy đủ trang thiết bị làm việc
   - Được đào tạo nâng cao trình độ chuyên môn

2. **Về thời gian**:
   - Được nghỉ phép theo quy định
   - Được nghỉ ốm có lương
   - Được sắp xếp thời gian làm việc hợp lý

3. **Về thu nhập**:
   - Được trả lương đầy đủ, đúng hạn
   - Được hưởng các khoản thưởng theo quy định
   - Được tăng lương định kỳ

### Nghĩa vụ của người lao động
1. **Về chuyên môn**:
   - Thực hiện công việc đúng tiêu chuẩn chất lượng
   - Tuân thủ quy trình, hướng dẫn kỹ thuật
   - Cập nhật kiến thức, kỹ năng liên tục

2. **Về kỷ luật**:
   - Chấp hành nội quy lao động
   - Đi làm đúng giờ, đầy đủ
   - Không sử dụng tài sản công ty vào mục đích cá nhân

3. **Về bảo mật**:
   - Bảo mật thông tin khách hàng, đối tác
   - Không tiết lộ bí mật kinh doanh
   - Không cạnh tranh không lành mạnh

## ĐIỀU KHOẢN ĐẶC BIỆT

### Điều khoản bảo mật
- Thời hạn bảo mật: 2 năm sau khi chấm dứt hợp đồng
- Phạm vi bảo mật: Tất cả thông tin liên quan đến công ty
- Vi phạm: Bồi thường thiệt hại theo quy định pháp luật

### Điều khoản cạnh tranh
- Không được làm việc cho đối thủ cạnh tranh trong 12 tháng
- Không được thành lập công ty cùng lĩnh vực trong 18 tháng
- Bồi thường: 6 tháng lương nếu vi phạm

### Điều khoản thay đổi
- Mọi thay đổi phải được thỏa thuận bằng văn bản
- Có chữ ký của cả hai bên
- Lập thành phụ lục đính kèm hợp đồng

## CHẤM DỨT HỢP ĐỒNG

### Các trường hợp chấm dứt
1. **Hết thời hạn hợp đồng**
2. **Thỏa thuận chấm dứt**
3. **Vi phạm nghiêm trọng**
4. **Đơn phương chấm dứt** (báo trước 30 ngày)

### Thủ tục bàn giao
- Hoàn thành công việc đang thực hiện
- Bàn giao tài sản, tài liệu công ty
- Thanh toán các khoản còn lại trong 7 ngày

---
*Hotline hỗ trợ: [Số điện thoại]*  
*Email: [Email liên hệ]*`,
  },
  {
    id: "probation",
    name: "Hợp đồng thử việc",
    description: "Template cho giai đoạn thử việc",
    content: `# HỢP ĐỒNG THỬ VIỆC

## MỤC TIÊU THỬ VIỆC

### Mục tiêu cho ứng viên
- Làm quen với môi trường làm việc
- Nắm vững quy trình, công cụ làm việc
- Hoàn thành các task được giao
- Thể hiện khả năng làm việc nhóm

### Tiêu chí đánh giá
1. **Chuyên môn** (40%):
   - Kỹ năng kỹ thuật
   - Khả năng giải quyết vấn đề
   - Chất lượng công việc

2. **Thái độ** (30%):
   - Tích cực, chủ động
   - Tinh thần trách nhiệm
   - Khả năng học hỏi

3. **Teamwork** (30%):
   - Giao tiếp hiệu quả
   - Hỗ trợ đồng nghiệp
   - Hòa nhập với team

## KẾ HOẠCH THỬ VIỆC

### Tuần 1-2: Làm quen
- Tìm hiểu về công ty, sản phẩm
- Gặp gỡ team members
- Setup môi trường làm việc
- Đọc tài liệu hướng dẫn

### Tuần 3-6: Thực hành
- Tham gia dự án thực tế
- Hoàn thành task đầu tiên
- Báo cáo tiến độ hàng tuần
- Làm việc với mentor

### Tuần 7-8: Đánh giá
- Self-assessment
- Feedback từ manager
- Peer review từ đồng nghiệp
- Đánh giá tổng thể

## CHỈ ĐỘ THỬ VIỆC

### Lương thử việc
- **Mức lương**: 85% lương chính thức
- **Thanh toán**: Cuối tháng
- **Phụ cấp**: Ăn trưa + Xăng xe

### Quyền lợi
- Được hướng dẫn bởi mentor
- Tham gia training nội bộ
- Sử dụng đầy đủ trang thiết bị
- Nghỉ phép 1 ngày/tháng

## QUY TRÌNH ĐÁNH GIÁ

### Milestone đánh giá
- **Tuần 2**: Check-in đầu tiên
- **Tuần 4**: Mid-review
- **Tuần 6**: Pre-final review
- **Tuần 8**: Final evaluation

### Kết quả có thể
1. **Pass**: Ký hợp đồng chính thức
2. **Extend**: Gia hạn thử việc (tối đa 1 tháng)
3. **Not pass**: Kết thúc hợp đồng

### Feedback process
- **Weekly 1-1**: Với manager trực tiếp
- **Bi-weekly report**: Tự đánh giá tiến độ
- **Goal setting**: Điều chỉnh mục tiêu nếu cần

## KỲ VỌNG VÀ MỤC TIÊU

### Từ công ty
> *"Chúng tôi kỳ vọng bạn sẽ nhanh chóng hòa nhập và đóng góp tích cực vào team. Đây là cơ hội để cả hai bên hiểu rõ nhau hơn."*

### Từ ứng viên
- Chủ động học hỏi và thích ứng
- Đặt câu hỏi khi cần thiết
- Cải thiện liên tục
- Xây dựng mối quan hệ tốt

## LIÊN HỆ HỖ TRỢ

### Mentor
- **Tên**: [Tên mentor]
- **Chức vụ**: [Chức vụ]
- **Email**: [Email]
- **Slack**: @[username]

### HR Support
- **Tên**: [Tên HR]
- **Email**: [Email HR]
- **Điện thoại**: [SĐT]

---

## XÁC NHẬN

*Ngày bắt đầu thử việc: [DD/MM/YYYY]*  
*Ngày kết thúc dự kiến: [DD/MM/YYYY]*

**CÔNG TY**                 **ỨNG VIÊN**  
*(Ký tên, đóng dấu)*        *(Ký tên)*

---
*Chúc bạn thành công trong thời gian thử việc!*`,
  },
  {
    id: "internship",
    name: "Hợp đồng thực tập",
    description: "Template dành cho sinh viên thực tập",
    content: `# HỢP ĐỒNG THỰC TÂP SINH

## MỤC TIÊU THỰC TÂP

### Mục tiêu học tập
1. **Kiến thức thực tế**:
   - Áp dụng lý thuyết vào thực tiễn
   - Hiểu rõ quy trình làm việc chuyên nghiệp
   - Làm quen với công nghệ mới

2. **Kỹ năng mềm**:
   - Giao tiếp trong môi trường công sở
   - Làm việc nhóm hiệu quả
   - Quản lý thời gian và công việc

3. **Định hướng nghề nghiệp**:
   - Khám phá sở thích, thế mạnh
   - Xây dựng network nghề nghiệp
   - Chuẩn bị cho việc làm sau tốt nghiệp

## CHƯƠNG TRÌNH THỰC TÂP

### Phase 1: Orientation (Tuần 1)
- Company tour: Tham quan công ty
- Meet the team: Gặp gỡ đồng nghiệp
- Onboarding: Tìm hiểu quy trình, tools
- Goal setting: Thiết lập mục tiêu cá nhân

### Phase 2: Learning (Tuần 2-8)
- Training sessions: Các buổi đào tạo
- Shadow work: Theo dõi mentor làm việc
- Hands-on practice: Thực hành với dự án thật
- Weekly review: Đánh giá tiến độ hàng tuần

### Phase 3: Contributing (Tuần 9-12)
- Real projects: Tham gia dự án thực tế
- Independent work: Làm việc độc lập
- Collaboration: Hợp tác với teams khác
- Impact measurement: Đo lường đóng góp

## CHẾ ĐỘ HỖ TRỢ

### Hỗ trợ tài chính
- **Trợ cấp**: [Số tiền] VNĐ/tháng
- **Ăn trưa**: Miễn phí tại canteen
- **Đi lại**: Hỗ trợ 50% chi phí

### Hỗ trợ học tập
- **Thiết bị**: Laptop, màn hình, phụ kiện
- **Tài liệu**: Sách, khóa học online
- **Mentoring**: 1-1 với senior developer
- **Certificate**: Chứng nhận hoàn thành

## MENTOR VÀ HỖ TRỢ

### Mentor chính
- **Tên**: [Tên mentor]
- **Kinh nghiệm**: [Số năm] năm trong lĩnh vực
- **Trách nhiệm**: Hướng dẫn kỹ thuật, career advice
- **Meeting**: 2 lần/tuần (Thứ 2 & Thứ 5)

### Buddy system
- **Buddy**: [Tên buddy - junior member]
- **Vai trò**: Hỗ trợ hòa nhập, giải đáp thắc mắc
- **Liên lạc**: Slack, email hàng ngày

## ĐÁNH GIÁ VÀ FEEDBACK

### Tiêu chí đánh giá
1. **Technical Skills** (40%):
   - Khả năng học hỏi công nghệ mới
   - Chất lượng code/deliverables
   - Problem-solving skills

2. **Professional Skills** (35%):
   - Communication
   - Teamwork
   - Time management
   - Initiative

3. **Attitude** (25%):
   - Enthusiasm
   - Reliability  
   - Growth mindset
   - Cultural fit

### Feedback schedule
- **Week 2**: Initial feedback
- **Week 6**: Mid-term evaluation
- **Week 10**: Pre-final review
- **Week 12**: Final assessment + recommendations

## CƠ HỘI PHÁT TRIỂN

### Trong thời gian thực tập
- Tech talks: Tham dự các buổi chia sẻ
- Hackathons: Tham gia các cuộc thi
- Conferences: Tham dự sự kiện ngành
- Blog writing: Viết blog về trải nghiệm

### Sau thực tập
- Job offer: Cơ hội trở thành full-time
- Recommendation letter: Thư giới thiệu
- Network: Kết nối với alumni network
- Career guidance: Tư vấn định hướng nghề nghiệp

## QUY ĐỊNH VÀ LƯU Ý

### Thời gian làm việc
- **Giờ làm việc**: 08:30 - 17:30 (Thứ 2 - Thứ 6)
- **Nghỉ trưa**: 12:00 - 13:00
- **Flexible**: Có thể điều chỉnh theo lịch học

### Dress code & Behavior
- Trang phục: Smart casual
- Giao tiếp: Lịch sự, chuyên nghiệp
- Điện thoại: Chế độ im lặng trong meeting
- Hút thuốc: Chỉ ở khu vực quy định

### Bảo mật thông tin
- NDA: Ký cam kết bảo mật
- Data: Không copy dữ liệu công ty
- Photos: Xin phép trước khi chụp ảnh
- Social media: Không post thông tin nhạy cảm

## HOẠT ĐỘNG VUI CHƠI

### Team building
- Team lunch: Mỗi thứ 6
- Game time: 30 phút mỗi chiều
- Company events: Sinh nhật, lễ hội
- Sports: Bóng đá, cầu lông cuối tuần

### Learning events
- Book club: Đọc sách kỹ thuật
- Lightning talks: Chia sẻ kiến thức
- Demo day: Present dự án cuối khóa
- Graduation ceremony: Lễ tốt nghiệp thực tập

---

## KÝ KẾT

*Thời gian thực tập: [DD/MM/YYYY] - [DD/MM/YYYY]*  
*Địa điểm: [Địa chỉ văn phòng]*

**CÔNG TY**                    **THỰC TÂP SINH**  
[Tên người đại diện]           [Tên sinh viên]  
Chức vụ: [Chức vụ]            Trường: [Tên trường]  
*(Ký tên, đóng dấu)*           *(Ký tên)*

---
*Chào mừng bạn đến với gia đình [Tên công ty]!*  
*Liên hệ: [Email] | Hotline: [SĐT]*`,
  },
  {
    id: "consultant",
    name: "Hợp đồng tư vấn",
    description: "Template cho dịch vụ tư vấn/freelance",
    content: `# HỢP ĐỒNG DỊCH VỤ TƯ VẤN

## PHẠM VI DỊCH VỤ

### Mô tả dự án
**Tên dự án**: [Tên dự án tư vấn]  
**Mục tiêu**: [Mục tiêu chính của dự án]

### Chi tiết công việc
#### Phase 1: Phân tích hiện trạng (Tuần 1-2)
- Research: Nghiên cứu thị trường, đối thủ
- Analysis: Phân tích dữ liệu hiện tại
- Assessment: Đánh giá điểm mạnh/yếu
- Report: Báo cáo hiện trạng

#### Phase 2: Xây dựng chiến lược (Tuần 3-4)  
- Strategy: Đề xuất chiến lược
- Planning: Lập kế hoạch thực hiện
- Design: Thiết kế giải pháp
- Budget: Ước tính ngân sách

#### Phase 3: Triển khai hỗ trợ (Tuần 5-8)
- Implementation: Hỗ trợ triển khai
- Monitoring: Theo dõi tiến độ
- Adjustment: Điều chỉnh khi cần
- Reporting: Báo cáo định kỳ

#### Phase 4: Bàn giao và đào tạo (Tuần 9-10)
- Documentation: Tài liệu hướng dẫn
- Training: Đào tạo team nội bộ
- Handover: Bàn giao hoàn chỉnh
- Support: Hỗ trợ sau bàn giao

## TIMELINE VÀ MILESTONE

### Lịch trình tổng thể
| Giai đoạn | Thời gian | Deliverable | Thanh toán |
|-----------|-----------|-------------|------------|
| **Phase 1** | Tuần 1-2 | Báo cáo phân tích | 25% |
| **Phase 2** | Tuần 3-4 | Chiến lược & Kế hoạch | 25% |
| **Phase 3** | Tuần 5-8 | Hỗ trợ triển khai | 35% |
| **Phase 4** | Tuần 9-10 | Bàn giao hoàn chỉnh | 15% |

### Key milestones
- Week 2: Presentation báo cáo hiện trạng
- Week 4: Approval chiến lược
- Week 6: Mid-implementation review
- Week 10: Final delivery & sign-off

## CHI PHÍ VÀ THANH TOÁN

### Cơ cấu chi phí
- **Tổng giá trị hợp đồng**: [Số tiền] VNĐ
- **Phí tư vấn**: [Số tiền] VNĐ (85%)
- **Chi phí vật tư**: [Số tiền] VNĐ (10%)
- **Thuế VAT**: [Số tiền] VNĐ (5%)

### Phương thức thanh toán
1. **Thanh toán theo milestone** (như bảng trên)
2. **Thời hạn**: Trong vòng 15 ngày sau khi nhận invoice
3. **Hình thức**: Chuyển khoản ngân hàng
4. **Tài khoản**: [Thông tin tài khoản]

### Chi phí phát sinh
- Đi lại: Hoàn lại 100% (có hóa đơn)
- Lưu trú: Theo thực tế (tối đa 2,000,000 VNĐ/đêm)
- Ăn uống: 500,000 VNĐ/ngày
- Liên lạc: Theo hóa đơn thực tế

## DELIVERABLES

### Báo cáo và tài liệu
1. **Báo cáo phân tích hiện trạng**:
   - Executive summary (2 trang)
   - Phân tích chi tiết (15-20 trang)
   - SWOT analysis
   - Recommendations

2. **Chiến lược và kế hoạch**:
   - Strategic framework
   - Action plan chi tiết
   - Timeline và milestones
   - Budget breakdown

3. **Tài liệu hướng dẫn**:
   - User manual
   - Best practices
   - Templates và tools
   - FAQ

### Định dạng bàn giao
- Format: PDF + PowerPoint + Word
- Digital: Google Drive/Dropbox link
- Physical: 3 bộ in màu (nếu yêu cầu)
- Video: Recording các buổi training

## TRÁCH NHIỆM CÁC BÊN

### Trách nhiệm của Khách hàng
- Cung cấp data: Đầy đủ, chính xác, kịp thời
- Phối hợp: Cử người liên lạc chính
- Hỗ trợ: Văn phòng làm việc, thiết bị
- Timeline: Phản hồi trong 48h

### Trách nhiệm của Tư vấn viên
- Chất lượng: Đảm bảo chất lượng deliverables
- Tiến độ: Tuân thủ timeline đã thỏa thuận
- Bảo mật: Bảo vệ thông tin khách hàng
- Communication: Báo cáo tiến độ định kỳ

## BẢO MẬT VÀ SỞ HỮU TRÍ TUỆ

### Điều khoản bảo mật
- NDA: Có hiệu lực trong 3 năm
- Data: Không sử dụng cho mục đích khác
- Deletion: Xóa data sau 6 tháng
- Third party: Không chia sẻ cho bên thứ ba

### Quyền sở hữu
- Deliverables: Thuộc về khách hàng
- Methodology: Thuộc về tư vấn viên  
- Insights: Chia sẻ cho cả hai bên
- Templates: Có thể tái sử dụng (không tên)

## ĐIỀU KHOẢN PHÁP LÝ

### Thay đổi phạm vi
- Change request: Phải có văn bản
- Additional cost: Tính theo giờ (2,000,000 VNĐ/ngày)
- Timeline impact: Điều chỉnh deadline
- Approval: Cần chữ ký cả hai bên

### Chấm dứt hợp đồng
- Mutual agreement: Thỏa thuận chung
- Breach: Vi phạm nghiêm trọng
- Notice period: Báo trước 15 ngày
- Settlement: Thanh toán công việc đã làm

### Giải quyết tranh chấp
1. **Thương lượng trực tiếp** (30 ngày)
2. **Hòa giải** qua trung gian (30 ngày)
3. **Trọng tài** tại [Địa điểm] (quyết định cuối cùng)

## LIÊN HỆ VÀ QUẢN LÝ DỰ ÁN

### Project Manager (Khách hàng)
- **Tên**: [Tên PM]
- **Chức vụ**: [Chức vụ]
- **Email**: [Email]
- **Điện thoại**: [SĐT]

### Lead Consultant
- **Tên**: [Tên consultant]
- **Email**: [Email]
- **Điện thoại**: [SĐT]
- **Skype/Teams**: [ID]

### Communication protocol
- Email: Báo cáo hàng tuần (Thứ 6)
- Call: Weekly sync-up (Thứ 3, 2PM)
- Slack/Teams: Daily communication
- Dashboard: Real-time progress tracking

---

## XÁC NHẬN HỢP ĐỒNG

*Hợp đồng có hiệu lực từ: [DD/MM/YYYY]*  
*Địa điểm ký: [Thành phố]*

| **BÊN A - KHÁCH HÀNG** | **BÊN B - TƯ VẤN VIÊN** |
|:-----------------------:|:-----------------------:|
| [Tên người đại diện] | [Tên tư vấn viên] |
| Chức vụ: [Chức vụ] | Chuyên gia: [Lĩnh vực] |
| *(Ký tên, đóng dấu)* | *(Ký tên)* |

---
*Chúc dự án thành công!*  
*Support: [Email] | Hotline: [SĐT]*`,
  },
];
