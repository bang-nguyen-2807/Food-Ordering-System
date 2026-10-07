VERSION 1 
    UPDATE 1 : - built authorization admin with dashboard , analytics, users & partners management, orders        management, code sales management.  
               - create generic component for repositories and get API in RTK. it will clean design system
    UPDATE 2 : - built restaurant management menu page , restaurant dashboard page and restaurant management order page 
    UPDATE 3 : - built shipper dashboard 
               - general header url for otimization link api and head url
               - display location for shipper and restaurant
    UPDATE 3.1 - add topbar for restaurant and shipper
    UPDATE 3.2 - create user page , api user
               - user can see info user, add address, delete address and edit info user
               - user can create order, view his orders , bill , see list restaurant
               - get location for shipper and user
               - update UX/UI in infoUser page
               - update for change password 
    UPDATE 3.3 - create shipper delivering page 
               - shipper can see list order
               - shipper can get location 
               - itegrate map with leaflet for shipper can get route and location
               - update status deliveries for shipper
               - change status when click button nhận đơn hàng . next status 
    UPDATE 4   - add a function find the way for shipper to restaurant 
               - update click at managerOrder. when click update dbo.deliveries. it will update status 
    UPDATE 4.1 - create geocoding to get coordinates(tọa độ) user in the shipper by photon
               - use fallback algorithm to break down the search for address user
               - update location in deliveringCPN.tsx
               