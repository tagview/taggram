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
  uuid: faker.datatype.uuid,
  user: buildUser,
  message: faker.hacker.phrase,
  created_at: () => `${faker.datatype.number({ min: 1, max: 23 })}h`,
});

const buildLocation = createFactory({
  city: faker.address.city,
  country: faker.address.country,
});

const buildPost = createFactory({
  uuid: faker.datatype.uuid,
  user: buildUser,
  photo: (width = 800, height = 800) => `https://picsum.photos/seed/${faker.datatype.uuid()}/${width}/${height}`,
  created_at: () => {
    const random = faker.date.past();
    const date = `${random.getDate()}/${random.getMonth() + 1}/${random.getFullYear()}`;
    const time = `${random.getHours()}:${random.getMinutes()}`;

    return `${date} - ${time}`;
  },
  location: buildLocation,
});

module.exports = {
  buildUser,
  buildComment,
  buildPost,
  buildLocation,
};
