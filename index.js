import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';


admin.initializeApp();
const db = admin.firestore();


function colPath(appId, name) {
return `artifacts/${appId}/public/data/${name}`;
}


// Callable function: Secure attendance write
export const writeAttendance = functions.https.onCall(async (data, ctx) => {
if (!ctx.auth) throw new functions.https.HttpsError('unauthenticated', 'Please sign in first');
const { appId, studentId, status, type } = data;
const today = new Date().toISOString().slice(0, 10);
await db.collection(colPath(appId, 'attendance')).add({
studentId,
date: today,
status: status || 'Present',
type: type || 'Manual',
teacherId: ctx.auth.uid,
timestamp: admin.firestore.FieldValue.serverTimestamp(),
});
return { ok: true };
});


// Callable function: Secure CICO submission
export const writeCICO = functions.https.onCall(async (data, ctx) => {
if (!ctx.auth) throw new functions.https.HttpsError('unauthenticated', 'Please sign in first');
const { appId, studentId, mood, note } = data;
const today = new Date().toISOString().slice(0, 10);
await db.collection(colPath(appId, 'cico')).add({
studentId,
date: today,
mood: Number(mood || 0),
note: note || '',
timestamp: admin.firestore.FieldValue.serverTimestamp(),
});
return { ok: true };
});


// Scheduled Function: Nightly leaderboard recalculation
export const recomputeLeaderboard = functions.pubsub
.schedule('0 2 * * *') // Runs daily at 2 AM
.timeZone('Asia/Kolkata')
.onRun(async () => {
const students = await db.collectionGroup('students_data').get();
for (const doc of students.docs) {
const data = doc.data();
const bonus = data.consistencyScore > 90 ? 25 : data.consistencyScore > 75 ? 10 : 0;
const score = (data.points || 0) + bonus;
await doc.ref.update({ leaderboardScore: score });
}
console.log('🏆 Leaderboard scores updated successfully');
return null;
});