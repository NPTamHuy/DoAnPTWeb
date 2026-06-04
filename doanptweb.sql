-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th6 04, 2026 lúc 08:15 AM
-- Phiên bản máy phục vụ: 10.4.32-MariaDB
-- Phiên bản PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `doanptweb`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) NOT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `categories`
--

INSERT INTO `categories` (`id`, `description`, `image_url`, `name`) VALUES
(1, 'Laptop (máy tính xách tay) là thiết bị điện tử di động tích hợp đầy đủ chức năng của một máy tính để bàn, bao gồm màn hình, bàn phím, touchpad (bàn di chuột) và các linh kiện phần cứng bên trong một thân máy mỏng nhẹ.', NULL, 'Laptop'),
(2, 'Điện thoại di động (Mobile Phone) là thiết bị viễn thông cầm tay, cho phép thực hiện/nhận cuộc gọi và nhắn tin không dây thông qua mạng viễn thông khi người dùng di chuyển.', NULL, 'Mobile Phone'),
(20, 'Tablet (máy tính bảng) là thiết bị điện tử di động lai giữa điện thoại thông minh và laptop, nổi bật với màn hình cảm ứng lớn (thường từ 7 đến 13 inch), thiết kế mỏng nhẹ, dễ dàng mang theo. Thiết bị tích hợp màn hình, vi mạch và pin trong một khối thống nhất, sử dụng hệ điều hành di động như Android hoặc iPadOS.', NULL, 'Tablet');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `shipping_address` varchar(255) DEFAULT NULL,
  `status` enum('CANCELLED','CONFIRMED','DELIVERED','PENDING','SHIPPING') DEFAULT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `orders`
--

INSERT INTO `orders` (`id`, `created_at`, `phone`, `shipping_address`, `status`, `total_amount`, `user_id`, `note`) VALUES
(1, '2026-05-26 09:08:38.000000', '0987654321', '123 ABC, XYZ', 'DELIVERED', 26900000.00, 1, ''),
(2, '2026-05-26 09:11:20.000000', '0935123321', '987 XYZ, ABC', 'CONFIRMED', 26900000.00, 2, ''),
(3, '2026-05-26 10:20:47.000000', '0123445677', 'XYZ ABC', 'CONFIRMED', 26900000.00, 2, ''),
(4, '2026-05-27 11:11:30.000000', '012345678', 'ABC XYZ', 'CANCELLED', 26900000.00, 2, 'Hãy gọi điện trước khi giao');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) NOT NULL,
  `price` decimal(38,2) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `order_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `order_items`
--

INSERT INTO `order_items` (`id`, `price`, `quantity`, `order_id`, `product_id`) VALUES
(1, 26900000.00, 1, 1, 7),
(2, 26900000.00, 1, 2, 7),
(3, 26900000.00, 1, 3, 7),
(4, 26900000.00, 1, 4, 7);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `products`
--

CREATE TABLE `products` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(38,2) NOT NULL,
  `stock` int(11) DEFAULT NULL,
  `category_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `products`
--

INSERT INTO `products` (`id`, `active`, `description`, `image_url`, `name`, `price`, `stock`, `category_id`) VALUES
(7, b'1', 'Laptop Lenovo ThinkPad E16 Gen 3 21SR00AAVN mang đến không gian làm việc 16 inch WUXGA rộng mở cùng con chip Intel Core Ultra 5 135H mạnh mẽ đột phá. Nhân NPU Intel AI Boost tích hợp giúp tối ưu hóa mọi tác vụ thông minh. Máy được hỗ trợ 2 khe SSD, cổng Thunderbolt 4 và bảo mật ThinkShield tối ưu.', 'http://localhost:8080/uploads/1779780704925_laptop1.jpg', 'Laptop Lenovo ThinkPad E16 Gen 3 21SR00AAVN', 26900000.00, 25, 1),
(8, b'1', 'iPhone 17 Pro Max (256GB/512GB/1TB/2TB) là là sản phẩm thành công nhất trong lịch sử Apple sở hữu bảo mật nâng cao, Mở khoá khuôn mặt Face ID, cùng thiết kế khung nhôm rèn nhiệt siêu nhẹ, chip A19 Pro mạnh mẽ, và camera 48MP thuộc dòng điện thoại iPhone 17 series của Apple.', 'http://localhost:8080/uploads/1779783278553_iphone-17-pro-max_3.jpg', 'iPhone 17 Pro Max 256GB', 36900000.00, 100, 2),
(9, b'1', 'iPad A16 Wifi 128GB 2025iPad A16 Wifi 128GB (2025) – hay còn gọi là iPad Gen 11 – là dòng máy tính bảng phổ thông mới nhất được Apple ra mắt. Thiết bị sở hữu nâng cấp mạnh mẽ về cấu hình hiệu năng và dung lượng lưu trữ tối thiểu gấp đôi thế hệ trước.', 'http://localhost:8080/uploads/1779783570333_ipad-a16-11-inch_10_.jpg', 'iPad A16 Wifi 128GB 2025', 9690000.00, 15, 20),
(10, b'1', 'Laptop HP Omnibook 5 AI 16-AF1048TU BZ7Q9PA nổi bật với chip Intel Core Ultra 5 225U, kết hợp AI Boost cho hiệu suất xử lý vượt trội trong mọi tác vụ. Sản phẩm sở hữu màn hình 16 inch WUXGA IPS, mang lại trải nghiệm hình ảnh sắc nét, sống động. Cùng với đó là RAM 16 GB, đảm bảo khả năng đa nhiệm mượt mà cho cả công việc lẫn giải trí.', 'http://localhost:8080/uploads/1779879862971_text_ng_n_2__10_20.jpg', 'Laptop HP Omnibook 5 AI 16-AF1048TU BZ7Q9PA', 25190000.00, 35, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_images`
--

CREATE TABLE `product_images` (
  `id` bigint(20) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_images`
--

INSERT INTO `product_images` (`id`, `image_url`, `sort_order`, `product_id`) VALUES
(4, 'http://localhost:8080/uploads/1779783570333_ipad-a16-11-inch_10_.jpg', 0, 9),
(5, 'http://localhost:8080/uploads/1779783573684_ipad-a16-11-inch_6__1.jpg', 1, 9),
(6, 'http://localhost:8080/uploads/1779783575974_ipad-a16-11-inch_3__1.jpg', 2, 9),
(13, 'http://localhost:8080/uploads/1779879862971_text_ng_n_2__10_20.jpg', 0, 10),
(14, 'http://localhost:8080/uploads/1779783278553_iphone-17-pro-max_3.jpg', 0, 8),
(15, 'http://localhost:8080/uploads/1779783282700_iphone-17-pro-max_1_3.jpg', 1, 8),
(16, 'http://localhost:8080/uploads/1779783285601_iphone-17-pro-max-1_4.jpg', 2, 8);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `product_specs`
--

CREATE TABLE `product_specs` (
  `id` bigint(20) NOT NULL,
  `spec_name` varchar(255) DEFAULT NULL,
  `spec_value` varchar(255) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `product_specs`
--

INSERT INTO `product_specs` (`id`, `spec_name`, `spec_value`, `product_id`) VALUES
(6, 'Kích thước màn hình', '11 inches', 9),
(7, 'Công nghệ màn hình	', 'Liquid Retina', 9),
(8, 'Chipset', 'Chip A16', 9),
(9, 'Pin', 'Tích hợp pin sạc Li-Po 28,93 watt‑giờ', 9),
(10, 'Loại CPU', 'CPU 5 lõi', 9),
(21, 'Chip AI', 'Intel AI Boost', 10),
(22, 'Loại card đồ họa', 'Intel Graphics', 10),
(23, 'Dung lượng RAM', '16GB', 10),
(24, 'Loại RAM', 'LPDDR5X/ 7467MHz Onboard', 10),
(25, 'Hệ điều hành', 'Windows 11 Home Single Language 64-bit + Office Home 2024', 10),
(26, 'Kích thước màn hình', '6.9 inches', 8),
(27, 'Công nghệ màn hình', 'Super Retina XDR', 8),
(28, 'Camera sau', 'Chính: 48MP khẩu độ ƒ/1.6 OIS hỗ trợ chụp 24MP hoặc 48MP Góc Siêu Rộng: 48MP khẩu độ ƒ/2.2 góc nhìn 120° Telephoto: 48MP khẩu độ ƒ/2.8 OIS zoom quang học lên đến 8x', 8),
(29, 'Camera trước', 'Camera 18MP Center Stage Khẩu độ ƒ/1.9', 8),
(30, 'Chipset', 'Chip A19 Pro', 8);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) NOT NULL,
  `comment` text DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `reviews`
--

INSERT INTO `reviews` (`id`, `comment`, `created_at`, `rating`, `product_id`, `user_id`) VALUES
(1, 'Tốt', '2026-05-26 09:20:40.000000', 5, 7, 2),
(2, 'Ổn', '2026-05-26 09:31:20.000000', 3, 8, 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `users`
--

CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `active` bit(1) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `role` enum('ADMIN','CUSTOMER') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `users`
--

INSERT INTO `users` (`id`, `active`, `address`, `email`, `full_name`, `password`, `phone`, `role`) VALUES
(1, b'1', NULL, 'admin@gmail.com', 'Admin', '$2a$10$rBz5pyyo1zJ8YQz0srBjSOAh/X4R71uYAHvdynanR5JEFTL9a35tu', NULL, 'ADMIN'),
(2, b'1', NULL, 'nvA@gmail.com', 'Nguyễn Văn A', '$2a$10$dSZvSB/oGqFyKvQfrSHvIOPVLbtAjBlzBvUNpcG4oQGQGTKIWa8FK', '123', 'CUSTOMER'),
(3, b'1', NULL, 'nvB@gmail.com', 'Nguyễn Văn B', '$2a$10$uF5c.fUkHaRNbY2TS96dUuQFUsqSwnMKj7lj305Vh62GF3Z3WRBLu', '012345890', 'CUSTOMER');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKt8o6pivur7nn124jehx7cygw5` (`name`);

--
-- Chỉ mục cho bảng `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`);

--
-- Chỉ mục cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKbioxgbv59vetrxe0ejfubep1w` (`order_id`),
  ADD KEY `FKocimc7dtr037rh4ls4l95nlfi` (`product_id`);

--
-- Chỉ mục cho bảng `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKog2rp4qthbtt2lfyhfo32lsw9` (`category_id`);

--
-- Chỉ mục cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKqnq71xsohugpqwf3c9gxmsuy` (`product_id`);

--
-- Chỉ mục cho bảng `product_specs`
--
ALTER TABLE `product_specs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKpg8s24i6nwo81ab7awlr3tglk` (`product_id`);

--
-- Chỉ mục cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKpl51cejpw4gy5swfar8br9ngi` (`product_id`),
  ADD KEY `FKcgy7qjc1r99dp117y9en6lxye` (`user_id`);

--
-- Chỉ mục cho bảng `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT cho bảng `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT cho bảng `products`
--
ALTER TABLE `products`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `product_images`
--
ALTER TABLE `product_images`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT cho bảng `product_specs`
--
ALTER TABLE `product_specs`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT cho bảng `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

--
-- Các ràng buộc cho bảng `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `FKbioxgbv59vetrxe0ejfubep1w` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  ADD CONSTRAINT `FKocimc7dtr037rh4ls4l95nlfi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `FKog2rp4qthbtt2lfyhfo32lsw9` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Các ràng buộc cho bảng `product_images`
--
ALTER TABLE `product_images`
  ADD CONSTRAINT `FKqnq71xsohugpqwf3c9gxmsuy` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `product_specs`
--
ALTER TABLE `product_specs`
  ADD CONSTRAINT `FKpg8s24i6nwo81ab7awlr3tglk` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Các ràng buộc cho bảng `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `FKcgy7qjc1r99dp117y9en6lxye` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `FKpl51cejpw4gy5swfar8br9ngi` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
