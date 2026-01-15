-- Clear existing data
DELETE FROM testimonials;
DELETE FROM teachers;
DELETE FROM sessions;
DELETE FROM registrations;
DELETE FROM classes;
DELETE FROM locations;
DELETE FROM page_content;

-- Add Teachers (2: Hank, Brian)
INSERT INTO teachers (name, bio, image_url, active, display_order) VALUES
  ('Hank Williams', 'Director of Awesomeness and founder of Rocky Mountain Aardvarks. Hank has been making music with kids for over 15 years and believes that every child is musical.', '/images/hank.jpg', 1, 1),
  ('Brian Johnson', 'Lead instructor and multi-instrumentalist. Brian brings energy and creativity to every class, specializing in guitar, ukulele, and percussion.', '/images/brian.jpg', 1, 2);

-- Add Locations (3)
INSERT INTO locations (name, address, lat, lng) VALUES
  ('Washington Park', 'Washington Park, Denver, CO 80209', 39.7003, -104.9733),
  ('Cherry Creek Dance', '2625 E 3rd Ave, Denver, CO 80206', 39.7214, -104.9564),
  ('Boulder Community Center', '1300 Canyon Blvd, Boulder, CO 80302', 40.0150, -105.2705);

-- Add Testimonials (5)
INSERT INTO testimonials (quote, author, source, stars, active) VALUES
  ('My daughter absolutely loves Aardvarks! The teachers are amazing and the music is actually enjoyable for parents too.', 'Sarah M.', 'Google', 5, 1),
  ('Best kids music class in Denver! Hank is so engaging and the kids have a blast every week.', 'Mike & Jessica T.', 'Yelp', 5, 1),
  ('We''ve tried other music classes but Aardvarks is by far the most fun. Real instruments, great songs, and wonderful community.', 'Emily R.', 'Google', 5, 1),
  ('The mixed-age format is perfect for our family. Both our toddler and baby can participate together.', 'David L.', 'Facebook', 4, 1),
  ('Highly recommend! The music stays in your head (in a good way) and my son asks to go to ''Aardvarks'' every day.', 'Amanda K.', 'Google', 5, 1);

-- Add Classes
INSERT INTO classes (title, description, age_range, duration, price, image_url) VALUES
  ('Mixed Ages', 'Our signature class for babies, toddlers, and preschoolers. Featuring original songs, rhythm instruments, movement activities, and lots of fun!', '0-5 years', '45 minutes', 21000, '/images/mixed-ages.jpg');

-- Add Page Content
INSERT INTO page_content (slug, title, content) VALUES
  ('our-story', 'Our Story', 'Rocky Mountain Aardvarks was founded in 2011 to bring intelligent, fun music to Denver families. What started as a small class in a living room has grown into a beloved community of music-loving families across the Front Range.'),
  ('refund-policy', 'Refund Policy', 'Full refunds are available up to one week before the session starts. After that, we offer pro-rated refunds or credits for future sessions.');
