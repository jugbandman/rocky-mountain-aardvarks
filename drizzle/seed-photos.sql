-- Seed photos for gallery
-- Photos are already in client/public/images/

DELETE FROM photos;

-- Classes photos
INSERT INTO photos (title, image_url, category, description, display_order, active) VALUES
  ('Music class fun', '/images/classes/rma-stills-01.jpg', 'Classes', 'Kids enjoying a music class', 1, 1),
  ('Rock stance', '/images/classes/rock-stance.jpg', 'Classes', 'Little rocker in action', 2, 1),
  ('Music together', '/images/classes/rma-stills-02.jpg', 'Classes', 'Families making music together', 3, 1),
  ('Happy kid', '/images/classes/happy-kid.jpg', 'Classes', 'Joy of music', 4, 1),
  ('Class in action', '/images/classes/rma-stills-03.jpg', 'Classes', 'Kids engaged in music', 5, 1),
  ('Instrument exploration', '/images/classes/rma-stills-07.jpg', 'Classes', 'Exploring instruments', 6, 1),
  ('Kids on drums', '/images/classes/kids-drums.png', 'Classes', 'Drumming fun', 7, 1),
  ('Jam session', '/images/classes/rma-stills-06.jpg', 'Classes', 'Group jam session', 8, 1),
  ('Music class', '/images/classes/rma-stills-04.jpg', 'Classes', 'Making music', 9, 1),
  ('Dress up day', '/images/classes/dress-up.jpg', 'Classes', 'Costume music class', 10, 1),
  ('Group music', '/images/classes/rma-stills-05.jpg', 'Classes', 'Everyone playing', 11, 1),
  ('Miles rocks', '/images/classes/miles-rocks.jpg', 'Classes', 'Little rockstar', 12, 1),
  ('Why music', '/images/classes/why-music.jpg', 'Classes', 'The joy of music education', 13, 1),
  ('Butterfly concert', '/images/classes/butterfly-concert.jpg', 'Classes', 'Special performance', 14, 1);

-- Parties photos
INSERT INTO photos (title, image_url, category, description, display_order, active) VALUES
  ('Party time', '/images/parties/party-time.jpg', 'Parties', 'Birthday party fun', 20, 1),
  ('Party celebration', '/images/parties/party-4.jpg', 'Parties', 'Kids celebrating with music', 21, 1),
  ('Musical birthday', '/images/parties/party-2.jpg', 'Parties', 'Birthday party entertainment', 22, 1),
  ('Party favorite', '/images/parties/party-fav.jpg', 'Parties', 'Best party moments', 23, 1),
  ('Party jam', '/images/parties/party-3.jpg', 'Parties', 'Party jam session', 24, 1);
