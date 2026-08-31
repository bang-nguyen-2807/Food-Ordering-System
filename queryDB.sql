USE FoodOrderingSystem
--Bài 1 : lấy tất cả user
SELECT * FROM Users
--Bài 2 : lấy FullName, Email, NumberPhone
SELECT FullName, Email, NumberPhone FROM DBO.Users
-- Bài 3 :Tìm user có UserName là một username cụ thể.
SELECT Username , FullName, Email, NumberPhone From dbo.Users 
WHERE Users.UserName = 'nguyenan'
--Bài 4 :lấy tất cả các món có giá trên 50k
SELECT NameMenuItems , Price FROM DBO.MenuItems as M
WHERE M.Price > 50000
--Bài 5 : Lấy tất cả món có giá từ 30.000 → 80.000.
SELECT NameMenuItems , Price FROM DBO.MenuItems as M
WHERE M.Price BETWEEN 30000 AND 80000 
ORDER BY M.Price
--Bài 6 : Lấy tất cả món đang bán.
SELECT MenuItemId, NameMenuItems ,CategoriesRestaurantId,Price FROM DBO.MenuItems as M
WHERE M.is_available = 1 
--Bài 7 : Lấy tất cả món đang hết hàng.
SELECT MenuItemId, NameMenuItems ,CategoriesRestaurantId,Price FROM DBO.MenuItems as M
WHERE M.is_available = 0
--Bài 8 : lấy 5 món đắt nhất
SELECT TOP 5 NameMenuItems , Price FROM DBO.MenuItems as M
ORDER BY M.Price DESC -- DESC LÀ SẮP XẾP NGƯỢC
--Bài 9 : lấy 5 món rẻ nhất
SELECT TOP 5 NameMenuItems , Price FROM DBO.MenuItems as M
ORDER BY M.Price
-- Bài 10 : Tìm món có chữ Pizza trong tên.
SELECT NameMenuItems FROM DBO.MenuItems AS M
WHERE M.NameMenuItems LIKE '%Pizza%'
--Bài 11 : giống bài 10 ko làm
--Bài 12 : lấy danh sách giá k trùng nhau
SELECT DISTINCT Price FROM DBO.MenuItems AS M
ORDER BY M.Price
-- Bài 13 : tìm các món giá > 50k và đang bán
SELECT * FROM DBO.MenuItems AS M
WHERE M.Price > 50000 AND M.is_available = 1
-- Bài 14 : tìm món cs giá < 30k hoặc lớn hơn 100
SELECT * FROM DBO.MenuItems AS M
WHERE M.Price < 30000 or M.Price > 100000
--Bài 15 : Lấy tất cả nhà hàng và sắp xếp theo tên nhà hàng A → Z.
SELECT RestaurantId, RestaurantName, Addresses
FROM dbo.Restaurants
ORDER BY RestaurantName ASC;

--PHẦN 2 : BÀI TẬP JOIN

--Bài 16 : Hiển thị tên món , giá , tên nhà hàng
SELECT MN.NameMenuItems , MN.Price , R.RestaurantName FROM MenuItems AS MN
JOIN CategoriesRestaurant AS CR 
	ON MN.CategoriesRestaurantId = CR.CategoriesRestaurantId
JOIN Restaurants AS R
	ON CR.RestaurantId = R.RestaurantId

--Bài 17 : Hiển thị tên món , giá , tên nhà hàng , loại món của nhà hàng
SELECT MN.NameMenuItems , MN.Price , R.RestaurantId , CR.CategoriesRestaurantName , R.RestaurantName FROM MenuItems AS MN
JOIN CategoriesRestaurant AS CR 
	ON MN.CategoriesRestaurantId = CR.CategoriesRestaurantId
JOIN Restaurants AS R
	ON CR.RestaurantId = R.RestaurantId

--Bài 18 : Tìm tất cả món của một nhà hàng cụ thể (tên món , giá , tên nhà hàng)
SELECT MN.NameMenuItems , MN.Price , CR.CategoriesRestaurantName , R.RestaurantName FROM MenuItems AS MN
JOIN CategoriesRestaurant AS CR 
	ON MN.CategoriesRestaurantId = CR.CategoriesRestaurantId
JOIN Restaurants AS R
	ON CR.RestaurantId = R.RestaurantId
WHERE R.RestaurantName = N'Bếp Huế'

--Bài 19 : tìm tất cả món pizza của một nhà hàng
SELECT MN.NameMenuItems , MN.Price , CR.CategoriesRestaurantName , R.RestaurantName FROM MenuItems AS MN
JOIN CategoriesRestaurant AS CR 
	ON MN.CategoriesRestaurantId = CR.CategoriesRestaurantId
JOIN Restaurants AS R
	ON CR.RestaurantId = R.RestaurantId
WHERE R.RestaurantName = N'Pizza House' AND MN.NameMenuItems LIKE '%Pizza%'

--Bài 20 : tìm tất cả các món đang bán của 1 nhà hàng
SELECT MN.NameMenuItems , 
		CASE 
			WHEN MN.is_available = 1 THEN N'Đang bán'  
			ELSE N'Ngừng bán'   
		END AS N'TRẠNG THÁI'
FROM MenuItems AS MN
JOIN CategoriesRestaurant AS CR 
	ON MN.CategoriesRestaurantId = CR.CategoriesRestaurantId
JOIN Restaurants AS R
	ON CR.RestaurantId = R.RestaurantId
WHERE R.RestaurantName = N'Phố Ăn Nhanh' AND MN.is_available = 1

-- Bài 21 : Tìm món cs giá > 50000 và hiển thị tên nhà hàng
SELECT MN.NameMenuItems , MN.Price , R.RestaurantName FROM MenuItems as MN
JOIN CategoriesRestaurant AS CR 
	ON MN.CategoriesRestaurantId = CR.CategoriesRestaurantId
JOIN Restaurants AS R
	ON CR.RestaurantId = R.RestaurantId
WHERE MN.Price > 50000

--Tìm 10 món đắt nhất toàn hệ thống và hiển thị tên món , giá , nhà hàng
SELECT TOP 10 MN.NameMenuItems , MN.Price , R.RestaurantName FROM MenuItems as MN
JOIN CategoriesRestaurant AS CR 
	ON MN.CategoriesRestaurantId = CR.CategoriesRestaurantId
JOIN Restaurants AS R
	ON CR.RestaurantId = R.RestaurantId
ORDER BY MN.Price DESC

--PHẦN 3 : GROUP BY 
--		   COUNT() , SUM() , AVG() , MIN() , MAX()
--Bài 23 - 24 - 25 : có bao nhiêu user , nhà hàng , món ăn
SELECT
	(SELECT count(UserName) as 'countUser' FROM Users ) as u ,
	(SELECT count(RestaurantName) as 'countUser' FROM Restaurants )as r,
	(SELECT count(NameMenuItems) as 'countUser' FROM MenuItems )as MN

-- Bài 26 : giá món trung bình
SELECT CAST(AVG(Price) AS int) AS 'GTB' FROM MenuItems AS MN

