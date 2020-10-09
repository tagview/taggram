const faker = require("faker");
const { Router } = require("express");
const { propEq, pick, merge, keys, takeLast } = require("ramda");
const { Either } = require("ramda-fantasy");
const { Random } = require("random-js");

const { isBlank, isPresent } = require("./utils");

const requirePostByUUID = posts => uuid => {
  const post = posts.find(propEq("uuid", uuid));

  if (isBlank(post)) {
    return Either.Left({
      status: 404,
      type: "post_not_found",
      error: "Post not found",
      uuid,
    });
  }

  return Either.of(post);
};

const requireUserByUsername = users => username => {
  const user = users.find(propEq("username", username));

  if (isBlank(user)) {
    return Either.Left({
      status: 400,
      type: "user_not_found",
      error: "User not found",
      username,
    });
  }

  return Either.of(user);
};

const requireFields = fields => {
  const emptyFields = keys(fields).filter((key) => isBlank(fields[key]));

  if (isPresent(emptyFields)) {
    return Either.Left({
      status: 400,
      type: "missing_property",
      error: `${emptyFields.join(", ")} can't be blank`,
      properties: emptyFields,
    });
  }

  return Either.of(fields);
};

const failRandomly = successRate => {
  const random = new Random();
  const isSuccessful = random.bool(successRate);

  if (!isSuccessful) {
    return Either.Left({
      status: 500,
      type: "unexpected",
      error: "Unexpected error",
    });
  }

  return Either.of();
};

const build = ({ posts, users, comments, commentLimit, successRate }) => {
  const limitComments = takeLast(commentLimit);
  const router = Router();

  router.get("/me", (req, res) => res.json(faker.random.arrayElement(users)));

  router.get("/post", (req, res) => {
    const post = faker.random.arrayElement(posts);

    res.json({
      ...post,
      comments: limitComments(comments[post.uuid] || []),
    });
  });

  router.post("/posts/:uuid/comments", (req, res) => {
    const { username, message } = req.body;
    const { uuid } = req.params;
    const { stable } = req.query;

    const forceSuccess = /true/i.test(stable);

    failRandomly(forceSuccess ? 1 : successRate)
      .chain(() => requirePostByUUID(posts)(uuid))
      .chain(post => requireFields({ username, message }).map(merge({ post })))
      .chain(data => requireUserByUsername(users)(username).map(user => ({ ...data, user })))
      .either(
        error => res.status(error.status).json(error),
        ({ post, user }) => {
          const createdAt = new Date();
          const comment = {
            user,
            message,
            created_at: createdAt.toISOString(),
          };

          const postComments = comments[uuid] || [];

          comments[uuid] = [...postComments, comment];

          res.json(limitComments(comments[uuid]));
        }
      );
  });

  return router;
};

module.exports = build;