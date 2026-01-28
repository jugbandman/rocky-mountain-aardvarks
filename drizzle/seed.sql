-- Rocky Mountain Aardvarks - Seed Data
-- Content sourced from existing rockymtnaardvarks.com and related sites

-- Clear existing data
DELETE FROM testimonials;
DELETE FROM teachers;
DELETE FROM sessions;
DELETE FROM registrations;
DELETE FROM classes;
DELETE FROM locations;
DELETE FROM page_content;

-- =============================================================================
-- TEACHERS
-- =============================================================================

INSERT INTO teachers (name, bio, image_url, active, display_order) VALUES
  (
    'Hank Williams',
    'Director of Awesomeness and owner of Rocky Mountain Aardvarks since 2019. Hank grew up in Austin, Texas surrounded by music, pounding out tunes on the family piano and drum kit from an early age. He started performing at 15 in a country-swing band and began teaching private music lessons in 2003. Hank joined RMA in 2016 and finds inspiration in "the wonder every new student brings" and "the evolving discussion of what music brings to each of us." When not making music with kids, he performs with Odessa Rose, an Americana Swing trio. He lives in the Regis neighborhood with his wife, three children, and their pets.',
    '/images/teachers/hank.jpg',
    1,
    1
  );

-- =============================================================================
-- LOCATIONS (3 currently active)
-- =============================================================================

INSERT INTO locations (name, address, lat, lng) VALUES
  (
    'Cherry Creek Dance',
    '2625 E. 3rd Ave., Denver, CO 80206',
    39.7214,
    -104.9564
  ),
  (
    'Washington Park - Epiphany Lutheran',
    '790 S. Corona St., Denver, CO 80209',
    39.7003,
    -104.9733
  ),
  (
    'Cherry Hills - Family Care Collective',
    '3021 S University Blvd, Denver, CO 80210',
    39.6580,
    -104.9614
  );

-- =============================================================================
-- TESTIMONIALS (from real parent reviews)
-- =============================================================================

INSERT INTO testimonials (quote, author, source, category, stars, active) VALUES
  (
    'Sawyer enjoys the class so much that he looks forward to it each week, picks out special outfits for it, and it''s the one class they take that he really notices if they miss. It''s also fun for parents. If parents were looking for just one class for their family, this should be it. RMA incorporates music, movement, and imaginary play in a fun-loving environment.',
    'Maegan, Sawyer''s Mom',
    'Google',
    'class',
    5,
    1
  ),
  (
    'Music for Aardvarks is not your average kids'' music class: fully engaging, fun, and the music is great! There is never a dull moment, with singing, dancing, and instruments.',
    'Rebecca, Mom of Reuben and Ari',
    'Google',
    'class',
    5,
    1
  ),
  (
    'Rocky Mountain Aardvarks is the best music program for families. We have tried all of the Denver area programs and it''s hands down the most engaging, fun, and entertaining activity to do with the family. The songs grab the interests of our infant, toddler, and both adults.',
    'Ricki, Mom of Cooper and Benjamin',
    'Yelp',
    'class',
    5,
    1
  ),
  (
    'After seeing how much Wyatt enjoys his weekly music class, we decided to book Rocky Mountain Aardvarks for Wyatt''s 2nd birthday party. The party gave the parents an opportunity to relax and enjoy the moments while all of the kids could rock out together.',
    'Wyatt''s Mom',
    'Google',
    'party',
    5,
    1
  ),
  (
    'If I could give 10 stars I would! The music, team and atmosphere they provided was top notch!',
    'Nicole R.',
    'GigSalad',
    'party',
    5,
    1
  ),
  (
    'Hank was amazing with the kids (ages 2-5), provided fun instruments for them to join in, and got them running around.',
    'Cassandra B.',
    'GigSalad',
    'party',
    5,
    1
  ),
  (
    'Not only did my son have such a great time, but all of the kids ages 4 months to 6 years old had a great time jamming out! The highlight was seeing children in music bliss and adults learning how to be childlike again. Every adult commented how much they loved having permission to be a child again.',
    'Birthday Party Parent',
    'Google',
    'party',
    5,
    1
  );

-- =============================================================================
-- CLASSES
-- =============================================================================

INSERT INTO classes (title, description, age_range, duration, price, image_url) VALUES
  (
    'Music for Aardvarks',
    'Our signature class for babies, toddlers, and preschoolers with their grown-ups. Featuring David Weinstone''s original songs spanning rock, blues, ballads, folk, jazz and pop. Each 45-minute class includes singing, dancing, musical storytelling, instrument exploration, and movement activities. Classes are capped at 10 children for an intimate, engaging experience. Digital download of songs included with registration.',
    '3 months - 5 years',
    '45 minutes',
    28000,
    '/images/classes/rma-stills-01.jpg'
  );

-- =============================================================================
-- PAGE CONTENT
-- =============================================================================

INSERT INTO page_content (slug, title, content) VALUES
  (
    'our-story',
    'Our Story',
    '<p>Music for Aardvarks and Other Mammals was created in 1997 in Brooklyn, NY by rock musician/composer and father of three, David Weinstone. The first class launched September 7, 1997 in a Manhattan restaurant basement with six families. David created the program in reaction to "the dearth of cool kid''s music available."</p>

<p>Rocky Mountain Aardvarks was founded by Janet Casson, who taught Music for Aardvarks in New York before moving out West in May 2011 and bringing the program to Denver. Janet left Denver in summer 2015.</p>

<p>Hank Williams was brought in with new teachers in 2015 to carry the torch. He became the "Director of Awesomeness" in 2019 and assumed full ownership, running classes, parties, and concerts throughout the Front Range.</p>

<h3>What Makes Us Different</h3>

<p>All classes are based around David Weinstone''s original songs, not traditional nursery rhymes. The music spans rock, blues, ballads, folk, jazz and pop. Songs reflect real childhood experiences from kids'' perspectives.</p>

<p>With 16 original CDs and over 250 songs in the catalog, families can take classes for years without hearing the same songs. The program has been featured daily on Nick Jr. TV and covered in Time Magazine, The New York Times, and The New York Daily News.</p>

<h3>Awards</h3>

<p>Colorado Parent Magazine "Best Parent-Tot Class" (readers'' choice) for 4 consecutive years. 2022 Colorado Parent Family Favorites winner in the "Tot Music Class" category.</p>'
  ),
  (
    'refund-policy',
    'Refund Policy',
    '<h3>Refund Policy</h3>
<ul>
<li><strong>Before session start:</strong> Full refund available</li>
<li><strong>Within first two weeks:</strong> 50% refund</li>
<li><strong>After two weeks:</strong> No refunds</li>
</ul>

<h3>Makeup Classes</h3>
<p>Unlimited makeups for missed classes within the same semester. Makeups do NOT carry over to the next semester. Weather-related cancellations may occur without guaranteed makeups.</p>

<h3>Class Cancellation</h3>
<p>Classes require minimum enrollment. Classes may be cancelled 3 days prior if minimum is not met. Families will be offered alternative classes.</p>

<h3>Trial Classes</h3>
<p>One single-use free trial class per family.</p>

<h3>Safety & Liability</h3>
<p>Parents/guardians are responsible for supervising their child at all times. You must intervene if your child could hurt themselves or others. RMA is not responsible for injury or loss of property.</p>'
  ),
  (
    'give-it-back',
    'GIVE IT BACK Program',
    '<p>The GIVE IT BACK program was established by Music for Aardvarks creator David Weinstone.</p>

<p>Two free spots are available each semester for families experiencing financial hardship. No questions asked, first come first served.</p>

<p>Email Hank at hank@rockymtnaardvarks.com to apply.</p>'
  );
