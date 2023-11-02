export const Finish: {
  GLOSSY: "GLOSSY";
  MATTE: "MATTE";
} = {
  GLOSSY: "GLOSSY",
  MATTE: "MATTE",
};

export type Finish = (typeof Finish)[keyof typeof Finish];
