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
    UPDATE 4.2 - update order await shipment in infoUser
               - add map and geocoding location user and shipper in deliveringCPN.tsx at authorization users
               - create api and design interface for info shipper receive order and info order items in deliveries.tsx
               - create api orderAwaitingShipment for get OrderId to get order delivering
               - geocoding for location shipper to user and finding a way for shipper go to restaurant and user in map 
    UPDATE 4.3 - create api chatbox with gemini in users
               - design interface chatbox for user
               - build function get message from ai with api gemini
               - build function send message to ai and get message from ai with api gemini
    UPDATE 4.4 - create api chatbot with gemini in restaurant
               - fix design interface chatbot in user
               - design interface chatbot in restaurant for manager menu and dashboard
               - build function get message from ai with api gemini in dashboard and managerMenu
               - build function send message to ai and get message from ai with api gemini in dashboard and managerMenu
    UPDATE 4.5 - add rate limit for all api in backend
    UPDATE 4.6 - download library bcrypt for hash password for user
               - update login repo and createAccount repo for hash password for user
               - write README.md to clone this project very detail