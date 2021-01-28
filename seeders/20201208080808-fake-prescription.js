'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'prescription',
      // dwellTime: 120,
      // expectedUF: 100,
      // fillVolume: 2000,
      // lastFill: "same",
      // totalCycles: 4,
      [
        {
          dwellTime: 120,
          expectedUF: 100,
          fillVolume: 2000,
          lastFill: 'same',
          totalCycles: 4,
          createdAt: '2020-12-08T08:11:59.157Z',
          updatedAt: '2020-12-08T08:11:59.157Z',
        },
      ],
      {},
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('prescription', null, {});
  },
};
