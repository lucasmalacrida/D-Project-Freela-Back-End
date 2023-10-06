import db from "../Database/databaseConnection.js";

export default async function validateAuth(req, res, next) {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.sendStatus(401);

    try {
        const session = await db.query(`SELECT * FROM sessions WHERE token = $1;`, [token]);
        if (session.rowCount === 0) { return res.sendStatus(401) }
        
        res.locals.sessionId = session.rows[0].id;
        res.locals.userId = session.rows[0].userId;
    } catch (err) {
        res.status(500).send(err.message);
    }

    next();
}