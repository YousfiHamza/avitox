// ====== USER PARAMS
declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
  photo: string;
  isFirstTime?: boolean;
};

declare type SearchParamProps = {
  params: { id: string; type: TransformationTypeKey };
  searchParams: { [key: string]: string | string[] | undefined };
};

type BuyCoinsParams = {
  plan: string;
  coins: number;
  amount: number;
  buyerId: string;
};

declare type CreateCoinsTransactionParams = {
  stripeId: string;
  amount: number;
  coins: number;
  plan: string;
  buyerId: string;
  createdAt: Date;
};
