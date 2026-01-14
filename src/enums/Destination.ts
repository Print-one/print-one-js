export const Destination: {
  NETHERLANDS: "NETHERLANDS";
  GERMANY: "GERMANY";
  INTERNATIONAL: "INTERNATIONAL";
} = {
  NETHERLANDS: "NETHERLANDS",
  GERMANY: "GERMANY",
  INTERNATIONAL: "INTERNATIONAL",
};

export type Destination = (typeof Destination)[keyof typeof Destination];
