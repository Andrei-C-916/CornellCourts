// server.js

import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Get all games
app.get('/api/games', async (req, res) => {
  try {
    const gamesSnapshot = await db.collection('games').orderBy('createdAt', 'desc').get();
    const games = [];

    gamesSnapshot.forEach((doc) => {
      games.push({ id: doc.id, ...doc.data() });
    });

    res.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

// Create a new game
// Create a new game
app.post('/api/games', async (req, res) => {
  try {
    const { sport, location, time, createdBy } = req.body;

    if (!sport || !location || !time || !createdBy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const gameRef = await db.collection('games').add({
      sport,
      location,
      time,
      createdBy,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      joinedUsers: [createdBy], // Automatically join the creator
    });

    res.status(201).json({ id: gameRef.id, message: 'Game created successfully' });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ error: 'Failed to create game' });
  }
});


// User joins a game
app.post('/api/users/:uid/joinedGames', async (req, res) => {
  try {
    const { uid } = req.params;
    const { gameId } = req.body;

    const userRef = db.collection('users').doc(uid);
    const gameRef = db.collection('games').doc(gameId);

  await db.runTransaction(async (transaction) => {
      transaction.set(
        userRef,
        {
          joinedGames: admin.firestore.FieldValue.arrayUnion(gameId),
        },
        { merge: true }
      );

      transaction.update(gameRef, {
        joinedUsers: admin.firestore.FieldValue.arrayUnion(uid),
      });
    });

    res.status(200).json({ message: 'Game joined successfully' });
  } catch (error) {
    console.error('Error joining game:', error);
    res.status(500).json({ error: 'Failed to join game' });
  }
});

app.post('/api/users/getUsers', async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ error: 'Invalid userIds' });
    }

    const usersData = [];

    const userDocs = await db.getAll(
      ...userIds.map((uid) => db.collection('users').doc(uid))
    );

    userDocs.forEach((doc) => {
      if (doc.exists) {
        const data = doc.data();
        usersData.push({
          uid: doc.id,
          displayName: data.displayName,
          email: data.email,
          photoURL: data.photoURL,
        });
      }
    });

    res.status(200).json(usersData);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user's joined games
app.get('/api/users/:uid/joinedGames', async (req, res) => {
  try {
    const { uid } = req.params;

    const userDoc = await db.collection('users').doc(uid).get();

    if (!userDoc.exists) {
      return res.status(200).json([]);
    }

    const { joinedGames } = userDoc.data();
    const gamesData = [];

    if (joinedGames && joinedGames.length > 0) {
      const gamesSnapshot = await db
        .collection('games')
        .where(admin.firestore.FieldPath.documentId(), 'in', joinedGames)
        .get();

      gamesSnapshot.forEach((doc) => {
        gamesData.push({ id: doc.id, ...doc.data() });
      });
    }

    res.status(200).json(gamesData);
  } catch (error) {
    console.error('Error fetching joined games:', error);
    res.status(500).json({ error: 'Failed to fetch joined games' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
