-- Initial Classes
INSERT INTO classes (title, description, age-range, duration, price) VALUES 
('Mixed Ages', 'Our signature class for babies, toddlers, and preschoolers.', '0-5 years', '45 minutes', 21000);

-- Initial Locations
INSERT INTO locations (name, address, lat, lng) VALUES 
('Washington Park', 'Washington Park, Denver, CO', 39.7003, -104.9733),
('Cherry Creek Dance', '2625 E 3rd Ave, Denver, CO 80206', 39.7214, -104.9564);

-- Initial Teachers
INSERT INTO teachers (name, bio, image_url) VALUES 
('Hank Williams', 'Director of Awesomeness and founder of Rocky Mountain Aardvarks.', '/photo-vertical.jpg');

-- Initial Page Content
INSERT INTO page_content (slug, title, content) VALUES 
('our-story', 'Our Story', 'Rocky Mountain Aardvarks was founded in 2011 to bring intelligent, fun music to Denver families.'),
('refund-policy', 'Refund Policy', 'Full refunds are available up to one week before the session starts.');
