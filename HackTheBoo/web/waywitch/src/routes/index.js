const express = require("express");
const router = express.Router({ caseSensitive: true });
const { getUsernameFromToken } = require("../util");

let db;

const response = (data) => ({ message: data });

router.get("/", (req, res) => {
  return res.render("index.html");
});

router.get("/tickets", async (req, res) => {
  const sessionToken = req.cookies.session_token;

  if (!sessionToken) {
    return res.status(401).json(response("No session token provided"));
  }

  try {
    const username = getUsernameFromToken(sessionToken);

    if (username === "admin") {
      try {
        const tickets = await db.get_tickets();
        return res.status(200).json({ tickets });
      } catch (err) {
        return res
          .status(500)
          .json(response("Error fetching tickets: " + err.message));
      }
    } else {
      return res
        .status(403)
        .json(response("Access denied. Admin privileges required."));
    }
  } catch (err) {
    return res.status(400).json(response(err.message));
  }
});

router.post("/submit-ticket", async (req, res) => {
  const sessionToken = req.cookies.session_token;

  if (!sessionToken) {
    return res.status(401).json(response("No session token provided"));
  }

  let username;
  try {
    username = getUsernameFromToken(sessionToken);
  } catch (err) {
    return res.status(400).json(response(err.message));
  }

  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json(response("Name and description are required"));
  }

  try {
    await db.add_ticket(name, username, description);
    return res.status(200).json(response("Ticket submitted successfully"));
  } catch (err) {
    return res
      .status(500)
      .json(response("Error submitting ticket: " + err.message));
  }
});

module.exports = (database) => {
  db = database;
  return router;
};
