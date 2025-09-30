# Google Analytics & Consent Management Setup

Hệ thống tracking đã được tích hợp vào website để theo dõi lượt truy cập và hành vi người dùng, đặc biệt trên các trang ứng tuyển. Đồng thời tuân thủ GDPR với Consent Manager.

## Cài đặt

### 1. Cấu hình Google Analytics ID

1. Truy cập [Google Analytics](https://analytics.google.com/)
2. Tạo tài khoản hoặc đăng nhập
3. Tạo Property mới cho website
4. Copy Measurement ID (dạng G-XXXXXXXXXX)
5. Thay thế trong file `.env.local`:

```env
NEXT_PUBLIC_GA_TRACKING_ID=G-YOUR-ACTUAL-ID
NEXT_PUBLIC_CONSENT_MANAGER_ID=8c3bf1b852f2b
```

### 2. Khởi động dự án

```bash
npm run dev
```

## Tính năng Tracking

### GDPR Compliance

- **Consent Manager**: Hiển thị popup yêu cầu đồng ý trước khi tracking
- **Privacy Settings**: Button ở góc phải dưới để quản lý consent
- **LocalStorage**: Lưu trữ lựa chọn của người dùng
- **Auto-blocking**: Chỉ track khi có consent

### Tự động tracking

- **Page views**: Tất cả các trang được tự động track (khi có consent)
- **URL cụ thể**: Đặc biệt theo dõi các URL `/apply/[jobId]`
- **Real-time**: Dữ liệu hiển thị trong Google Analytics real-time
- **Consent-aware**: Chỉ hoạt động khi user đồng ý

### Events được track

- `job_page_view`: Khi người dùng xem trang ứng tuyển
- `application_start`: Khi bắt đầu submit form ứng tuyển
- `application_success`: Khi ứng tuyển thành công
- `application_error`: Khi có lỗi trong quá trình ứng tuyển

### Dữ liệu custom

- Job ID
- Page type
- Timestamp
- User behavior metrics

## Xem thống kê

### Trong ứng dụng

Truy cập `/analytics` để xem dashboard cơ bản với:

- Tổng lượt truy cập
- Số đơn ứng tuyển
- Thống kê theo từng trang

### Trong Google Analytics

1. Vào Google Analytics → Property của bạn
2. **Real-time** → Xem ai đang online
3. **Reports** → **Engagement** → **Pages and screens**
4. Filter: `page_path contains "/apply/"` để xem riêng trang ứng tuyển
5. **Reports** → **Engagement** → **Events** để xem custom events

## Các metrics quan trọng

### Page-level metrics

- **Page views**: Số lượt xem trang
- **Unique users**: Số người dùng riêng biệt
- **Average engagement time**: Thời gian trung bình trên trang
- **Bounce rate**: Tỷ lệ người dùng rời khỏi ngay

### Conversion metrics

- **Application rate**: Tỷ lệ chuyển đổi từ xem trang → ứng tuyển
- **Success rate**: Tỷ lệ ứng tuyển thành công
- **Drop-off points**: Điểm người dùng rời bỏ form

### Traffic analysis

- **Traffic sources**: Từ đâu người dùng đến (Google, social media, direct)
- **Device breakdown**: Desktop vs Mobile vs Tablet
- **Geographic data**: Người dùng từ địa điểm nào
- **Time patterns**: Giờ cao điểm truy cập

## Custom Events

Bạn có thể thêm tracking cho các hành động khác:

```typescript
import { trackEvent } from "@/components/GoogleAnalytics";

// Track button click
trackEvent("button_click", "user_interaction", "download_cv");

// Track form field interaction
trackEvent("form_field_focus", "user_interaction", "email_field");

// Track scroll depth
trackEvent("scroll_depth", "user_engagement", "50_percent");
```

## Privacy & GDPR

- Dữ liệu được thu thập tuân thủ GDPR
- Không thu thập thông tin cá nhân nhạy cảm
- Người dùng có thể opt-out thông qua browser settings
- IP được ẩn danh hóa tự động

## Troubleshooting

### Không thấy dữ liệu

1. Kiểm tra `NEXT_PUBLIC_GA_TRACKING_ID` đã đúng chưa
2. Đợi 24-48h để dữ liệu hiển thị đầy đủ
3. Kiểm tra Real-time reports trước

### Events không được track

1. Mở Developer Tools → Console để xem lỗi
2. Kiểm tra Network tab xem có requests đến gtag không
3. Đảm bảo user không block ads/tracking

### Dữ liệu không chính xác

1. Loại bỏ internal traffic (IP công ty)
2. Thiết lập View filters trong GA
3. Kiểm tra bot filtering trong GA settings

## Tài liệu tham khảo

- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [Next.js Analytics Integration](https://nextjs.org/docs/app/building-your-application/optimizing/analytics)
- [gtag.js Reference](https://developers.google.com/analytics/devguides/collection/gtagjs)
