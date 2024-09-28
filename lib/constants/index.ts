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
    name: 'Free',
    icon: 'person',
    price: 0,
    credits: 10,
    inclusions: [
      {
        label: '10 Free Coins',
        isIncluded: true,
      },
      {
        label: 'Maximum of 4 Listings',
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
    icon: 'shop',
    price: 120,
    credits: 120,
    inclusions: [
      {
        label: 'Additional 120 Coins',
        isIncluded: true,
      },
      {
        label: 'Maximum of 33 Listings',
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
    isPopular: true,
  },
  {
    _id: 3,
    name: 'Entreprise',
    icon: 'building',
    price: 'Custom',
    credits: 'Custom',
    inclusions: [
      {
        label: 'Coins: As Much As You Need',
        isIncluded: true,
      },
      {
        label: 'Unlimited Number of Listings',
        isIncluded: true,
      },
      {
        label: 'Dedicated Customer Support',
        isIncluded: true,
      },
      {
        label: 'Priority Updates & Beta Features',
        isIncluded: true,
      },
    ],
    isPopular: false,
  },
];
