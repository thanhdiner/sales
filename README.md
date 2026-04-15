# SmartMall Frontend

Frontend cho hệ thống thương mại điện tử `SmartMall`, gồm giao diện khách hàng và khu vực quản trị. Dự án dùng `React 18`, `CRACO`, `Redux Toolkit`, `React Router 6`, `Ant Design`, `Tailwind CSS`, `Sass` và `Socket.IO`.

## Flash Sale Highlight

> EXCLUSIVE EVENT  
> FLASH SALE  
> Deal giới hạn mỗi ngày

Giảm giá sốc, số lượng có hạn. Người dùng có thể săn deal nhanh theo khung giờ, xem lịch hẹn, theo dõi số lượng đã bán và mua ngay trực tiếp từ trang flash sale.

- CTA chính: `Săn Deal Ngay`
- CTA phụ: `Xem Lịch Hẹn`
- Badge niềm tin: `License Verified`
- Giá trị cốt lõi: sản phẩm chính hãng, giao key nhanh, hỗ trợ tận tâm

## Nội dung Flash Sale mẫu

### Tổng quan sự kiện

- Đang diễn ra: `1`
- Sắp bắt đầu: `0`
- Mức giảm cao nhất: `-70%`
- Bộ lọc danh mục: `Tất cả`, `Điện tử`, `Thời trang`, `Gia dụng`

### Sự kiện hiện tại

`Flash Sale mùa hè 2026`  
Thời gian: `28/03/2026 00:00 - 30/04/2026 00:00`

- Trạng thái: `ĐANG DIỄN RA`
- Mức giảm nổi bật: `-50%`
- Tiến độ: `Đã bán 0/222`
- Nhãn hiển thị: `Flash Sale Đang Diễn Ra`

### Sản phẩm nổi bật

- `AVG Ultimate 12 tháng 10 thiết bị`: `500.000 ₫` từ `1.000.000 ₫`, tiết kiệm `500.000 ₫`
- `Avast Ultimate 24 tháng 10 thiết bị`: `1.000.000 ₫` từ `2.000.000 ₫`, tiết kiệm `1.000.000 ₫`
- `Gologin Enterprise 37 ngày bảo hành full`: `250.000 ₫` từ `500.000 ₫`, tiết kiệm `250.000 ₫`, nhãn `Bán chạy`
- `Tinder Platinum 6 tháng`: `600.000 ₫` từ `1.200.000 ₫`, tiết kiệm `600.000 ₫`
- `NotebookLM Plus 12 tháng (Acc cấp không bảo hành)`: `250.000 ₫` từ `500.000 ₫`, tiết kiệm `250.000 ₫`
- `Tinder Gold 6 tháng`: `500.000 ₫` từ `1.000.000 ₫`, tiết kiệm `500.000 ₫`
- `Avast Ultimate 12 tháng 10 thiết bị`: `500.000 ₫` từ `1.000.000 ₫`, tiết kiệm `500.000 ₫`

## Cam kết thương hiệu

- Cam kết bảo mật và bản quyền `100%`
- Sản phẩm chính hãng, đầy đủ giấy phép sử dụng
- Giao hàng tự động, nhận key nhanh sau thanh toán
- Hỗ trợ kỹ thuật tận tâm khi có vấn đề phát sinh

### Social proof

- `10k+` khách hàng
- `99%` hài lòng
- `24/7` hỗ trợ
- `0%` rủi ro

## Thông tin hỗ trợ

- Hotline: `+84 823 387 108`
- Khung giờ hỗ trợ: `8h - 22h hàng ngày`
- Email: `smartmall.business.official@gmail.com`

### Trang thông tin liên quan

- Hướng dẫn mua hàng
- Chính sách bảo mật
- Chính sách đổi trả và hoàn tiền
- Câu hỏi thường gặp
- Giới thiệu chúng tôi
- Điều khoản sử dụng
- Liên hệ hợp tác

### Danh mục dịch vụ

- Tài khoản game
- Nâng cấp bản quyền
- Thẻ cào và voucher
- Gói dịch vụ đặc biệt

### Phương thức thanh toán

- `Visa`
- `Mastercard`n
- `JCB`
- `Momo`
- `ZaloPay`
- `ViettelMoney`
- `VNPAY`
- `Pay-In-Cash`

### Kênh kết nối

- `Facebook`
- `Youtube`
- `Zalo`

## Chức năng chính

- Giao diện client: trang chủ, danh sách sản phẩm, chi tiết sản phẩm, danh mục, flash sale, wishlist, compare, giỏ hàng, checkout, lịch sử đơn hàng.
- Xác thực người dùng: đăng ký, đăng nhập, quên mật khẩu, OAuth callback.
- Giao diện admin: dashboard, sản phẩm, danh mục, đơn hàng, tài khoản admin, vai trò, quyền, nhóm quyền, mã giảm giá, banner, widget, flash sale, đánh giá, cấu hình website, thông tin ngân hàng.
- Realtime: chat hỗ trợ và kết nối Socket.IO cho khu vực quản trị.
- SEO cơ bản với `react-helmet-async`.

## Công nghệ sử dụng

- `React 18`
- `Create React App` + `CRACO`
- `Redux Toolkit` + `React Redux`
- `React Router DOM`
- `Ant Design`
- `Tailwind CSS`
- `Sass`
- `Socket.IO Client`

## Cấu trúc thư mục

```text
sales/
|- public/               # static assets, favicon, images, icons
|- src/
|  |- components/        # UI components dùng lại
|  |- pages/             # màn hình client và admin
|  |- services/          # gọi API
|  |- stores/            # Redux slices/store
|  |- utils/             # helpers, auth, request wrappers
|  |- Layout/            # layout client và admin
|  |- routes/            # cấu hình route
|  |- hooks/             # custom hooks
|  |- helpers/           # formatter/helpers riêng
|- craco.config.js       # alias @ -> src
|- tailwind.config.js
|- package.json
```

## Yêu cầu môi trường

- `Node.js` 18 trở lên
- `npm`
- Backend `sale-api` đang chạy

## Biến môi trường

Tạo file `.env` trong thư mục `sales`:

```env
REACT_APP_API_URL=http://localhost:3001/api/v1
REACT_APP_SOCKET_URL=http://localhost:3001
REACT_APP_CLIENT_URL=http://localhost:3000
```

Lưu ý:

- `REACT_APP_API_URL` phải bao gồm hậu tố `/api/v1`.
- Nên khai báo đủ 3 biến, vì một số luồng OAuth đọc trực tiếp `process.env.REACT_APP_API_URL`.
- Backend đang dùng `credentials: 'include'`, nên `CLIENT_URL` phía API phải khớp với domain frontend.

## Cài đặt và chạy local

### 1. Cài frontend

```bash
cd sales
npm install
```

### 2. Chạy backend

Frontend mặc định gọi API tại `http://localhost:3001/api/v1`, nên cần chạy `sale-api` trước.

Ví dụ backend tối thiểu:

```env
PORT=3001
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:3001
MONGO_URL=mongodb://localhost:27017/smartmall
REDIS_URL=redis://localhost:6379
ACCESS_SECRET=your_access_secret
REFRESH_SECRET=your_refresh_secret
```

Nếu chạy backend bằng Docker:

```bash
cd ../sale-api
docker compose up --build
```

Lưu ý `docker-compose.yml` hiện có API và Redis, nhưng bạn vẫn cần cung cấp `MONGO_URL` hợp lệ trong file `.env` của `sale-api`.

### 3. Chạy frontend

```bash
cd sales
npm start
```

Ứng dụng mặc định chạy tại `http://localhost:3000`.

## Scripts

- `npm start`: chạy môi trường development.
- `npm run build`: build production vào thư mục `build/`.
- `npm test`: chạy test bằng `craco test`.

## Tích hợp với backend

- Base API frontend: `REACT_APP_API_URL`
- Base socket frontend: `REACT_APP_SOCKET_URL`
- Swagger backend: `http://localhost:3001/api-docs` hoặc `http://localhost:3001/docs`
- Health check backend: `http://localhost:3001/health`

## Các route đáng chú ý

- Client: `/`, `/products`, `/products/:slug`, `/flash-sale`, `/cart`, `/checkout`, `/orders`, `/wishlist`, `/compare`
- Auth: `/user/login`, `/user/register`, `/user/forgot-password`, `/user/oauth-callback`
- Admin: `/admin/dashboard`, `/admin/products`, `/admin/product-categories`, `/admin/orders`, `/admin/accounts`, `/admin/roles`, `/admin/permissions`, `/admin/promo-codes`, `/admin/banners`, `/admin/widgets`, `/admin/flash-sales`, `/admin/chat`

## Ghi chú phát triển

- Alias import `@` được map tới thư mục `src`.
- Frontend đang kết hợp `Tailwind CSS`, `Sass` và `Ant Design`, nên khi thêm UI mới nên giữ đúng pattern đang có của từng khu vực.
- Khu vực admin có cơ chế phân quyền theo permission, route protection và refresh token riêng.
