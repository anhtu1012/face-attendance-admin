# Báo cáo Tuyển dụng (Recruitment Report)

## Tổng quan

Trang báo cáo tuyển dụng cung cấp cái nhìn toàn diện về hoạt động tuyển dụng của công ty, bao gồm thống kê, biểu đồ, và phân tích chi tiết.

## Tính năng chính

### 1. Thống kê Tổng quan

- **Tổng số công việc**: Số lượng job đã tạo và đang hoạt động
- **Tổng ứng viên**: Số lượng ứng viên đã ứng tuyển
- **Ứng viên mới tháng này**: Theo dõi xu hướng ứng tuyển
- **Đã hoàn thành**: Số lượng tuyển dụng thành công

### 2. Trạng thái Quy trình

- Chờ liên hệ
- Chờ phỏng vấn (bao gồm đã hẹn lịch)
- Đậu phỏng vấn (với tỷ lệ đậu)
- Chờ ký hợp đồng

### 3. Hiệu suất Tuyển dụng

- **Tỷ lệ chuyển đổi**: Phần trăm ứng viên được tuyển so với tổng số ứng tuyển
- **Tỷ lệ thành công**: Hiệu quả tuyển dụng tổng thể
- **Thời gian trung bình**:
  - Từ ứng tuyển đến phỏng vấn
  - Từ ứng tuyển đến tuyển dụng
- **Số vòng phỏng vấn trung bình**

### 4. Biểu đồ Phân tích

#### Xu hướng Tuyển dụng (Bar Chart)

- Theo dõi xu hướng theo thời gian
- So sánh: Ứng viên mới, Đã phỏng vấn, Đã offer, Đã tuyển
- Hỗ trợ phân tích theo tháng/quý/năm

#### Phân bố Trạng thái (Pie Chart)

- Tỷ lệ phần trăm ứng viên ở từng trạng thái
- Trực quan hóa quy trình tuyển dụng

#### Tuyển dụng theo Phòng ban (Horizontal Bar Chart)

- So sánh hiệu quả giữa các phòng ban
- Hiển thị: Đã tuyển vs Đang chờ
- Tỷ lệ thành công của từng phòng ban

### 5. Top Ứng viên Tiềm năng

Bảng chi tiết top ứng viên với:

- Xếp hạng (🥇🥈🥉)
- Độ phù hợp (Match Score với Progress Bar)
- Thông tin liên hệ
- Vị trí ứng tuyển
- Kỹ năng
- Trạng thái hiện tại

### 6. Bộ lọc Nâng cao

- **Khoảng thời gian**: Hôm nay, Tuần này, Tháng này, Quý, Năm, Tùy chỉnh
- **Phòng ban**: Lọc theo phòng ban cụ thể
- **Vị trí tuyển dụng**: Lọc theo role/vị trí
- **Trạng thái**: Chọn nhiều trạng thái để phân tích
- **Xuất Excel**: Export báo cáo ra file Excel

## Cấu trúc Files

```
bao-cao-tuyen-dung/
├── page.tsx                              # Main page component
├── page.scss                             # Page styles
├── _components/
│   ├── StatisticCard/                    # Card thống kê với trend
│   │   ├── StatisticCard.tsx
│   │   ├── StatisticCard.scss
│   │   └── index.ts
│   ├── RecruitmentTrendChart/           # Biểu đồ xu hướng
│   │   ├── RecruitmentTrendChart.tsx
│   │   ├── RecruitmentTrendChart.scss
│   │   └── index.ts
│   ├── CandidateStatusChart/            # Biểu đồ phân bố trạng thái
│   │   ├── CandidateStatusChart.tsx
│   │   ├── CandidateStatusChart.scss
│   │   └── index.ts
│   ├── DepartmentRecruitmentChart/      # Biểu đồ theo phòng ban
│   │   ├── DepartmentRecruitmentChart.tsx
│   │   ├── DepartmentRecruitmentChart.scss
│   │   └── index.ts
│   ├── TopCandidatesTable/              # Bảng top ứng viên
│   │   ├── TopCandidatesTable.tsx
│   │   ├── TopCandidatesTable.scss
│   │   └── index.ts
│   └── FilterPanel/                     # Panel lọc dữ liệu
│       ├── FilterPanel.tsx
│       ├── FilterPanel.scss
│       └── index.ts
```

## DTOs và Services

### DTOs (Data Transfer Objects)

Location: `src/dtos/bao-cao/bao-cao-tuyen-dung/bao-cao-tuyen-dung.dto.ts`

- `RecruitmentStatistics`: Thống kê tổng quan
- `JobPositionStatistics`: Thống kê theo vị trí
- `DepartmentRecruitmentStatistics`: Thống kê theo phòng ban
- `CandidateSourceStatistics`: Thống kê nguồn ứng viên
- `RecruitmentTrendData`: Dữ liệu xu hướng
- `TopCandidateData`: Dữ liệu top ứng viên
- `SkillDemandStatistics`: Thống kê kỹ năng
- `RecruiterPerformance`: Hiệu suất recruiter
- `RecruitmentReportResponse`: Response tổng hợp
- `RecruitmentReportFilterRequest`: Request filter

### Services

Location: `src/services/bao-cao/bao-cao-tuyen-dung.service.ts`

Các API methods:

- `getRecruitmentReport()`: Lấy báo cáo tổng quan
- `getMonthlyStatistics()`: Thống kê theo tháng
- `getRecruitmentTrends()`: Xu hướng tuyển dụng
- `getJobPositionStatistics()`: Thống kê theo vị trí
- `getDepartmentStatistics()`: Thống kê theo phòng ban
- `getCandidateSourceStatistics()`: Nguồn ứng viên
- `getTopCandidates()`: Top ứng viên
- `getSkillDemandStatistics()`: Thống kê kỹ năng
- `getRecruiterPerformance()`: Hiệu suất recruiter
- `exportRecruitmentReport()`: Export Excel
- `getComparisonReport()`: So sánh giữa các kỳ

## Cách sử dụng

### 1. Truy cập trang

Navigate đến: `/bao-cao/bao-cao-tuyen-dung`

### 2. Lọc dữ liệu

- Chọn khoảng thời gian mong muốn
- Chọn phòng ban/vị trí (nếu cần)
- Chọn trạng thái cụ thể
- Click "Lọc dữ liệu"

### 3. Phân tích

- Xem các thẻ thống kê với trend so với kỳ trước
- Phân tích biểu đồ xu hướng
- So sánh hiệu quả giữa các phòng ban
- Review top ứng viên tiềm năng

### 4. Xuất báo cáo

- Click nút "Xuất Excel"
- File báo cáo sẽ được tải về

## Tích hợp API Backend

Hiện tại trang đang sử dụng **mock data** để demo. Để tích hợp với backend thực:

1. **Uncomment các API calls** trong `page.tsx`:

```typescript
// Ở hàm fetchReportData()
const response = await BaoCaoTuyenDungServices.getRecruitmentReport(filter);
setStatistics(response.statistics);
setTrendData(response.trends);
// ... etc
```

2. **Backend cần implement các endpoints**:

```
POST /v1/recruitment/reports/overview
GET  /v1/recruitment/reports/monthly
GET  /v1/recruitment/reports/trends
GET  /v1/recruitment/reports/job-positions
GET  /v1/recruitment/reports/departments
GET  /v1/recruitment/reports/candidate-sources
GET  /v1/recruitment/reports/top-candidates
GET  /v1/recruitment/reports/skill-demand
GET  /v1/recruitment/reports/recruiter-performance
POST /v1/recruitment/reports/export
GET  /v1/recruitment/reports/comparison
```

3. **Response format** phải theo DTOs đã định nghĩa

## Các chỉ số quan trọng cần thêm

### 1. Cost per Hire (Chi phí tuyển dụng)

- Tổng chi phí / Số người tuyển được
- So sánh giữa các phòng ban

### 2. Quality of Hire (Chất lượng tuyển dụng)

- Đánh giá performance của nhân viên mới
- Tỷ lệ retention sau 6 tháng/1 năm

### 3. Source Effectiveness (Hiệu quả nguồn tuyển dụng)

- LinkedIn, Facebook, Website, Referral
- ROI của từng kênh tuyển dụng

### 4. Recruiter Productivity (Năng suất recruiter)

- Số lượng job/ứng viên được xử lý
- Thời gian xử lý trung bình
- Tỷ lệ thành công

### 5. Offer Acceptance Rate (Tỷ lệ chấp nhận offer)

- Phân tích lý do từ chối
- So sánh theo vị trí/level

### 6. Candidate Experience Score (Điểm trải nghiệm ứng viên)

- Feedback từ ứng viên
- NPS score

## Công nghệ sử dụng

- **React** với TypeScript
- **Ant Design** cho UI components
- **Recharts** cho biểu đồ
- **Day.js** cho xử lý ngày tháng
- **SCSS** cho styling

## Tối ưu hóa

### Performance

- Lazy loading cho biểu đồ nặng
- Memoization cho các tính toán phức tạp
- Pagination cho bảng dữ liệu lớn

### UX

- Loading states rõ ràng
- Error handling
- Responsive design
- Export progress indicator

## Roadmap phát triển

### Phase 1 (Hiện tại)

- ✅ Thống kê cơ bản
- ✅ Biểu đồ trực quan
- ✅ Top ứng viên
- ✅ Bộ lọc

### Phase 2 (Tiếp theo)

- ⏳ Tích hợp API thực
- ⏳ Export PDF
- ⏳ Email báo cáo tự động
- ⏳ Lưu filter preset

### Phase 3 (Tương lai)

- 📋 Real-time updates
- 📋 AI insights và recommendations
- 📋 Predictive analytics
- 📋 Mobile app

## Hỗ trợ

Nếu có câu hỏi hoặc gặp vấn đề, vui lòng liên hệ team HR Tech.
