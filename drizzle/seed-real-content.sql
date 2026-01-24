-- Real Content Seed for Rocky Mountain Aardvarks
-- Source: Website analysis and Hank's existing content

-- Clear existing data
DELETE FROM testimonials;
DELETE FROM teachers;
DELETE FROM locations;
DELETE FROM page_content;
DELETE FROM photos;

-- Teachers (real bios from website)
INSERT INTO teachers (name, bio, image_url, active, display_order) VALUES
('Hank Williams', 'Director of Awesomeness since 2019. Hank''s interest in music began as a child in Austin, TX, influenced by Stevie Ray and Jimmy Vaughn. He started performing at age 15 in a country band and now fronts Odessa Rose, a Denver-based Americana Swing band. Teaching since 2003, Hank lives in the Regis neighborhood with his wife, three children, and cat named Otis Redding.', '/images/teachers/hank.jpg', 1, 1),
('Brian Hartman', 'Brian started piano and singing at age 6 in Kansas, performing in churches and theaters. He played the Scarecrow in his high school''s Wizard of Oz production. After studying theater and music in college, he picked up guitar and has lived in Tokyo, Austin, and Washington DC. He joined RMA in 2012 as guitar accompanist and also does freelance photography and writing.', '/images/teachers/brian.jpg', 1, 2);

-- Locations (real addresses)
INSERT INTO locations (name, address, lat, lng) VALUES
('Cherry Creek Dance', '2625 E. 3rd Ave., Denver, CO 80206', 39.7189, -104.9538),
('Washington Park', '790 S. Corona St., Denver, CO 80209 (Epiphany Lutheran Church)', 39.7005, -104.9785),
('Cherry Hills/University', '3021 S University Blvd, Denver, CO 80210 (Family Care Collective)', 39.6501, -104.9614);

-- Testimonials (celebrity and parent quotes)
INSERT INTO testimonials (author, quote, source, stars, active) VALUES
-- Celebrity testimonials
('Jon Stewart', 'You will listen to the music... even when your kids are not around. And unlike some other children''s selections, it will not make you angry.', 'Celebrity Endorsement', 5, 1),
('Helen Hunt', 'My daughter loves these songs...', 'Celebrity Endorsement', 5, 1),
('Page McConnell (Phish)', 'It''s real music - the songs are so good!', 'Celebrity Endorsement', 5, 1),
('Time Out NY Kids', 'It''s no exaggeration to say that Weinstone has changed the musical geography of kids music. As creator of the MFA classes that take place all over the country, his music has gotten thousands of tiny toes tapping.', 'Publication Review', 5, 1),
-- Parent testimonials
('Sarah M.', 'Great entertainment for kids of all ages - from infants to 5 years old. Hank was amazing!', 'Birthday Party', 5, 1),
('Jennifer K.', 'The flexibility and responsiveness during planning was incredible. Highly recommend!', 'Birthday Party', 5, 1),
('Mike T.', 'Engaging and energetic instructors. The kids loved playing the instruments!', 'Birthday Party', 5, 1),
('Amanda R.', 'Parents enjoyed it as much as the kids! The Music for Aardvarks CD was a great gift for guests.', 'Birthday Party', 5, 1),
('Local Parent', 'We''ve been coming to RMA for 3 years and my kids still get excited every week. The music is genuinely good - not annoying kid music!', 'Regular Class', 5, 1);

-- Page Content (About/Our Story)
INSERT INTO page_content (slug, title, content) VALUES
('our-story', 'Our Story', '# Rocky Mountain Aardvarks

Rocky Mountain Aardvarks (RMA) is the Colorado branch of a groovy family with its roots in Brooklyn, NY. RMA founder, Janet Casson, taught Music For Aardvarks and Other Mammals in New York. When she moved out West in May 2011, she brought the wacky and wonderful program to share with families of the Mile High City.

Since its first session in the summer of 2011, RMA has grown to include Music for Aardvarks classes for infants, toddlers and preschool-aged kids.

## Our Leadership

When Janet moved from Denver in the summer of 2015, Hank Williams was brought in with a new crop of teachers to carry the torch that Janet had lit. Hank became the Director of Awesomeness in 2019 and will continue to play hard for all the front range families at classes, parties, and concerts!

## Our Philosophy

This program brings a smart and silly, educational and entertaining, insightful and playful alternative to the Denver/Boulder kids'' music scene. A vibrant music selection helps instill an appreciation and understanding of melody and rhythm that will linger long after the last note is played.

We make it fun - not only for children, but adults as well - by sharing original songs about the trials and tribulations of being a kid, getting to know the world around us and looking at the familiar in a new way.

We''re not just about entertaining, though that will help the learning sink in deeper. And we''re not just about the education, though learning is fun! The songs are original, the vibe is funky, and the time you''ll have is a rockin'' good one!'),

('our-classes', 'Our Classes', '# Music For Aardvarks

## About the Program

Created in 1997 in Brooklyn, NY by David Weinstone (rock musician, composer, and father of three), Music For Aardvarks now has locations across the country and internationally. Our songs are featured daily on Nick Jr. TV, with 16 original albums and over 250 songs.

## Age Range

Our classes welcome children from three months to five years old.

## What We Do

- Singing and dancing
- Musical storytelling
- Instrumental jam sessions
- Instrument exploration
- Sing-a-longs with shakers and live guitars
- Dancing with colorful scarves
- Various movement activities

## Musical Styles

Rock, blues, ballads, folk, jazz, and pop influences - real music that parents enjoy too!

## What Makes Us Different

All classes are based around original songs, rhythms, and chants. Our songs reflect modern children''s lives, including urban experiences. We use different musical genres, tempos, and key signatures.

Participants receive a new Music for Aardvarks digital download each session. You can take classes for many years without repeating songs!

## Educational Benefits

- Improves balance and coordination
- Introduces social skills in group play environment
- Promotes fun association with music

Our classes offer an informal, spirited, interactive musical experience for the whole family.'),

('parties', 'Birthday Parties', '# Parties That ROCK!

## In-Home Birthday Parties

We bring the party to you! Our birthday party package includes:

- Up to 20 children
- 45 minutes of in-home musical playtime and entertainment
- All instruments and musical props provided
- Mix of Music for Aardvarks songs, kids'' classics, and kid-friendly rock-n-roll

Even families not familiar with Rocky Mountain Aardvarks classes can sing along!

## What Parents Say

"Great entertainment for various age groups - from infants to 5 years!"

"The kids loved playing the instruments and the interactive experience."

"Parents enjoyed it as much as the kids!"

Contact Hank at 720-515-VARK (8275) or hank@rockymtnaardvarks.com to book your party!'),

('policies', 'Policies & Pricing', '# Class Policies

## Session Information

- Sessions run 7 weeks
- Classes are 40-45 minutes
- Digital Download: Registered families receive a digital download code for original Aardvarks songs

## Enrollment Policies

- **Refunds**: Full refunds available until session start date, no refunds after
- **Class Cancellation**: Classes cancelled 3 days prior if minimum enrollment not met
- **Weather Cancellations**: May occur, make-up classes not guaranteed
- **Make-up Classes**: Available within semester, don''t roll over
- **Drop-in Fees**: $15 for siblings of registered families, $30 for others with reservations

## Sibling Policy

Siblings under 6 months attend for FREE!

## Contact

Questions? Contact Hank at 720-515-VARK (8275) or hank@rockymtnaardvarks.com');

-- Photos for gallery
INSERT INTO photos (title, image_url, category, description, display_order, active) VALUES
('Class in Action', '/images/classes/rma-stills-01.jpg', 'Classes', 'Kids jamming with instruments', 1, 1),
('Musical Fun', '/images/classes/rma-stills-02.jpg', 'Classes', 'Group music session', 2, 1),
('Singing Along', '/images/classes/rma-stills-03.jpg', 'Classes', 'Children singing together', 3, 1),
('Instrument Time', '/images/classes/rma-stills-04.jpg', 'Classes', 'Exploring instruments', 4, 1),
('Dance Party', '/images/classes/rma-stills-05.jpg', 'Classes', 'Movement and dance', 5, 1),
('Happy Faces', '/images/classes/rma-stills-06.jpg', 'Classes', 'Joyful music making', 6, 1),
('Butterfly Concert', '/images/classes/butterfly-concert.jpg', 'Events', 'Special butterfly themed concert', 7, 1),
('Dress Up Day', '/images/classes/dress-up.jpg', 'Classes', 'Costume day fun', 8, 1),
('Happy Kid', '/images/classes/happy-kid.jpg', 'Classes', 'Pure joy', 9, 1),
('Miles Rocks', '/images/classes/miles-rocks.jpg', 'Classes', 'Rocking out', 10, 1),
('Party Time', '/images/parties/party-fav.jpg', 'Parties', 'Birthday party fun', 11, 1),
('Party Celebration', '/images/parties/party-2.jpg', 'Parties', 'Celebrating with music', 12, 1),
('Party Group', '/images/parties/party-3.jpg', 'Parties', 'Group party photo', 13, 1),
('Party Music', '/images/parties/party-4.jpg', 'Parties', 'Musical birthday celebration', 14, 1);
