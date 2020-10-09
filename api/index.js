const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const faker = require("faker");
const fs = require("fs").promises;
const http = require("http");
const path = require("path");
const { prop, takeLast } = require("ramda");
const { Maybe } = require("ramda-fantasy");

const { buildComment } = require("./factories");
const buildRouter = require("./router");
const { parseInt10 } = require("./utils");

const port = process.env.PORT || 3000;

const seedingInterval = Maybe(process.env.SEEDING_INTERVAL)
  .map(parseInt10)
  .getOrElse(5 * 60 * 1000);

const commentLimit = Maybe(process.env.COMMENT_LIMIT)
  .map(parseInt10)
  .getOrElse(50);

const successRate = Maybe(process.env.SUCCESS_RATE)
  .map(parseFloat)
  .getOrElse(2 / 3);

const postsFile = path.resolve(__dirname, "./data/posts.json");

const run = async () => {
  const app = express();

  const data = await fs.readFile(postsFile, "utf8");
  const posts = JSON.parse(data);
  const users = posts.map(prop("user"));
  const comments = {};
  const context = { posts, users, comments, commentLimit, successRate };

  app.use(cors());
  app.use(bodyParser.json());
  app.use("/", buildRouter(context));

  setInterval(() => {
    posts.forEach(post => {
      const user = faker.random.arrayElement(users);
      const comment = buildComment({ user, created_at: new Date() });
      const postComments = comments[post.uuid] || [];

      comments[post.uuid] = takeLast(commentLimit, [...postComments, comment]);
    });
  }, seedingInterval);

  http
    .createServer(app)
    .listen(port, () => console.log("App listening on port", port));
};

run();
