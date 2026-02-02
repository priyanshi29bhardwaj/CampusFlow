require('dotenv').config();
const { Pool } = require('pg');

async function seedEvents() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set in .env file');
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔄 Connecting to database...');
    await pool.query('SELECT NOW()');
    console.log('✅ Connected to database');

    // Get clubs and venues
    const clubsResult = await pool.query('SELECT id, name FROM clubs ORDER BY name');
    const venuesResult = await pool.query('SELECT id, name FROM venues ORDER BY name');
    
    const clubs = clubsResult.rows;
    const venues = venuesResult.rows;

    if (clubs.length === 0 || venues.length === 0) {
      console.error('❌ No clubs or venues found. Please run seed-clubs and init-db first.');
      await pool.end();
      process.exit(1);
    }

    // Get a dummy user for created_by (or create one if none exists)
    let dummyUser = await pool.query('SELECT id FROM users LIMIT 1');
    if (dummyUser.rows.length === 0) {
      // Create a dummy admin user
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const userResult = await pool.query(
        `INSERT INTO users (email, password_hash, first_name, last_name, role)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        ['admin@campusflow.edu', hashedPassword, 'Admin', 'User', 'admin']
      );
      dummyUser = userResult;
    }

    const createdBy = dummyUser.rows[0].id;

    // Define events for each club
    const eventsToSeed = [
      // IEEE - Technical Club
      {
        clubName: 'IEEE',
        events: [
          {
            name: 'Tech Innovation Summit 2025',
            description: 'Join us for a day of cutting-edge technology presentations, workshops, and networking opportunities with industry leaders.',
            venueName: 'SHARDA PAI AUDITORIUM',
            startTime: new Date('2025-12-15T10:00:00'),
            endTime: new Date('2025-12-15T17:00:00'),
            capacity: 300,
            registrationFee: 500,
            category: 'Conference',
            posterUrl: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop'
          },
          {
            name: 'IoT Workshop Series',
            description: 'Hands-on workshop on Internet of Things development. Learn to build smart devices and connect them to the cloud.',
            venueName: 'TMA PAI AUDITORIUM',
            startTime: new Date('2025-12-20T14:00:00'),
            endTime: new Date('2025-12-20T18:00:00'),
            capacity: 150,
            registrationFee: 300,
            category: 'Workshop',
            posterUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop'
          },
          {
            name: 'Hackathon 2025',
            description: '48-hour coding competition. Build innovative solutions and win exciting prizes!',
            venueName: 'VASANTI PAI AUDITORIUM',
            startTime: new Date('2025-12-25T09:00:00'),
            endTime: new Date('2025-12-27T17:00:00'),
            capacity: 200,
            registrationFee: 750,
            category: 'Competition',
            posterUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&h=400&fit=crop'
          }
        ]
      },
      // ACM - Technical Club
      {
        clubName: 'ACM',
        events: [
          {
            name: 'Algorithm Design Masterclass',
            description: 'Advanced algorithms and data structures workshop for competitive programming enthusiasts.',
            venueName: 'SHARDA PAI AUDITORIUM',
            startTime: new Date('2025-12-18T10:00:00'),
            endTime: new Date('2025-12-18T16:00:00'),
            capacity: 250,
            registrationFee: 400,
            category: 'Workshop',
            posterUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop'
          },
          {
            name: 'AI & Machine Learning Conference',
            description: 'Explore the latest trends in AI and ML with expert speakers and hands-on sessions.',
            venueName: 'VASANTI PAI AUDITORIUM',
            startTime: new Date('2025-12-22T09:00:00'),
            endTime: new Date('2025-12-22T17:00:00'),
            capacity: 400,
            registrationFee: 600,
            category: 'Conference',
            posterUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop'
          },
          {
            name: 'Code Sprint Challenge',
            description: 'Fast-paced coding competition. Solve problems and climb the leaderboard!',
            venueName: 'TMA PAI AUDITORIUM',
            startTime: new Date('2025-12-28T10:00:00'),
            endTime: new Date('2025-12-28T15:00:00'),
            capacity: 180,
            registrationFee: 250,
            category: 'Competition',
            posterUrl: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=400&fit=crop'
          }
        ]
      },
      // CACTUS - Fashion Club
      {
        clubName: 'CACTUS',
        events: [
          {
            name: 'Fashion Show 2025',
            description: 'Annual fashion showcase featuring student designers. Experience creativity and style!',
            venueName: 'VASANTI PAI AUDITORIUM',
            startTime: new Date('2025-12-16T18:00:00'),
            endTime: new Date('2025-12-16T21:00:00'),
            capacity: 450,
            registrationFee: 800,
            category: 'Exhibition',
            posterUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=400&fit=crop'
          },
          {
            name: 'Sustainable Fashion Workshop',
            description: 'Learn about eco-friendly fashion practices and upcycling techniques.',
            venueName: 'SHARDA PAI AUDITORIUM',
            startTime: new Date('2025-12-19T14:00:00'),
            endTime: new Date('2025-12-19T17:00:00'),
            capacity: 100,
            registrationFee: 350,
            category: 'Workshop',
            posterUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&h=400&fit=crop'
          },
          {
            name: 'Design Portfolio Review',
            description: 'Get feedback on your fashion design portfolio from industry professionals.',
            venueName: 'TMA PAI AUDITORIUM',
            startTime: new Date('2025-12-23T11:00:00'),
            endTime: new Date('2025-12-23T15:00:00'),
            capacity: 80,
            registrationFee: 200,
            category: 'Seminar',
            posterUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&h=400&fit=crop'
          }
        ]
      },
      // CINEFELIA - Drama Club
      {
        clubName: 'CINEFELIA',
        events: [
          {
            name: 'Annual Drama Festival',
            description: 'Three-day drama festival featuring student performances, workshops, and competitions.',
            venueName: 'VASANTI PAI AUDITORIUM',
            startTime: new Date('2025-12-17T10:00:00'),
            endTime: new Date('2025-12-19T22:00:00'),
            capacity: 500,
            registrationFee: 1000,
            category: 'Social',
            posterUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&h=400&fit=crop'
          },
          {
            name: 'Acting Masterclass',
            description: 'Intensive acting workshop with professional theater directors and actors.',
            venueName: 'SHARDA PAI AUDITORIUM',
            startTime: new Date('2025-12-21T13:00:00'),
            endTime: new Date('2025-12-21T18:00:00'),
            capacity: 120,
            registrationFee: 450,
            category: 'Workshop',
            posterUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&h=400&fit=crop'
          },
          {
            name: 'Film Screening & Discussion',
            description: 'Watch award-winning films and participate in post-screening discussions.',
            venueName: 'TMA PAI AUDITORIUM',
            startTime: new Date('2025-12-24T19:00:00'),
            endTime: new Date('2025-12-24T22:00:00'),
            capacity: 280,
            registrationFee: 150,
            category: 'Social',
            posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=400&fit=crop'
          }
        ]
      },
      // LITMUS - Literature Club
      {
        clubName: 'LITMUS',
        events: [
          {
            name: 'Poetry Slam 2025',
            description: 'Express yourself through poetry! Open mic and competitive poetry slam event.',
            venueName: 'SHARDA PAI AUDITORIUM',
            startTime: new Date('2025-12-14T16:00:00'),
            endTime: new Date('2025-12-14T20:00:00'),
            capacity: 200,
            registrationFee: 100,
            category: 'Social',
            posterUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop'
          },
          {
            name: 'Creative Writing Workshop',
            description: 'Learn storytelling techniques, character development, and narrative structure.',
            venueName: 'TMA PAI AUDITORIUM',
            startTime: new Date('2025-12-26T10:00:00'),
            endTime: new Date('2025-12-26T14:00:00'),
            capacity: 60,
            registrationFee: 300,
            category: 'Workshop',
            posterUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=400&fit=crop'
          },
          {
            name: 'Book Club Meeting',
            description: 'Monthly book discussion on contemporary literature. This month: "The Midnight Library"',
            venueName: 'VASANTI PAI AUDITORIUM',
            startTime: new Date('2025-12-29T15:00:00'),
            endTime: new Date('2025-12-29T17:00:00'),
            capacity: 50,
            registrationFee: 0,
            category: 'Social',
            posterUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&h=400&fit=crop'
          }
        ]
      },
      // APERTURE - Photography Club
      {
        clubName: 'APERTURE',
        events: [
          {
            name: 'Photography Exhibition',
            description: 'Showcase of student photography work. Vote for your favorite photos!',
            venueName: 'VASANTI PAI AUDITORIUM',
            startTime: new Date('2025-12-13T10:00:00'),
            endTime: new Date('2025-12-15T18:00:00'),
            capacity: 300,
            registrationFee: 0,
            category: 'Exhibition',
            posterUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b2449f89?w=800&h=400&fit=crop'
          },
          {
            name: 'Portrait Photography Workshop',
            description: 'Learn professional portrait photography techniques and lighting setups.',
            venueName: 'SHARDA PAI AUDITORIUM',
            startTime: new Date('2025-12-27T11:00:00'),
            endTime: new Date('2025-12-27T16:00:00'),
            capacity: 40,
            registrationFee: 500,
            category: 'Workshop',
            posterUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&h=400&fit=crop'
          },
          {
            name: 'Photo Walk & Competition',
            description: 'Guided photo walk around campus followed by a photography competition.',
            venueName: 'TMA PAI AUDITORIUM',
            startTime: new Date('2025-12-30T08:00:00'),
            endTime: new Date('2025-12-30T12:00:00'),
            capacity: 100,
            registrationFee: 200,
            category: 'Competition',
            posterUrl: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=400&fit=crop'
          }
        ]
      }
    ];

    console.log('🔄 Seeding events...');
    let totalEvents = 0;

    for (const clubData of eventsToSeed) {
      const club = clubs.find(c => c.name === clubData.clubName);
      if (!club) {
        console.log(`   ⚠️  Club ${clubData.clubName} not found, skipping...`);
        continue;
      }

      for (const eventData of clubData.events) {
        // Find venue by name if venueName is provided, otherwise use venueIndex
        let venue;
        if (eventData.venueName) {
          venue = venues.find((v) => v.name.toUpperCase() === eventData.venueName.toUpperCase());
          if (!venue) {
            console.log(`   ⚠️  Venue ${eventData.venueName} not found for ${eventData.name}, using first venue`);
            venue = venues[0];
          }
        } else {
          venue = venues[eventData.venueIndex] || venues[0]; // Fallback to first venue
        }
        
        await pool.query(
          `INSERT INTO events (name, description, club_id, venue_id, start_time, end_time, capacity, registration_fee, payment_qr_code, created_by)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
           ON CONFLICT DO NOTHING`,
          [
            eventData.name,
            eventData.description,
            club.id,
            venue.id,
            eventData.startTime.toISOString(),
            eventData.endTime.toISOString(),
            eventData.capacity,
            eventData.registrationFee,
            eventData.posterUrl || null,
            createdBy
          ]
        );
        console.log(`   ✅ Created: ${eventData.name} for ${clubData.clubName}`);
        totalEvents++;
      }
    }

    console.log(`✅ Successfully seeded ${totalEvents} events!`);
    await pool.end();
  } catch (error) {
    console.error('❌ Error seeding events:', error.message);
    console.error('Error details:', error);
    await pool.end();
    process.exit(1);
  }
}

seedEvents();

