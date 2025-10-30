# [1.3.0](https://github.com/shaishab316/getavails-server/compare/v1.2.0...v1.3.0) (2025-10-30)


### Features

* Define Prisma schema for Chat and Message models ([ac88ab7](https://github.com/shaishab316/getavails-server/commit/ac88ab7c03aeb2209f925020d81075452aaffecc))
* Enhance AuthService with OTP, JSDoc, and rate limit changes ([9c35078](https://github.com/shaishab316/getavails-server/commit/9c35078321145e927cfa13c26beebc9ca5f9b43f))
* Implement agent-artist relation deletion and topic metadata optimization ([ffe65fc](https://github.com/shaishab316/getavails-server/commit/ffe65fc465b880fe72440b18746606dd8b0c1f09))
* Implement chat module with create/delete functionalities ([f4a7126](https://github.com/shaishab316/getavails-server/commit/f4a7126f9c4040ecf12bae2a2aaf9e2259ec031b))
* Implement email queuing with Redis and Bull ([5a02498](https://github.com/shaishab316/getavails-server/commit/5a02498a35211e5aee050c21f9b51df9a00fc00e))
* Implement message module with socket integration ([b597628](https://github.com/shaishab316/getavails-server/commit/b597628d848f790d04319220c98e193db60ec865))
* Implement user inbox retrieval with pagination and search ([26fa918](https://github.com/shaishab316/getavails-server/commit/26fa91891c67cebf9e5295c829363fa6b3cc4d13))
* Implement WebSocket handling with Socket.IO ([e9f4547](https://github.com/shaishab316/getavails-server/commit/e9f45473a705e2b14a180aa32842093070a65242))
* Improve user registration and bundle dependencies ([1a8c7ea](https://github.com/shaishab316/getavails-server/commit/1a8c7eadfdb117bfc5845bb40415ecbd2237d9dc))
* Introduce module builder and modernize build process ([8e37f42](https://github.com/shaishab316/getavails-server/commit/8e37f42cac9aa8fe396255e2c149a18c77ad72e4))
* Introduce Venue module and routes, deprecate User venue route ([ae7aa4e](https://github.com/shaishab316/getavails-server/commit/ae7aa4ecdfb636985f0fd9dd9b63b83638a82a38))

# [1.2.0](https://github.com/shaishab316/getavails-server/compare/v1.1.0...v1.2.0) (2025-10-29)


### Features

* Implement agent invitations and artist request processing ([0c2fbca](https://github.com/shaishab316/getavails-server/commit/0c2fbca0044ba8d74507ca2a2034af5d3530d027))
* Implement endpoints for agents/artists to retrieve their lists ([d1d77e1](https://github.com/shaishab316/getavails-server/commit/d1d77e1a461428b1eb3b30da1b2f33c1a145df58))

# [1.1.0](https://github.com/shaishab316/getavails-server/compare/v1.0.0...v1.1.0) (2025-10-28)


### Bug Fixes

* Fix purifyRequest middleware for Express 5 read-only requests ([5444809](https://github.com/shaishab316/getavails-server/commit/54448098935d673ed38af6833b3f32f0b2717904))


### Features

* Add functionality for agents to send requests to artists ([183e944](https://github.com/shaishab316/getavails-server/commit/183e94404f4c87344735087d47baf21f251136f8))
* Enhance auth middleware, refactor user data handling ([64dfd73](https://github.com/shaishab316/getavails-server/commit/64dfd735107b6d3d4bb889512cf527a2e6da28d7))
* Enhance security with rate limiting and update dependencies ([f73de00](https://github.com/shaishab316/getavails-server/commit/f73de006bb26d58f1cbb1bbb79ec43d156491231))
* Enhance security with rate limiting and update dependencies ([2c9767c](https://github.com/shaishab316/getavails-server/commit/2c9767c48d4031967c57c846a228188209ae9d72))
* Implement agent invites and artist approval/rejection ([49310a2](https://github.com/shaishab316/getavails-server/commit/49310a270b1f366ac2ec44653db9ed6f86d7b6d4))
* Implement Agent module and refactor auth route configuration ([1a6d57d](https://github.com/shaishab316/getavails-server/commit/1a6d57da3131e322cbb50611b164123f64351cfc))
* Implement Artist module with retrieval functionalities ([f2b654f](https://github.com/shaishab316/getavails-server/commit/f2b654fb5f3a575983bd63d9239dd63b5de8effb))
* Implement automatic user ID generation ([6f5f6cb](https://github.com/shaishab316/getavails-server/commit/6f5f6cb4037bc5a5458cdcccb2c00c64a76b0b33))
* Introduce Agent module with listing functionality ([c096637](https://github.com/shaishab316/getavails-server/commit/c096637bf140605ec7d4fd2e1ff3d74601379d34))
* Remove Stripe webhook script, add agent-to-artist route ([f12849c](https://github.com/shaishab316/getavails-server/commit/f12849c5610597e61ce4c323fd1a958f3a57967c))

# 1.0.0 (2025-10-27)


### Features

* Allow venue users to update venue information ([bb56d8a](https://github.com/shaishab316/getavails-server/commit/bb56d8ab1369653171735c9faef51989fa966557))
* Enforce required email and default user role on registration ([0a8d03e](https://github.com/shaishab316/getavails-server/commit/0a8d03e8b490f6b8c7d7921701015e09fca14da5))
* Exclude node_modules from esbuild bundle ([cb17fb7](https://github.com/shaishab316/getavails-server/commit/cb17fb79e2a4e2b9900fef38221152857e9920fb))
* Implement account verification via OTP email ([01bfe5b](https://github.com/shaishab316/getavails-server/commit/01bfe5b45ea25cbff1246090b95be62ba4694773))
* Implement agent registration functionality ([9e86d48](https://github.com/shaishab316/getavails-server/commit/9e86d481be37f3f75b7de7f8ec4291d9bf530b2a))
* Implement artist registration functionality ([71f30f6](https://github.com/shaishab316/getavails-server/commit/71f30f626ef453390f43c5c85784268bb80229c2))
* Implement organizer registration functionality ([fa83d8a](https://github.com/shaishab316/getavails-server/commit/fa83d8a272ac975574573a6a97a21d1e343557e3))
* Implement user availability updates via new API endpoint ([e081440](https://github.com/shaishab316/getavails-server/commit/e081440005abc43b6f66381a9a8e512083024eb4)), closes [#11](https://github.com/shaishab316/getavails-server/issues/11)
* Implement Venue module and refactor module builder ([60be295](https://github.com/shaishab316/getavails-server/commit/60be2957de71565b4a3ed882e849f39e586e8618))
* Implement venue registration feature ([d1f5c6d](https://github.com/shaishab316/getavails-server/commit/d1f5c6d044c0f9d7c216731908420cb7d9a48370))
* Integrate database connection and server lifecycle management ([412eb40](https://github.com/shaishab316/getavails-server/commit/412eb40aca140f9dee9c4013cfc1c42c36034627))
* Refactor registration and add venue info endpoint ([46910b1](https://github.com/shaishab316/getavails-server/commit/46910b1b3500ce499a0d18395563c1f0389a8723))
* Refactor registration process to use a single register function ([cfc94e3](https://github.com/shaishab316/getavails-server/commit/cfc94e3a45f164a1107081b1bee372205ca4714c))
* Refactor reset password and update user data handling ([822b29f](https://github.com/shaishab316/getavails-server/commit/822b29fc71bbf38e7ac6496a39f70486db4e9c64))
* Remove OpenAPI/Swagger documentation generation and UI ([3755109](https://github.com/shaishab316/getavails-server/commit/3755109676df848a81cb5c84c30d342d401b12db))
* Remove phone number authentication and user registration ([327fcff](https://github.com/shaishab316/getavails-server/commit/327fcff4e3096c6cdeac2d348806ae1aa371ba73))
* Require email and disable cookie setting for testing ([1f40ba0](https://github.com/shaishab316/getavails-server/commit/1f40ba054118a451fe929e7102af2426f49a69a3))
* Update Docker Compose and Prisma User Omit constants ([a398f70](https://github.com/shaishab316/getavails-server/commit/a398f70c48a195b768cbc7fb4709df99e0654642))
* Update User model and registration with new profile fields ([6be3b90](https://github.com/shaishab316/getavails-server/commit/6be3b905f3931933709e28052114917afe60917c))
* Update User model, remove migrations, and add gitignore rule ([82d8749](https://github.com/shaishab316/getavails-server/commit/82d8749b3716403189912a2865ade8e6a4a6d97c))
* **venue:** allow venues to update their information via API ([22791c0](https://github.com/shaishab316/getavails-server/commit/22791c099f22e34b996f813f5da1215f574b47bc)), closes [#10](https://github.com/shaishab316/getavails-server/issues/10)

# 1.0.0 (2025-10-27)


### Features

* Allow venue users to update venue information ([bb56d8a](https://github.com/Alpha-Bytes-Department/getavails-server/commit/bb56d8ab1369653171735c9faef51989fa966557))
* Enforce required email and default user role on registration ([0a8d03e](https://github.com/Alpha-Bytes-Department/getavails-server/commit/0a8d03e8b490f6b8c7d7921701015e09fca14da5))
* Exclude node_modules from esbuild bundle ([cb17fb7](https://github.com/Alpha-Bytes-Department/getavails-server/commit/cb17fb79e2a4e2b9900fef38221152857e9920fb))
* Implement account verification via OTP email ([01bfe5b](https://github.com/Alpha-Bytes-Department/getavails-server/commit/01bfe5b45ea25cbff1246090b95be62ba4694773))
* Implement agent registration functionality ([9e86d48](https://github.com/Alpha-Bytes-Department/getavails-server/commit/9e86d481be37f3f75b7de7f8ec4291d9bf530b2a))
* Implement artist registration functionality ([71f30f6](https://github.com/Alpha-Bytes-Department/getavails-server/commit/71f30f626ef453390f43c5c85784268bb80229c2))
* Implement organizer registration functionality ([fa83d8a](https://github.com/Alpha-Bytes-Department/getavails-server/commit/fa83d8a272ac975574573a6a97a21d1e343557e3))
* Implement user availability updates via new API endpoint ([e081440](https://github.com/Alpha-Bytes-Department/getavails-server/commit/e081440005abc43b6f66381a9a8e512083024eb4)), closes [#11](https://github.com/Alpha-Bytes-Department/getavails-server/issues/11)
* Implement Venue module and refactor module builder ([60be295](https://github.com/Alpha-Bytes-Department/getavails-server/commit/60be2957de71565b4a3ed882e849f39e586e8618))
* Implement venue registration feature ([d1f5c6d](https://github.com/Alpha-Bytes-Department/getavails-server/commit/d1f5c6d044c0f9d7c216731908420cb7d9a48370))
* Integrate database connection and server lifecycle management ([412eb40](https://github.com/Alpha-Bytes-Department/getavails-server/commit/412eb40aca140f9dee9c4013cfc1c42c36034627))
* Refactor registration and add venue info endpoint ([46910b1](https://github.com/Alpha-Bytes-Department/getavails-server/commit/46910b1b3500ce499a0d18395563c1f0389a8723))
* Refactor registration process to use a single register function ([cfc94e3](https://github.com/Alpha-Bytes-Department/getavails-server/commit/cfc94e3a45f164a1107081b1bee372205ca4714c))
* Refactor reset password and update user data handling ([822b29f](https://github.com/Alpha-Bytes-Department/getavails-server/commit/822b29fc71bbf38e7ac6496a39f70486db4e9c64))
* Remove OpenAPI/Swagger documentation generation and UI ([3755109](https://github.com/Alpha-Bytes-Department/getavails-server/commit/3755109676df848a81cb5c84c30d342d401b12db))
* Remove phone number authentication and user registration ([327fcff](https://github.com/Alpha-Bytes-Department/getavails-server/commit/327fcff4e3096c6cdeac2d348806ae1aa371ba73))
* Require email and disable cookie setting for testing ([1f40ba0](https://github.com/Alpha-Bytes-Department/getavails-server/commit/1f40ba054118a451fe929e7102af2426f49a69a3))
* Update Docker Compose and Prisma User Omit constants ([a398f70](https://github.com/Alpha-Bytes-Department/getavails-server/commit/a398f70c48a195b768cbc7fb4709df99e0654642))
* Update User model and registration with new profile fields ([6be3b90](https://github.com/Alpha-Bytes-Department/getavails-server/commit/6be3b905f3931933709e28052114917afe60917c))
* Update User model, remove migrations, and add gitignore rule ([82d8749](https://github.com/Alpha-Bytes-Department/getavails-server/commit/82d8749b3716403189912a2865ade8e6a4a6d97c))
* **venue:** allow venues to update their information via API ([22791c0](https://github.com/Alpha-Bytes-Department/getavails-server/commit/22791c099f22e34b996f813f5da1215f574b47bc)), closes [#10](https://github.com/Alpha-Bytes-Department/getavails-server/issues/10)
