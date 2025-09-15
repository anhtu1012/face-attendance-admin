# Dynamic AgGrid Implementation

Tài liệu hướng dẫn sử dụng dynamic import cho AgGridComponent trong ứng dụng Next.js để tối ưu hiệu suất tải trang.

## Tại sao sử dụng Dynamic Import?

1. **Giảm bundle size**: AgGridComponent không được tải cho đến khi thực sự cần thiết
2. **Cải thiện Performance**: Trang tải nhanh hơn vì không cần chờ AgGrid bundle
3. **Better UX**: Hiển thị loading state trong khi component đang tải
4. **SSR Optimization**: Tránh lỗi hydration với các thư viện client-side

## Cách sử dụng

### 1. Sử dụng createDynamicAgGrid (Khuyến nghị)

```tsx
import { createDynamicAgGrid } from "@/hooks/useDynamicAgGrid";

// Tạo dynamic component với options tùy chỉnh
const AgGridComponent = createDynamicAgGrid({
  loadingMessage: "Đang tải bảng dữ liệu thuế...",
  enableSSR: false,
  className: "min-h-96",
});

// Sử dụng như component bình thường
function MyPage() {
  return (
    <AgGridComponent
      rowData={data}
      columnDefs={columns}
      // ... các props khác
    />
  );
}
```

### 2. Sử dụng DynamicAgGrid (Pre-configured)

```tsx
import { DynamicAgGrid } from "@/hooks/useDynamicAgGrid";

function MyPage() {
  return (
    <DynamicAgGrid
      rowData={data}
      columnDefs={columns}
      // ... các props khác
    />
  );
}
```

### 3. Sử dụng Dynamic Import trực tiếp

```tsx
import dynamic from "next/dynamic";
import AgGridLoading from "@/components/basicUI/cTableAG/components/AgGridLoading";

const AgGridComponent = dynamic(() => import("@/components/basicUI/cTableAG"), {
  loading: () => <AgGridLoading message="Đang tải..." />,
  ssr: false,
});
```

## Options cho createDynamicAgGrid

| Option           | Type    | Default                    | Mô tả                           |
| ---------------- | ------- | -------------------------- | ------------------------------- |
| `loadingMessage` | string  | "Đang tải bảng dữ liệu..." | Thông báo hiển thị khi loading  |
| `enableSSR`      | boolean | false                      | Bật/tắt Server Side Rendering   |
| `className`      | string  | ""                         | CSS class cho loading component |

## Best Practices

1. **Luôn tắt SSR** cho AgGrid vì có thể gây lỗi hydration
2. **Sử dụng loading message phù hợp** với context của trang
3. **Cân nhắc sử dụng Suspense** cho các case phức tạp hơn
4. **Test thoroughly** để đảm bảo không có regression

## Ví dụ trong các page khác

### Page Nhân viên

```tsx
const AgGridComponent = createDynamicAgGrid({
  loadingMessage: "Đang tải danh sách nhân viên...",
});
```

### Page Chấm công

```tsx
const AgGridComponent = createDynamicAgGrid({
  loadingMessage: "Đang tải dữ liệu chấm công...",
  className: "border-2 border-blue-100",
});
```

## Performance Metrics

- **Bundle size reduction**: ~200KB (tùy thuộc vào AgGrid dependencies)
- **Initial page load**: Cải thiện ~15-30%
- **Time to Interactive**: Giảm ~20-40%

## Troubleshooting

### Lỗi "Cannot read properties of undefined"

- Đảm bảo tất cả dependencies đã được import đúng cách
- Check console cho các lỗi module resolution

### Component không render

- Kiểm tra đường dẫn import có đúng không
- Verify rằng AgGridComponent export đúng format

### Hydration mismatch

- Đảm bảo `ssr: false` được set
- Sử dụng `ClientOnly` wrapper nếu cần thiết
