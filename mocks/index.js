const addressStepsMock = [
  {
    required: true,
    stepNum: 0,
    id: '1520793406496',
    initialValue: '5 Rue de Rivoli Paris'
  },
  {
    required: true,
    stepNum: 1,
    id: '1520793406725',
    initialValue: '3 Avenue Anatole France Paris-7E-Arrondissement'
  },
  {
    required: false,
    stepNum: 2,
    id: '1520793406738',
    initialValue: '6 Boulevard Haussmann Paris-9E-Arrondissement'
  },
  {
    required: false,
    stepNum: 3,
    id: '1520793406756',
    initialValue: '5 Rue de Dunkerque Paris'
  }
];

const addressStepsOrdersMock = [0, 1, 2, 3];

const placeMock1 = {
  address: '5 Rue de Rivoli Paris',
  id: 'ChIJN7ithv1x5kcRBEKOU44bvMk',
  inputId: '1520793406496',
  stepNum: 0,
  geometry: {
    lat: 48.8556509,
    lng: 2.35883089999993
  }
};

const placeMock2 = {
  address: '6 Boulevard Haussmann Paris-9E-Arrondissement',
  id: 'ChIJd8y5Qzlu5kcRijTUmkvheew',
  inputId: '1520793406738',
  stepNum: 2,
  geometry: {
    lat: 48.8722972,
    lng: 2.338981800000056
  }
};

const placeMock3 = {
  address: '6 Boulevard Haussmann Paris-9E-Arrondissement',
  id: 'ChIJd8y5Qzlu5kcRijTUmkvheew',
  inputId: '1520793406738',
  stepNum: 2,
  geometry: {
    lat: 48.8722972,
    lng: 2.338981800000056
  }
};

const placeMock4 = {
  address: '5 Rue de Dunkerque Paris',
  id: 'ChIJ270fenJu5kcRV2qNT7_VbF0',
  inputId: '1520793406756',
  stepNum: 3,
  geometry: {
    lat: 48.8791985,
    lng: 2.3580921999999873
  }
};

export {
  addressStepsMock,
  addressStepsOrdersMock,
  placeMock1,
  placeMock2,
  placeMock3,
  placeMock4
};
