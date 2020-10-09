const fs = require("fs").promises;
const { times } = require("ramda");
const path = require("path");
const faker = require("faker");

const { buildPost, buildUser } = require("./factories");

const build = async (file, size) => {
  const posts = times(() => {
    const hasAvatar = faker.random.boolean();

    return hasAvatar
      ? buildPost()
      : buildPost({ user: buildUser({ avatar: null }) });
  }, size);

  return await fs.writeFile(file, JSON.stringify(posts, null, "  "));
};

const [file, size] = process.argv.slice(2);
const postFile = file || path.resolve(__dirname, "./data/posts.json");
const postCount = parseInt(size) || 20;

build(postFile, postCount);
