-- ============================================
-- Company mock data (13 companies)
-- SELLER 2 / BUYER 5 / FORWARDER 3 / CARRIER 3
-- ============================================

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (1, '우리회사(주)', '인천광역시', '대한민국', '홍길동', '123-45-67001', 'SELLER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (2, '한빛무역(주)', '서울특별시', '대한민국', '이철수', '123-45-67002', 'SELLER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (3, '테스트바이어(주)', '서울특별시', '대한민국', '김철수', '234-56-78001', 'BUYER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (4, 'Global Buyer Co.', 'New York', '미국', 'John Smith', '234-56-78002', 'BUYER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (5, 'Nippon Trading Ltd.', 'Tokyo', '일본', 'Kenji Sato', '234-56-78003', 'BUYER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (6, 'Rhein Import GmbH', 'Berlin', '독일', 'Hans Mueller', '234-56-78004', 'BUYER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (7, '부산상사(주)', '부산광역시', '대한민국', '박영희', '234-56-78005', 'BUYER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (8, '테스트포워더(주)', '부산광역시', '대한민국', '박영희', '345-67-89001', 'FORWARDER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (9, 'Pacific Logistics Inc.', 'Los Angeles', '미국', 'Michael Lee', '345-67-89002', 'FORWARDER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (10, '동서포워딩(주)', '인천광역시', '대한민국', '최민수', '345-67-89003', 'FORWARDER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (11, '한진해운(주)', '부산광역시', '대한민국', '정다은', '456-78-90001', 'CARRIER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (12, 'Maersk Korea', '서울특별시', '대한민국', 'Lars Nielsen', '456-78-90002', 'CARRIER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

INSERT INTO company (id, company_name, address, country, name_of_owner, registration_number, role)
VALUES (13, '대한항공화물(주)', '인천광역시', '대한민국', '유지훈', '456-78-90003', 'CARRIER')
    ON DUPLICATE KEY UPDATE company_name = VALUES(company_name), address = VALUES(address), country = VALUES(country), name_of_owner = VALUES(name_of_owner), registration_number = VALUES(registration_number), role = VALUES(role);

-- ============================================
-- Items mock data (10 items)
-- ============================================

INSERT INTO items (id, product_name, price, set_qty, standard_weight)
VALUES (1, '무선 이어폰', 25000, 100, 0.05)
    ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), price = VALUES(price), set_qty = VALUES(set_qty), standard_weight = VALUES(standard_weight);

INSERT INTO items (id, product_name, price, set_qty, standard_weight)
VALUES (2, '보조배터리 10000mAh', 15000, 50, 0.22)
    ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), price = VALUES(price), set_qty = VALUES(set_qty), standard_weight = VALUES(standard_weight);

INSERT INTO items (id, product_name, price, set_qty, standard_weight)
VALUES (3, 'USB-C 케이블 1m', 3500, 200, 0.03)
    ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), price = VALUES(price), set_qty = VALUES(set_qty), standard_weight = VALUES(standard_weight);

INSERT INTO items (id, product_name, price, set_qty, standard_weight)
VALUES (4, '블루투스 스피커', 42000, 30, 0.65)
    ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), price = VALUES(price), set_qty = VALUES(set_qty), standard_weight = VALUES(standard_weight);

INSERT INTO items (id, product_name, price, set_qty, standard_weight)
VALUES (5, '스마트워치 밴드', 8900, 80, 0.04)
    ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), price = VALUES(price), set_qty = VALUES(set_qty), standard_weight = VALUES(standard_weight);

INSERT INTO items (id, product_name, price, set_qty, standard_weight)
VALUES (6, '차량용 거치대', 12000, 60, 0.18)
    ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), price = VALUES(price), set_qty = VALUES(set_qty), standard_weight = VALUES(standard_weight);

INSERT INTO items (id, product_name, price, set_qty, standard_weight)
VALUES (7, '무선 마우스', 18500, 70, 0.09)
    ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), price = VALUES(price), set_qty = VALUES(set_qty), standard_weight = VALUES(standard_weight);

INSERT INTO items (id, product_name, price, set_qty, standard_weight)
VALUES (8, '접이식 휴대폰 거치대', 6500, 150, 0.07)
    ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), price = VALUES(price), set_qty = VALUES(set_qty), standard_weight = VALUES(standard_weight);

INSERT INTO items (id, product_name, price, set_qty, standard_weight)
VALUES (9, 'LED 데스크 램프', 33000, 25, 0.9)
    ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), price = VALUES(price), set_qty = VALUES(set_qty), standard_weight = VALUES(standard_weight);

INSERT INTO items (id, product_name, price, set_qty, standard_weight)
VALUES (10, '노트북 파우치 15인치', 21000, 40, 0.35)
    ON DUPLICATE KEY UPDATE product_name = VALUES(product_name), price = VALUES(price), set_qty = VALUES(set_qty), standard_weight = VALUES(standard_weight);

-- ============================================
-- Stock mock data (1 stock row per item, 10 rows)
-- ============================================

INSERT INTO stock (id, items_id, quantity, reserved_quantity)
VALUES (1, 1, 500, 0)
    ON DUPLICATE KEY UPDATE items_id = VALUES(items_id), quantity = VALUES(quantity);

INSERT INTO stock (id, items_id, quantity, reserved_quantity)
VALUES (2, 2, 300, 0)
    ON DUPLICATE KEY UPDATE items_id = VALUES(items_id), quantity = VALUES(quantity);

INSERT INTO stock (id, items_id, quantity, reserved_quantity)
VALUES (3, 3, 1000, 0)
    ON DUPLICATE KEY UPDATE items_id = VALUES(items_id), quantity = VALUES(quantity);

INSERT INTO stock (id, items_id, quantity, reserved_quantity)
VALUES (4, 4, 150, 0)
    ON DUPLICATE KEY UPDATE items_id = VALUES(items_id), quantity = VALUES(quantity);

INSERT INTO stock (id, items_id, quantity, reserved_quantity)
VALUES (5, 5, 400, 0)
    ON DUPLICATE KEY UPDATE items_id = VALUES(items_id), quantity = VALUES(quantity);

INSERT INTO stock (id, items_id, quantity, reserved_quantity)
VALUES (6, 6, 250, 0)
    ON DUPLICATE KEY UPDATE items_id = VALUES(items_id), quantity = VALUES(quantity);

INSERT INTO stock (id, items_id, quantity, reserved_quantity)
VALUES (7, 7, 350, 0)
    ON DUPLICATE KEY UPDATE items_id = VALUES(items_id), quantity = VALUES(quantity);

INSERT INTO stock (id, items_id, quantity, reserved_quantity)
VALUES (8, 8, 600, 0)
    ON DUPLICATE KEY UPDATE items_id = VALUES(items_id), quantity = VALUES(quantity);

INSERT INTO stock (id, items_id, quantity, reserved_quantity)
VALUES (9, 9, 120, 0)
    ON DUPLICATE KEY UPDATE items_id = VALUES(items_id), quantity = VALUES(quantity);

INSERT INTO stock (id, items_id, quantity, reserved_quantity)
VALUES (10, 10, 200, 0)
    ON DUPLICATE KEY UPDATE items_id = VALUES(items_id), quantity = VALUES(quantity);

-- ============================================
-- Quotation mock data (5 quotations, buyers 3~7)
-- ============================================

INSERT INTO quotation (id, company_id, quotation_date, created_at, updated_at, total_amount, currency, incoterms, payment_term, comment)
VALUES (1, 3, '2026-08-01', '2026-08-01 09:00:00', '2026-08-01 09:00:00', 425000, 'KRW', 'FOB', 'TT', '샘플 요청 포함')
    ON DUPLICATE KEY UPDATE company_id = VALUES(company_id), quotation_date = VALUES(quotation_date), total_amount = VALUES(total_amount), currency = VALUES(currency), incoterms = VALUES(incoterms), payment_term = VALUES(payment_term), comment = VALUES(comment);

INSERT INTO quotation (id, company_id, quotation_date, created_at, updated_at, total_amount, currency, incoterms, payment_term, comment)
VALUES (2, 4, '2026-08-05', '2026-08-05 10:30:00', '2026-08-05 10:30:00', 510000, 'USD', 'CIF', 'TT', NULL)
    ON DUPLICATE KEY UPDATE company_id = VALUES(company_id), quotation_date = VALUES(quotation_date), total_amount = VALUES(total_amount), currency = VALUES(currency), incoterms = VALUES(incoterms), payment_term = VALUES(payment_term), comment = VALUES(comment);

INSERT INTO quotation (id, company_id, quotation_date, created_at, updated_at, total_amount, currency, incoterms, payment_term, comment)
VALUES (3, 5, '2026-08-10', '2026-08-10 14:15:00', '2026-08-10 14:15:00', 277500, 'USD', 'CIF', 'TT', '재고 확인 요망')
    ON DUPLICATE KEY UPDATE company_id = VALUES(company_id), quotation_date = VALUES(quotation_date), total_amount = VALUES(total_amount), currency = VALUES(currency), incoterms = VALUES(incoterms), payment_term = VALUES(payment_term), comment = VALUES(comment);

INSERT INTO quotation (id, company_id, quotation_date, created_at, updated_at, total_amount, currency, incoterms, payment_term, comment)
VALUES (4, 6, '2026-08-15', '2026-08-15 11:00:00', '2026-08-15 11:00:00', 387000, 'EUR', 'DAP', 'TT', NULL)
    ON DUPLICATE KEY UPDATE company_id = VALUES(company_id), quotation_date = VALUES(quotation_date), total_amount = VALUES(total_amount), currency = VALUES(currency), incoterms = VALUES(incoterms), payment_term = VALUES(payment_term), comment = VALUES(comment);

INSERT INTO quotation (id, company_id, quotation_date, created_at, updated_at, total_amount, currency, incoterms, payment_term, comment)
VALUES (5, 7, '2026-08-20', '2026-08-20 16:45:00', '2026-08-20 16:45:00', 516000, 'KRW', 'EXW', 'TT', '연말 프로모션 문의')
    ON DUPLICATE KEY UPDATE company_id = VALUES(company_id), quotation_date = VALUES(quotation_date), total_amount = VALUES(total_amount), currency = VALUES(currency), incoterms = VALUES(incoterms), payment_term = VALUES(payment_term), comment = VALUES(comment);

-- ============================================
-- QuotationItems mock data
-- ============================================

INSERT INTO quotation_items (id, quotation_id, items_id, unit_price, amount, quantity)
VALUES (1, 1, 1, 25000, 250000, 10)
    ON DUPLICATE KEY UPDATE quotation_id = VALUES(quotation_id), items_id = VALUES(items_id), unit_price = VALUES(unit_price), amount = VALUES(amount), quantity = VALUES(quantity);

INSERT INTO quotation_items (id, quotation_id, items_id, unit_price, amount, quantity)
VALUES (2, 1, 3, 3500, 175000, 50)
    ON DUPLICATE KEY UPDATE quotation_id = VALUES(quotation_id), items_id = VALUES(items_id), unit_price = VALUES(unit_price), amount = VALUES(amount), quantity = VALUES(quantity);

INSERT INTO quotation_items (id, quotation_id, items_id, unit_price, amount, quantity)
VALUES (3, 2, 2, 15000, 300000, 20)
    ON DUPLICATE KEY UPDATE quotation_id = VALUES(quotation_id), items_id = VALUES(items_id), unit_price = VALUES(unit_price), amount = VALUES(amount), quantity = VALUES(quantity);

INSERT INTO quotation_items (id, quotation_id, items_id, unit_price, amount, quantity)
VALUES (4, 2, 4, 42000, 210000, 5)
    ON DUPLICATE KEY UPDATE quotation_id = VALUES(quotation_id), items_id = VALUES(items_id), unit_price = VALUES(unit_price), amount = VALUES(amount), quantity = VALUES(quantity);

INSERT INTO quotation_items (id, quotation_id, items_id, unit_price, amount, quantity)
VALUES (5, 3, 7, 18500, 277500, 15)
    ON DUPLICATE KEY UPDATE quotation_id = VALUES(quotation_id), items_id = VALUES(items_id), unit_price = VALUES(unit_price), amount = VALUES(amount), quantity = VALUES(quantity);

INSERT INTO quotation_items (id, quotation_id, items_id, unit_price, amount, quantity)
VALUES (6, 4, 5, 8900, 267000, 30)
    ON DUPLICATE KEY UPDATE quotation_id = VALUES(quotation_id), items_id = VALUES(items_id), unit_price = VALUES(unit_price), amount = VALUES(amount), quantity = VALUES(quantity);

INSERT INTO quotation_items (id, quotation_id, items_id, unit_price, amount, quantity)
VALUES (7, 4, 6, 12000, 120000, 10)
    ON DUPLICATE KEY UPDATE quotation_id = VALUES(quotation_id), items_id = VALUES(items_id), unit_price = VALUES(unit_price), amount = VALUES(amount), quantity = VALUES(quantity);

INSERT INTO quotation_items (id, quotation_id, items_id, unit_price, amount, quantity)
VALUES (8, 5, 9, 33000, 264000, 8)
    ON DUPLICATE KEY UPDATE quotation_id = VALUES(quotation_id), items_id = VALUES(items_id), unit_price = VALUES(unit_price), amount = VALUES(amount), quantity = VALUES(quantity);

INSERT INTO quotation_items (id, quotation_id, items_id, unit_price, amount, quantity)
VALUES (9, 5, 10, 21000, 252000, 12)
    ON DUPLICATE KEY UPDATE quotation_id = VALUES(quotation_id), items_id = VALUES(items_id), unit_price = VALUES(unit_price), amount = VALUES(amount), quantity = VALUES(quantity);

-- ============================================
-- User mock data (담당자 계정)
-- 모든 계정 : password1234
-- ============================================

