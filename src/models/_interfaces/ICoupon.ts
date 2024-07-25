export type ICoupon = {
  id: string;
  name: string;
  companyId: string;
  stats: {
    total: number;
    used: number;
    remaining: number;
  };
};
