-- ====================================
-- TOUR GUIDE TEST DATA
-- Tour Guide User ID: 2
-- ====================================

-- 1. Create Tour Guide User (ID = 2)
SET IDENTITY_INSERT users ON;

INSERT INTO users (id, username, password, email, role, status, created_at, updated_at)
VALUES (2, 'tourguide1', '$2a$10$XPT8JqE9k9yqLZ.YqL0Z8e8K4Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 
        'tourguide1@travelgoda.com', 'TOUR_GUIDE', 'ACTIVE', GETDATE(), GETDATE());

-- 2. Create Tour Provider User (ID = 1) if not exists
IF NOT EXISTS (SELECT 1 FROM users WHERE id = 1)
BEGIN
    INSERT INTO users (id, username, password, email, role, status, created_at, updated_at)
    VALUES (1, 'provider1', '$2a$10$XPT8JqE9k9yqLZ.YqL0Z8e8K4Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 
            'provider1@travelgoda.com', 'TOUR_PROVIDER', 'ACTIVE', GETDATE(), GETDATE());
END

SET IDENTITY_INSERT users OFF;

-- 3. Create Tour Provider record
INSERT INTO tour_providers (user_id, company_name, business_license, rating)
VALUES (1, 'Công ty Du lịch ABC', 'BL-2024-001', 4.8);

-- 4. Create Tour Guide record (User ID = 2)
INSERT INTO tour_guides (user_id, provider_id, languages, certifications)
VALUES (2, 1, 
        '["Tiếng Việt", "English", "中文"]', 
        '["Chứng chỉ Hướng dẫn viên Du lịch Quốc gia", "TOEIC 850", "First Aid Certificate"]');

-- 5. Create Categories
SET IDENTITY_INSERT categories ON;

INSERT INTO categories (id, name, description)
VALUES 
    (1, 'Beach & Island', 'Tour biển đảo, nghỉ dưỡng'),
    (2, 'Mountain & Nature', 'Tour leo núi, khám phá thiên nhiên'),
    (3, 'Cultural & Historical', 'Tour văn hóa, lịch sử'),
    (4, 'City Tour', 'Tour khám phá thành phố');

SET IDENTITY_INSERT categories OFF;

-- 6. Create Destinations
SET IDENTITY_INSERT destinations ON;

INSERT INTO destinations (id, name, country, location)
VALUES 
    (1, 'Phú Quốc', 'Việt Nam', 'Kiên Giang'),
    (2, 'Hòn Thơm', 'Việt Nam', 'Kiên Giang'),
    (3, 'Nam Đảo', 'Việt Nam', 'Kiên Giang'),
    (4, 'Hạ Long', 'Việt Nam', 'Quảng Ninh'),
    (5, 'Cát Bà', 'Việt Nam', 'Hải Phòng'),
    (6, 'Sapa', 'Việt Nam', 'Lào Cai');

SET IDENTITY_INSERT destinations OFF;

-- 7. Create Tours
SET IDENTITY_INSERT tours ON;

INSERT INTO tours (id, provider_id, category_id, name, description, itinerary, tour_type, 
                   duration_days, group_size, status, average_rating, created_at, updated_at)
VALUES 
    -- Tour 1: Phú Quốc
    (1, 1, 1, 'Du Lịch Phú Quốc 3N2Đ - Khám Phá Đảo Ngọc', 
     'Khám phá vẻ đẹp thiên nhiên tuyệt vời của đảo ngọc Phú Quốc với những bãi biển trong xanh, ẩm thực phong phú và những trải nghiệm không thể quên.', 
     'Ngày 1: TP.HCM - Phú Quốc
- 08:00: Khởi hành từ sân bay Tân Sơn Nhất
- 09:30: Đến sân bay Phú Quốc, xe đón và đưa đoàn về khách sạn
- 12:00: Dùng bữa trưa tại nhà hàng
- 14:00: Check-in khách sạn, nghỉ ngơi
- 16:00: Tự do khám phá phố đêm Phú Quốc
- 19:00: Dùng bữa tối tại nhà hàng hải sản

Ngày 2: Khám Phá Nam Đảo
- 07:00: Ăn sáng tại khách sạn
- 08:00: Khởi hành đi Hòn Thơm bằng cáp treo
- 10:00: Lặn ngắm san hô tại Nam Đảo
- 12:00: Dùng bữa trưa hải sản tươi sống
- 14:00: Tham quan công viên San Hô
- 16:00: Check-in Sunset Sanato Beach Club
- 19:00: Bữa tối BBQ trên bãi biển

Ngày 3: Vinpearl Safari - Về TP.HCM
- 07:00: Ăn sáng và trả phòng
- 08:30: Tham quan Vinpearl Safari
- 11:30: Mua sắm đặc sản Phú Quốc
- 13:00: Dùng bữa trưa
- 15:00: Ra sân bay, bay về TP.HCM
- 17:00: Về đến TP.HCM, kết thúc chuyến đi', 
     'Beach & Relax', 3, 20, 'PUBLISHED', 4.8, GETDATE(), GETDATE()),
    
    -- Tour 2: Hạ Long
    (2, 1, 1, 'Du Thuyền Hạ Long 2N1Đ - Vịnh Di Sản', 
     'Trải nghiệm du thuyền sang trọng trên vịnh Hạ Long, khám phá các hang động kỳ vĩ và thưởng thức ẩm thực đặc sắc.', 
     'Ngày 1: Hà Nội - Hạ Long
- 08:00: Xe đón tại điểm hẹn, khởi hành đi Hạ Long
- 12:00: Đến cảng, lên du thuyền
- 12:30: Check-in cabin, thưởng thức bữa trưa
- 14:00: Tham quan hang Sửng Sốt
- 16:00: Bơi lội, chèo kayak
- 19:00: Bữa tối trên du thuyền
- 21:00: Câu mực đêm, karaoke

Ngày 2: Hạ Long - Hà Nội
- 06:30: Tập Thái Cực Quyền trên boong tàu
- 07:00: Ăn sáng
- 08:00: Tham quan làng chài Cửa Vạn
- 10:00: Trả phòng, nghỉ ngơi trên boong tàu
- 11:30: Dùng bữa trưa
- 12:30: Xuống thuyền, về Hà Nội
- 16:30: Về đến Hà Nội, kết thúc chuyến đi', 
     'Cruise & Adventure', 2, 15, 'PUBLISHED', 4.9, GETDATE(), GETDATE()),
    
    -- Tour 3: Sapa
    (3, 1, 2, 'Sapa 3N2Đ - Chinh Phục Fansipan', 
     'Chinh phục nóc nhà Đông Dương, khám phá văn hóa độc đáo của các dân tộc thiểu số và ngắm nhìn ruộng bậc thang hùng vĩ.', 
     'Ngày 1: Hà Nội - Sapa
- 21:00: Tập trung tại điểm hẹn
- 21:30: Khởi hành đi Sapa bằng xe giường nằm
- 00:00: Nghỉ đêm trên xe

Ngày 2: Chinh Phục Fansipan
- 05:30: Đến Sapa, ăn sáng
- 07:00: Lên cáp treo Fansipan
- 09:00: Chinh phục đỉnh Fansipan (3143m)
- 12:00: Trở về, dùng bữa trưa
- 14:00: Check-in khách sạn, nghỉ ngơi
- 16:00: Tham quan thị trấn Sapa
- 19:00: Bữa tối với món đặc sản

Ngày 3: Bản Cát Cát - Về Hà Nội
- 07:00: Ăn sáng
- 08:00: Tham quan bản Cát Cát
- 11:00: Trở về khách sạn, trả phòng
- 12:00: Dùng bữa trưa
- 14:00: Khởi hành về Hà Nội
- 20:00: Về đến Hà Nội, kết thúc chuyến đi', 
     'Mountain Trekking', 3, 25, 'PUBLISHED', 4.7, GETDATE(), GETDATE()),
    
    -- Tour 4: Draft tour
    (4, 1, 3, 'Hội An - Đà Nẵng 4N3Đ', 
     'Khám phá phố cổ Hội An và thành phố Đà Nẵng hiện đại.', 
     'Chi tiết lịch trình đang được cập nhật...', 
     'Cultural', 4, 20, 'DRAFT', 0, GETDATE(), GETDATE());

SET IDENTITY_INSERT tours OFF;

-- 8. Create Tour Destinations mapping (composite key: tour_id, destination_id)
INSERT INTO tour_destinations (tour_id, destination_id)
VALUES 
    -- Tour 1 destinations
    (1, 1), (1, 2), (1, 3),
    -- Tour 2 destinations
    (2, 4), (2, 5),
    -- Tour 3 destinations
    (3, 6);

-- 9. Create Schedules (Link tours with guide)
SET IDENTITY_INSERT schedules ON;

INSERT INTO schedules (id, tour_id, guide_id, start_date, end_date, available_slots, booked_slots)
VALUES 
    -- Tour 1 schedules with guide ID = 2
    (1, 1, 2, '2024-12-15 08:00:00', '2024-12-17 17:00:00', 20, 15),
    (2, 1, 2, '2024-12-20 08:00:00', '2024-12-22 17:00:00', 20, 8),
    (3, 1, 2, '2025-01-05 08:00:00', '2025-01-07 17:00:00', 20, 3),
    
    -- Tour 2 schedules with guide ID = 2
    (4, 2, 2, '2024-12-18 08:00:00', '2024-12-19 17:00:00', 15, 12),
    (5, 2, 2, '2024-12-25 08:00:00', '2024-12-26 17:00:00', 15, 5),
    
    -- Tour 3 schedules with guide ID = 2
    (6, 3, 2, '2024-12-10 21:00:00', '2024-12-13 20:00:00', 25, 20),
    (7, 3, 2, '2024-12-28 21:00:00', '2024-12-31 20:00:00', 25, 18);

SET IDENTITY_INSERT schedules OFF;

-- 10. Create sample customer users
SET IDENTITY_INSERT users ON;
INSERT INTO users (id, username, password, email, role, status, created_at, updated_at)
VALUES 
    (10, 'customer1', '$2a$10$XPT8JqE9k9yqLZ.YqL0Z8e8K4Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 
     'customer1@email.com', 'CUSTOMER', 'ACTIVE', GETDATE(), GETDATE()),
    (11, 'customer2', '$2a$10$XPT8JqE9k9yqLZ.YqL0Z8e8K4Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5', 
     'customer2@email.com', 'CUSTOMER', 'ACTIVE', GETDATE(), GETDATE());

SET IDENTITY_INSERT users OFF;

-- 11. Create Customer records (với fullName)
INSERT INTO customers (user_id, full_name, loyalty_points)
VALUES 
    (10, 'Trần Thị Lan', 100),
    (11, 'Lê Văn Minh', 50);

-- 12. Create sample bookings
SET IDENTITY_INSERT bookings ON;

INSERT INTO bookings (id, customer_id, schedule_id, booking_reference, booking_date, 
                      number_of_people, total_amount, status)
VALUES 
    (1, 10, 1, 'BK-2024-001', GETDATE(), 2, 7000000, 'CONFIRMED'),
    (2, 11, 1, 'BK-2024-002', GETDATE(), 3, 10500000, 'CONFIRMED'),
    (3, 10, 4, 'BK-2024-003', GETDATE(), 2, 8000000, 'CONFIRMED'),
    (4, 11, 6, 'BK-2024-004', GETDATE(), 4, 16000000, 'CONFIRMED');

SET IDENTITY_INSERT bookings OFF;

-- 13. Create pricing for tours
SET IDENTITY_INSERT pricings ON;
INSERT INTO pricings (id, tour_id, adult_price, child_price, currency)
VALUES 
    (1, 1, 3500000, 2450000, 'VND'),
    (2, 2, 4000000, 2800000, 'VND'),
    (3, 3, 4000000, 2800000, 'VND');

SET IDENTITY_INSERT pricings OFF;

-- 14. Add some reviews (booking_id is required)
SET IDENTITY_INSERT reviews ON;
INSERT INTO reviews (id, tour_id, customer_id, booking_id, rating, comment, created_at)
VALUES 
    (1, 1, 10, 1, 5, 'Tour rất tuyệt vời! Hướng dẫn viên nhiệt tình, lịch trình hợp lý. Phú Quốc thật đẹp!', GETDATE()),
    (2, 1, 11, 2, 4, 'Chuyến đi đáng nhớ. Các điểm tham quan rất đẹp. Chỉ có điều thời tiết hơi mưa.', GETDATE()),
    (3, 2, 10, 3, 5, 'Du thuyền Hạ Long tuyệt vời! Dịch vụ chuyên nghiệp, ăn uống ngon.', GETDATE()),
    (4, 3, 11, 4, 5, 'Chinh phục Fansipan là trải nghiệm không thể quên! Hướng dẫn viên rất giỏi.', GETDATE());

SET IDENTITY_INSERT reviews OFF;

-- ====================================
-- SUMMARY
-- ====================================
-- User ID: 2 (tourguide1 / tourguide1@travelgoda.com)
-- Password: tourguide1 (hashed)
-- Role: TOUR_GUIDE
-- 
-- Tours assigned to guide ID 2:
-- - Tour 1: Phú Quốc 3N2Đ (3 schedules, 26 bookings)
-- - Tour 2: Hạ Long 2N1Đ (2 schedules, 17 bookings)
-- - Tour 3: Sapa 3N2Đ (2 schedules, 38 bookings)
--
-- Total: 3 active tours, 7 schedules
-- ====================================

PRINT 'Tour Guide test data inserted successfully!';
PRINT 'Login credentials:';
PRINT '  Username: tourguide1';
PRINT '  Password: tourguide1';
PRINT '  User ID: 2';
PRINT '  Role: TOUR_GUIDE';
