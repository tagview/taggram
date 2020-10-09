const faker = require("faker");
const { mapObjIndexed } = require("ramda");

const createFactory = builders => (values = {}) =>
  mapObjIndexed(
    (builder, field) => (field in values ? values[field] : builder()),
    builders
  );

const buildUser = createFactory({
  username: faker.internet.userName,
  avatar: faker.internet.avatar,
});

const buildComment = createFactory({
  user: buildUser,
  message: faker.hacker.phrase,
  created_at: faker.date.past,
});

const buildLocation = createFactory({
  city: faker.address.city,
  country: faker.address.country,
});

const buildPost = createFactory({
  uuid: faker.random.uuid,
  user: buildUser,
  photo: () => "https://source.unsplash.com/random/800x800",
  created_at: faker.date.past,
  location: buildLocation,
});

module.exports = {
  buildUser,
  buildComment,
  buildPost,
  buildLocation,
};
