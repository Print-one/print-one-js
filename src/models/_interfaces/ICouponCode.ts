export type ICouponCode = {
  id: string;
  couponId: string;
  code: string;
  used: boolean;
  usedAt: null | Date;
  orderId: null | string;
};
