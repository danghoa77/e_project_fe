# E-Commerce UI 🛍️

Đây là dự án frontend cho một nền tảng thương mại điện tử hiện đại, được xây dựng bằng React và TypeScript. Dự án bao gồm một giao diện cho khách hàng (storefront) và một trang quản trị (admin dashboard) để quản lý cửa hàng.

## ✨ Tính năng nổi bật

### 👨‍💻 Dành cho Khách hàng

- **Khám phá sản phẩm:** Duyệt, tìm kiếm, và lọc sản phẩm một cách dễ dàng.
- **Giỏ hàng:** Thêm và quản lý các sản phẩm trong giỏ hàng.
- **Thanh toán:** Quy trình thanh toán đơn giản và an toàn.
- **Quản lý tài khoản:** Cập nhật thông tin cá nhân, xem lại lịch sử đơn hàng.
- **Xác thực:** Đăng ký, đăng nhập tài khoản.
- **Trò chuyện trực tuyến:** Hỗ trợ, tư vấn trực tiếp với quản trị viên.

### ⚙️ Dành cho Quản trị viên (Admin)

- **Bảng điều khiển:** Giao diện tổng quan về doanh thu, đơn hàng và người dùng.
- **Quản lý sản phẩm:** Thêm, sửa, xóa sản phẩm và danh mục.
- **Quản lý đơn hàng:** Xem và cập nhật trạng thái các đơn hàng.
- **Quản lý người dùng:** Quản lý tài khoản khách hàng.
- **Quản lý thanh toán:** Theo dõi các giao dịch thanh toán.
- **Chat với khách hàng:** Trả lời các thắc mắc của khách hàng qua chat.

## 🚀 Công nghệ sử dụng

- **Framework:** [React](https://react.dev/)
- **Ngôn ngữ:** [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Routing:** [React Router DOM](https://reactrouter.com/)
- **Data Fetching & State:** [TanStack Query](https://tanstack.com/query/latest)
- **State Management (Client):** [Zustand](https://zustand-demo.pmnd.rs/)
- **Form:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Biểu đồ:** [Recharts](https://recharts.org/) (cho trang admin)
- **Chat API:** [TalkJS](https://talkjs.com/)

## 🏁 Bắt đầu

Làm theo các bước sau để chạy dự án trên máy của bạn.

### Yêu cầu

- [Node.js](https://nodejs.org/) (phiên bản 18.x trở lên)
- [npm](https://www.npmjs.com/)

### Cài đặt

1.  **Clone repository:**

    ```bash
    git clone <your-repository-url>
    cd e_project_fe
    ```

2.  **Cài đặt dependencies:**

    ```bash
    npm install
    ```

3.  **Thiết lập biến môi trường:**
    Tạo file `.env` ở thư mục gốc bằng cách sao chép file `.env.example`:

    ```bash
    copy .env.example .env
    ```

    Sau đó, cập nhật các giá trị trong file `.env` cho phù hợp với môi trường của bạn.

    ```dotenv
    # URL của API backend
    VITE_API_URL=http://localhost:8080/api

    # App ID của bạn từ TalkJS
    VITE_TALKJS_APP_ID=YOUR_TALKJS_APP_ID
    ```

### Chạy ứng dụng

Để khởi động server development, chạy lệnh:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại địa chỉ `http://localhost:5173`.

## 🛠️ Các tập lệnh (Scripts)

- `npm run dev`: Chạy ứng dụng ở chế độ development.
- `npm run build`: Build ứng dụng cho môi trường production.
- `npm run lint`: Kiểm tra lỗi code bằng ESLint.
- `npm run preview`: Chạy bản build production ở local.

## CI/CD

Dự án sử dụng GitHub Actions để tích hợp liên tục (CI). Workflow được định nghĩa tại `.github/workflows/ci.yml` và sẽ tự động chạy khi có push hoặc pull request vào nhánh `main`.
