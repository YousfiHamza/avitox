export const LOCATIONS = [
  'Casablanca',
  'Rabat',
  'Fes',
  'Tangier',
  'Marrakesh',
  'Agadir',
  'Meknes',
  'Oujda',
  'Kenitra',
  'Tetouan',
];

export const CATEGORIESMAP = {
  DOG: ['LABRADOR', 'BULLDOG', 'PUG'],
  CAT: ['PERSIAN', 'BIRMAN', 'EXOTIC'],
  BIRD: ['PIGEON', 'CANARY', 'PARROT'],
};

export const PLANS = [
  {
    _id: 1,
    name: 'free',
    icon: '/icons/coins.svg',
    price: 0,
    credits: 20,
    inclusions: [
      {
        label: '20 Free Credits',
        isIncluded: true,
      },
      {
        label: 'Basic Access to Services',
        isIncluded: true,
      },
      {
        label: 'Priority Customer Support',
        isIncluded: false,
      },
      {
        label: 'Priority Updates',
        isIncluded: false,
      },
    ],
    isPopular: false,
  },
  {
    _id: 2,
    name: 'Small Business',
    icon: '/icons/coins.svg',
    price: 40,
    credits: 120,
    inclusions: [
      {
        label: '120 Credits',
        isIncluded: true,
      },
      {
        label: 'Full Access to Services',
        isIncluded: true,
      },
      {
        label: 'Priority Customer Support',
        isIncluded: true,
      },
      {
        label: 'Priority Updates',
        isIncluded: false,
      },
    ],
    isPopular: true,
  },
  {
    _id: 3,
    name: 'Entreprise',
    icon: '/icons/coins.svg',
    price: 199,
    credits: 2000,
    inclusions: [
      {
        label: '2000 Credits',
        isIncluded: true,
      },
      {
        label: 'Full Access to Services',
        isIncluded: true,
      },
      {
        label: 'Priority Customer Support',
        isIncluded: true,
      },
      {
        label: 'Priority Updates',
        isIncluded: true,
      },
    ],
    isPopular: false,
  },
];
