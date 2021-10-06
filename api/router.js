const faker = require("faker");
const { Router } = require("express");
const { propEq, pick, keys, takeLast, complement, values, uniq } = require("ramda");
const { Either } = require("ramda-fantasy");
const { Random } = require("random-js");

const { isBlank, isPresent } = require("./utils");
const { buildUser } = require("./factories");

const findCommentByUUID = comments => uuid => {
  return values(comments).flat().find(propEq("uuid", uuid));
};

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

const requireCommentByUUID = comments => uuid => {
  const comment = findCommentByUUID(comments)(uuid);

  if (isBlank(comment)) {
    return Either.Left({
      status: 404,
      type: "comment_not_found",
      error: "Comment not found",
      uuid,
    });
  }

  return Either.of(comment);
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
      type: "random_error",
      error: "Random error",
      src: "https://github.com/tagview/taggram/blob/main/API.md#aten%C3%A7%C3%A3o-warning"
    });
  }

  return Either.of();
};

const build = ({ posts, users, comments, commentLimit, successRate }) => {
  const router = Router();
  const likes = {};

  const buildComment = username => comment => {
    const commentLikes = likes[comment.uuid] || [];
    const hasLiked = !!commentLikes.find(item => item === username);

    return { ...comment, has_liked: hasLiked, like_count: commentLikes.length };
  };

  const buildPost = username => post => {
    const postComments = comments[post.uuid] || [];

    return { ...post, comments: postComments.map(buildComment(username)) };
  };

  router.get("/me", (req, res) => {
    const user = faker.random.arrayElement(users);

    res.json(user);
  });

  router.get("/post", (req, res) => {
    const { username } = req.query;
    const post = faker.random.arrayElement(posts);

    requireUserByUsername(users)(username)
      .either(
        error => res.status(error.status).json(error),
        () => res.json(buildPost(username)(post))
      );
  });

  router.get("/posts/:uuid/related", (req, res) => {
    const { uuid } = req.params;

    requirePostByUUID(posts)(uuid)
      .either(
        error => res.status(error.status).json(error),
        () => {
          const relatedPosts = faker.random.arrayElements(posts, 6).filter(complement(propEq("uuid", uuid)));
          const postsWithComments = relatedPosts.map(post => {
            const postComments = comments[post.uuid] || [];

            return { ...pick(['uuid', 'photo'], post), comment_count: postComments.length };
          });

          res.json(postsWithComments);
        }
      );
  });

  router.post("/comments/:uuid/like", (req, res) => {
    const { uuid } = req.params;
    const { username } = req.body;
    const { force } = req.query;

    const forceSuccess = /true/i.test(force);

    failRandomly(forceSuccess ? 1 : successRate)
      .chain(() => requireCommentByUUID(comments)(uuid))
      .chain(() => requireFields({ username }))
      .chain(() => requireUserByUsername(users)(username))
      .either(
        error => res.status(error.status).json(error),
        () => {
          const commentLikes = likes[uuid] || [];
          const comment = findCommentByUUID(comments)(uuid);

          likes[uuid] = uniq([...commentLikes, username]);

          res.json(buildComment(username)(comment));
        }
      );
  });

  router.post("/comments/:uuid/unlike", (req, res) => {
    const { uuid } = req.params;
    const { username } = req.body;
    const { force } = req.query;

    const forceSuccess = /true/i.test(force);

    failRandomly(forceSuccess ? 1 : successRate)
      .chain(() => requireCommentByUUID(comments)(uuid))
      .chain(() => requireFields({ username }))
      .chain(() => requireUserByUsername(users)(username))
      .either(
        error => res.status(error.status).json(error),
        () => {
          const commentLikes = likes[uuid] || [];
          const comment = findCommentByUUID(comments)(uuid);

          likes[uuid] = commentLikes.filter(item => item !== username);

          res.json(buildComment(username)(comment));
        }
      );
  });

  return router;
};

module.exports = build;
