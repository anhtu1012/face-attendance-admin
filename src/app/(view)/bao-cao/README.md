# 📊 Hệ Thống Dashboard Báo Cáo

## 🎯 Tổng Quan

Hệ thống Dashboard báo cáo bao gồm các màn hình thống kê trực quan cho việc quản lý chấm công và lương của công ty.

## 📁 Cấu Trúc Thư Mục

```
bao-cao/
├── dashboard/                    # Dashboard chấm công
│   ├── _components/
│   │   ├── StatCard/            # Thẻ thống kê
│   │   ├── DepartmentChart/     # Biểu đồ theo phòng ban
│   │   ├── TrendChart/          # Biểu đồ xu hướng
│   │   ├── ViolationChart/      # Biểu đồ vi phạm
│   │   ├── OvertimeChart/       # Biểu đồ tăng ca
│   │   └── Filter/              # Bộ lọc
│   ├── _types/                  # TypeScript types
│   ├── _utils/                  # Utilities & mock data
│   └── page.tsx                 # Trang chính
│
├── dashboard-luong/             # Dashboard lương
│   ├── _components/
│   │   ├── SalaryChart/         # Biểu đồ lương
│   │   ├── SalaryTrendChart/    # Xu hướng lương
│   │   ├── SalaryBreakdownChart/ # Cơ cấu lương
│   │   └── Filter/              # Bộ lọc
│   ├── _types/                  # TypeScript types
│   ├── _utils/                  # Utilities & mock data
│   └── page.tsx                 # Trang chính
│
├── bao-cao-cham-cong/          # Báo cáo chi tiết chấm công
└── bao-cao-luong/              # Báo cáo chi tiết lương
```

## 🎨 Dashboard Chấm Công

### Đường dẫn
`/bao-cao/dashboard`

### Tính năng chính

#### 1. **Thẻ Thống Kê Tổng Quan** (8 thẻ)
- 📊 Tổng số nhân viên
- ✅ Nhân viên có mặt
- ❌ Nhân viên vắng mặt
- ⏰ Nhân viên đi muộn
- 📈 Tỷ lệ chấm công
- ⚠️ Tỷ lệ đi muộn
- ⏱️ Giờ làm trung bình
- 🕐 Tổng giờ tăng ca

#### 2. **Biểu Đồ Chấm Công Theo Phòng Ban**
- Hiển thị số lượng nhân viên có mặt, vắng mặt, đi muộn theo từng phòng ban
- Sử dụng biểu đồ cột (Bar Chart)
- Màu sắc: Xanh lá (Có mặt), Đỏ (Vắng mặt), Vàng (Đi muộn)

#### 3. **Xu Hướng Chấm Công Theo Thời Gian**
- Biểu đồ đường (Line Chart) thể hiện xu hướng theo ngày
- Theo dõi số lượng nhân viên có mặt, vắng mặt, đi muộn qua thời gian
- Hỗ trợ fill gradient để dễ nhìn

#### 4. **Thống Kê Vi Phạm**
- Biểu đồ tròn (Doughnut Chart) hiển thị tỷ lệ các loại vi phạm
- Bao gồm: Đi muộn, Về sớm, Quên chấm công, Vắng mặt
- Hiển thị chi tiết số lần vi phạm từng loại

#### 5. **Thống Kê Giờ Làm Việc và Tăng Ca**
- Biểu đồ cột kép với 2 trục Y
- So sánh giờ làm trung bình và tổng giờ tăng ca theo phòng ban

### Công nghệ sử dụng
- **Chart.js** với **react-chartjs-2** cho các biểu đồ
- **Ant Design** cho UI components
- **SCSS** cho styling
- **TypeScript** cho type safety

## 💰 Dashboard Lương

### Đường dẫn
`/bao-cao/dashboard-luong`

### Tính năng chính

#### 1. **Thẻ Thống Kê Lương** (8 thẻ)
- 💵 Tổng quỹ lương
- 💼 Lương thực nhận
- 🎁 Tổng thưởng
- 📉 Tổng khấu trừ
- 📊 Lương trung bình
- 👥 Tổng số nhân viên
- ⏰ Lương tăng ca
- ✅ Đã thanh toán

#### 2. **Thống Kê Lương Theo Phòng Ban**
- Biểu đồ cột (Bar Chart) so sánh lương cơ bản, thưởng, tăng ca, khấu trừ
- Hiển thị đơn vị triệu VNĐ
- Tooltip chi tiết với format tiền tệ

#### 3. **Cơ Cấu Lương và Chi Phí**
- Biểu đồ tròn (Doughnut Chart) hiển thị phân bổ chi phí
- Bao gồm: Lương cơ bản, Thưởng, Tăng ca, BHXH, Thuế, Khấu trừ
- Hiển thị chi tiết từng khoản với format tiền tệ

#### 4. **Xu Hướng Lương Theo Thời Gian**
- Biểu đồ đường (Line Chart) theo dõi xu hướng 11 tháng
- So sánh Tổng lương, Thưởng, Lương thực nhận
- Gradient fill để tăng tính thẩm mỹ

### Helper Functions
```typescript
// Format tiền tệ rút gọn
formatCurrency(2850000000) // "2.85 tỷ"
formatCurrency(185000000)  // "185 triệu"

// Format tiền tệ đầy đủ
formatFullCurrency(18269231) // "18.269.231 ₫"
```

## 🎯 Bộ Lọc (Filter)

### Dashboard Chấm Công
- **Khoảng thời gian**: DateRangePicker (Từ ngày - Đến ngày)
- **Phòng ban**: Select dropdown
- **Nút action**: "Xem thống kê" (màu xanh dương)

### Dashboard Lương
- **Khoảng thời gian**: DateRangePicker (Từ ngày - Đến ngày)
- **Phòng ban**: Select dropdown
- **Nút action**: "Xem thống kê" (màu xanh lá)

## 🎨 Design System

### Màu sắc chính
- **Primary Blue**: `#1890ff` - Thông tin chung
- **Success Green**: `#52c41a` - Tích cực, có mặt
- **Warning Orange**: `#faad14` - Cảnh báo, đi muộn
- **Danger Red**: `#ff4d4f` - Tiêu cực, vắng mặt
- **Purple**: `#722ed1` - Thống kê đặc biệt
- **Cyan**: `#13c2c2` - Thông tin bổ sung
- **Magenta**: `#eb2f96` - Highlight

### Typography
- **Font Family**: 'Inter', sans-serif
- **Card Title**: 16px, font-weight: 600
- **Stat Value**: 24px, font-weight: 600
- **Chart Labels**: 12-13px

### Spacing
- **Card Border Radius**: 12px
- **Card Padding**: 20-24px
- **Grid Gutter**: 16px
- **Card Shadow**: `0 2px 8px rgba(0, 0, 0, 0.06)`
- **Hover Shadow**: `0 4px 16px rgba(0, 0, 0, 0.12)`

### Animations
- **Fade In Up**: 0.5s ease-out
- **Hover Transform**: translateY(-4px)
- **Staggered Animation**: Delay 0.1s giữa các cards

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px
  - Cards stack vertically
  - Charts height reduced to 300px
  - Filter fields stack vertically

- **Tablet**: 768px - 1024px
  - Grid layout adjusts to 2 columns
  - Charts maintain aspect ratio

- **Desktop**: > 1024px
  - Full grid layout (4 columns for stats)
  - Charts side by side

## 🔄 Data Flow

### Mock Data
Hiện tại sử dụng mock data từ `_utils/mockData.ts`

### Production Ready
Để sử dụng với API thật:
1. Thay thế mock data bằng API calls
2. Thêm loading states
3. Thêm error handling
4. Implement data refresh

```typescript
// Ví dụ integration với API
const handleFilterSubmit = async () => {
  setLoading(true);
  try {
    const filterValues = filterRef.current?.getFormValues();
    const response = await api.getDashboardData(filterValues);
    setData(response.data);
  } catch (error) {
    message.error('Không thể tải dữ liệu');
  } finally {
    setLoading(false);
  }
};
```

## 🚀 Cách Sử Dụng

### 1. Navigate to Dashboard
```typescript
// Trong menu hoặc navigation
<Link href="/bao-cao/dashboard">Dashboard Chấm Công</Link>
<Link href="/bao-cao/dashboard-luong">Dashboard Lương</Link>
```

### 2. Sử dụng Components Riêng Lẻ
```typescript
import StatCard from '@/app/(view)/bao-cao/dashboard/_components/StatCard';
import DepartmentChart from '@/app/(view)/bao-cao/dashboard/_components/DepartmentChart';

<StatCard
  title="Tổng nhân viên"
  value={156}
  icon={<TeamOutlined />}
  color="#1890ff"
  trend={{ value: 5.2, isPositive: true }}
/>

<DepartmentChart data={departmentStats} />
```

## 🛠️ Development

### Install Dependencies
```bash
npm install chart.js react-chartjs-2
```

### Run Development Server
```bash
npm run dev
```

### Build for Production
```bash
npm run build
```

## 📝 TODO / Enhancements

- [ ] Thêm export PDF/Excel
- [ ] Thêm print layout
- [ ] Real-time data với WebSocket
- [ ] Advanced filtering (multiple departments, date presets)
- [ ] Comparison với tháng trước
- [ ] Drill-down chi tiết từng phòng ban
- [ ] Custom date range presets
- [ ] Theme customization
- [ ] Multi-language support

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng liên hệ team phát triển.

---

**Version**: 1.0.0  
**Last Updated**: 2024-11  
**Developed by**: Face Attendance Admin Team

