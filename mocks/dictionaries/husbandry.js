const husbandry = [
  {
    _id: '5d07ef5757a44407c6bd2c12',
    name: 'Коровник',
    cost: [0, 500, 10000],
    playerLevel: [
      '5d0e01ccba7c25e6d599db48',
      '5d0e04a2b8319e2b84ee19d8',
      '5d0e0c56f5508c28e19f3500'
    ],
    experience: [0, 1800, 3200],
    animalCost: [
      { cost: [30, 40, 50] },
      { cost: [800, 1200, 1500] },
      { cost: [2500, 4000, 8000] }
    ],
    buildTime: [0, 16 * 60 * 60 * 1000, 48 * 60 * 60 * 1000],
    defaultAnimalsCount: 3,
    maxBuildings: 3,
    linkAnimal: '5d07ef5757a33507c6bd2c12'
  }
];

module.exports = husbandry;
