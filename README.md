# 🛒 TechShop — Hệ thống bán lẻ thiết bị công nghệ trực tuyến

TechShop là website thương mại điện tử chuyên bán các thiết bị công nghệ như laptop, điện thoại, máy tính bảng. Hệ thống cung cấp giao diện mua sắm trực quan cho khách hàng và bảng quản trị đầy đủ cho Admin, được xây dựng theo kiến trúc REST API với ReactJS và Spring Boot.

---

## 📋 Mô tả ứng dụng

**TechShop** là nền tảng mua sắm thiết bị công nghệ trực tuyến theo mô hình B2C, cho phép khách hàng dễ dàng tìm kiếm, xem thông tin chi tiết và đặt mua sản phẩm. Hệ thống tích hợp đánh giá sản phẩm thực tế, giỏ hàng lưu trữ cục bộ và quy trình đặt hàng COD đơn giản. Phía Admin có đầy đủ công cụ quản lý sản phẩm, danh mục, đơn hàng và người dùng.

---

## 🎬 Video Demo

> Xem video demo đầy đủ các tính năng của TechShop tại link bên dưới:

[![Watch Demo](https://img.shields.io/badge/▶%20Xem%20Video%20Demo-FF0000?style=for-the-badge&logo=googledrive&logoColor=white)](https://drive.google.com)

---

## 🖼️ Giao diện hệ thống

### 1. Trang chủ
> Hero banner với slider sản phẩm tự động, khu vực danh mục và sản phẩm nổi bật kèm rating thật từ cơ sở dữ liệu.

![Trang chủ](images/home.png)

---

### 2. Đăng ký & Đăng nhập
> Giao diện 2 cột, cột trái giới thiệu thương hiệu, cột phải là form xác thực với validation inline và thanh độ mạnh mật khẩu.

| Đăng nhập | Đăng ký |
|---|---|
| ![Đăng nhập](images/login.png) | ![Đăng ký](images/register.png) |

---

### 3. Danh sách sản phẩm
> Sidebar lọc theo danh mục và sắp xếp, grid sản phẩm với card hiển thị hình ảnh, tên, rating thật và giá.

![Danh sách sản phẩm](images/product_list.png)

---

### 4. Chi tiết sản phẩm
> Gallery nhiều ảnh, thông số kỹ thuật dạng bảng, nút thêm giỏ hàng, sản phẩm liên quan và khu vực đánh giá thật.

![Chi tiết sản phẩm](images/product_detail.png)

---

### 5. Giỏ hàng & Đặt hàng
> Quản lý giỏ hàng với tăng giảm số lượng, tóm tắt đơn hàng và form nhập thông tin giao hàng 3 bước.

| Giỏ hàng | Đặt hàng |
|---|---|
| ![Giỏ hàng](images/cart.png) | ![Đặt hàng](images/checkout.png) |

---

### 6. Đơn hàng của tôi
> Lịch sử đơn hàng với lọc theo trạng thái, hiển thị sản phẩm kèm hình ảnh và nút hủy đơn khi chờ xác nhận.

![Đơn hàng](images/orders.png)

---

### 7. Thông tin cá nhân
> 3 tab: Thông tin cá nhân, Đổi mật khẩu và Đơn hàng gần đây.

![Profile](images/profile.png)

---

### 8. Admin Dashboard
> Thống kê tổng quan với 4 thẻ số liệu và sidebar điều hướng.

![Dashboard](images/dashboard.png)

---

### 9. Quản lý sản phẩm
> Grid sản phẩm với tìm kiếm, lọc danh mục, thêm/sửa/xóa và upload nhiều ảnh kèm thông số kỹ thuật động.

![Quản lý sản phẩm](images/admin_products.png)

---

### 10. Quản lý đơn hàng
> Bảng đơn hàng với 5 thẻ thống kê trạng thái, cập nhật trạng thái trực tiếp qua dropdown.

![Quản lý đơn hàng](images/admin_orders.png)

---

## 🏗️ Kiến trúc hệ thống

Dự án được thiết kế theo kiến trúc **Client-Server** với **REST API**, tách biệt hoàn toàn Frontend và Backend.

```
+-------------------------------------------------------+
|               Trình duyệt / Người dùng                |
+---------------------------+---------------------------+
                            |
              HTTP Request  |  HTTP Response
              (JSON, FormData)  |  (JSON)
                            v
+-------------------------------------------------------+
|          FRONTEND (REACT + VITE — PORT 5173)          |
|  - ReactJS + React Router (Điều hướng SPA)            |
|  - Tailwind CSS (Giao diện)                           |
|  - Zustand (Quản lý state: Auth, Cart)                |
|  - Axios + Interceptor (Gọi API + gắn JWT tự động)   |
+---------------------------+---------------------------+
                            |
              REST API Call | JSON Response
              Bearer Token  |
                            v
+-------------------------------------------------------+
|          BỘ LỌC BẢO MẬT (SPRING SECURITY)            |
|  - JWT Authentication                                  |
|  - JwtFilter — Xác thực mỗi request                  |
|  - CORS Configuration                                  |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|        BACKEND (SPRING BOOT — PORT 8080)              |
|  - AuthController      - ProductController            |
|  - CategoryController  - OrderController              |
|  - ReviewController    - UserController               |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|           TẦNG NGHIỆP VỤ (SERVICE / REPOSITORY)      |
|  - Spring Data JPA + Hibernate                        |
|  - BCrypt Password Encoding                           |
|  - JWT Token Generation & Validation                  |
+---------------------------+---------------------------+
                            |
                            v
+-------------------------------------------------------+
|              CƠ SỞ DỮ LIỆU (MYSQL)                   |
|  - users, categories, products, product_images        |
|  - product_specs, orders, order_items, reviews        |
+-------------------------------------------------------+
```

---

## 🛠️ Công nghệ sử dụng

| Thành phần | Công nghệ |
|---|---|
| **Frontend** | ReactJS, Vite, Tailwind CSS, React Router |
| **State Management** | Zustand (Auth Store, Cart Store) |
| **HTTP Client** | Axios + Interceptor |
| **Backend** | Java 21, Spring Boot, Spring Security |
| **Xác thực** | JSON Web Token (JWT) |
| **Database** | MySQL, Spring Data JPA, Hibernate |
| **Công cụ** | VS Code, IntelliJ IDEA, XAMPP, Postman |

---

## ✨ Các chức năng chính

### 🔐 Xác thực (Authentication)
- Đăng ký tài khoản với validation đầy đủ và thanh độ mạnh mật khẩu
- Đăng nhập bảo mật bằng JWT Token lưu trong localStorage
- Mật khẩu mã hóa bằng BCrypt
- Phân quyền CUSTOMER / ADMIN

### 🛍️ Mua sắm
- Xem danh sách sản phẩm với lọc theo danh mục và sắp xếp theo giá
- Tìm kiếm sản phẩm realtime theo tên
- Xem chi tiết sản phẩm với gallery nhiều ảnh và thông số kỹ thuật
- Thêm vào giỏ hàng lưu localStorage qua Zustand
- Đặt hàng COD với form thông tin giao hàng

### 📦 Quản lý đơn hàng
- Xem lịch sử đơn hàng với lọc theo 5 trạng thái
- Hủy đơn hàng khi đang chờ xác nhận
- Theo dõi trạng thái: Chờ xác nhận → Đã xác nhận → Đang giao → Đã giao

### ⭐ Đánh giá sản phẩm
- Đánh giá sao từ 1-5 kèm nội dung nhận xét
- Mỗi khách hàng chỉ đánh giá một sản phẩm một lần
- Rating trung bình cập nhật realtime và hiển thị trên card sản phẩm

### 👤 Thông tin cá nhân
- Xem và cập nhật họ tên, số điện thoại, địa chỉ
- Đổi mật khẩu với xác thực mật khẩu hiện tại
- Xem đơn hàng gần đây

### 🔧 Quản trị (Admin)
- Dashboard thống kê tổng quan
- Quản lý sản phẩm: thêm/sửa/xóa, upload nhiều ảnh, thêm thông số kỹ thuật động
- Quản lý danh mục
- Quản lý đơn hàng: xem thông tin khách hàng, cập nhật trạng thái trực tiếp
- Quản lý người dùng: xem danh sách, lọc theo role, tìm kiếm

---

## 📁 Cấu trúc thư mục dự án

```
DoAnPTWeb/
├── frontend/                          # React + Vite (port 5173)
│   └── src/
│       ├── api/
│       │   ├── axiosConfig.js         # Interceptor JWT tự động
│       │   └── productApi.js          # API lấy thống kê rating
│       ├── components/
│       │   ├── customer/
│       │   │   ├── Navbar.jsx         # Thanh điều hướng + giỏ hàng badge
│       │   │   ├── Footer.jsx         # Footer dùng chung
│       │   │   ├── ProductCard.jsx    # Card sản phẩm + rating thật
│       │   │   └── StarRating.jsx     # Component hiển thị sao
│       │   └── admin/
│       │       └── AdminLayout.jsx    # Layout sidebar Admin
│       ├── pages/
│       │   ├── customer/
│       │   │   ├── Home.jsx           # Trang chủ + slider
│       │   │   ├── ProductList.jsx    # Danh sách + filter sidebar
│       │   │   ├── ProductDetail.jsx  # Chi tiết + gallery + đánh giá
│       │   │   ├── Cart.jsx           # Giỏ hàng + đặt hàng
│       │   │   ├── Orders.jsx         # Lịch sử đơn hàng
│       │   │   ├── Profile.jsx        # Thông tin cá nhân
│       │   │   ├── Login.jsx          # Đăng nhập
│       │   │   └── Register.jsx       # Đăng ký
│       │   └── admin/
│       │       ├── Dashboard.jsx      # Thống kê tổng quan
│       │       ├── Products.jsx       # Quản lý sản phẩm + danh mục
│       │       ├── CreateProduct.jsx  # Thêm sản phẩm
│       │       ├── EditProduct.jsx    # Sửa sản phẩm
│       │       ├── Orders.jsx         # Quản lý đơn hàng
│       │       └── Users.jsx          # Quản lý người dùng
│       ├── store/
│       │   ├── authStore.js           # Zustand: thông tin đăng nhập
│       │   └── cartStore.js           # Zustand: giỏ hàng
│       └── utils/
│           ├── constants.js           # STATUS_CONFIG, STATUS_OPTIONS
│           └── formatters.js          # formatPrice, formatDate
│
└── backend/                           # Spring Boot (port 8080)
    └── src/main/java/
        ├── controller/
        │   ├── AuthController.java    # Đăng ký, Đăng nhập
        │   ├── ProductController.java # CRUD sản phẩm + upload ảnh
        │   ├── CategoryController.java# CRUD danh mục
        │   ├── OrderController.java   # Đặt hàng, xem, cập nhật
        │   ├── ReviewController.java  # Đánh giá sản phẩm
        │   └── UserController.java    # Thông tin người dùng
        ├── entity/
        │   ├── User.java
        │   ├── Category.java
        │   ├── Product.java
        │   ├── ProductImage.java
        │   ├── ProductSpec.java
        │   ├── Order.java
        │   ├── OrderItem.java
        │   └── Review.java
        ├── repository/                # 8 JPA Repositories
        ├── config/
        │   ├── SecurityConfig.java    # Spring Security + CORS
        │   ├── JwtFilter.java         # Xác thực JWT mỗi request
        │   └── JwtUtil.java           # Generate & Validate JWT
        └── resources/
            └── application.properties
```

---

## 🚀 Hướng dẫn chạy dự án

### 🛠️ Yêu cầu chuẩn bị

- **Java JDK 21** trở lên
- **Node.js 20.x** trở lên
- **XAMPP** (MySQL đang chạy)
- **IntelliJ IDEA** hoặc VS Code
- **Postman** (tuỳ chọn — kiểm thử API)

---

### 🗄️ Bước 1: Cấu hình cơ sở dữ liệu

Mở phpMyAdmin (`http://localhost/phpmyadmin`) và tạo database:

```sql
CREATE DATABASE doanptweb
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Cấu hình file `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/doanptweb?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=root
spring.datasource.password=

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

server.port=8080
```

---

### ⚙️ Bước 2: Chạy Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

Hoặc mở IntelliJ IDEA → Run `BackendApplication.java`

Console hiện thông báo thành công:
```
Started BackendApplication in X seconds
```

---

### 💻 Bước 3: Chạy Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

---

### 🌐 Bước 4: Truy cập ứng dụng

| Địa chỉ | Mô tả |
|---|---|
| `http://localhost:5173` | Giao diện khách hàng |
| `http://localhost:5173/admin` | Giao diện Admin |
| `http://localhost:8080/api` | REST API Backend |

Đăng ký tài khoản mới tại `/register` hoặc tạo tài khoản Admin trực tiếp trong database:

```sql
-- Sau khi đăng ký tài khoản bình thường, cập nhật role thành ADMIN:
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

---

## 👨‍💻 Thông tin đồ án

| Thông tin | Chi tiết |
|---|---|
| **Môn học** | Phát triển ứng dụng Web |
| **Trường** | Đại học Nha Trang |
| **Khoa** | Công nghệ Thông tin |
| **GVHD** | ThS. Mai Cường Thọ |
| **Sinh viên** | Nguyễn Phúc Tâm Huy |
| **MSSV** | 65131313 |
| **Năm** | 2026 |
