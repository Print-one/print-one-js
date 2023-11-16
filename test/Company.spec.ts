import { Company } from "../src";
import { Protected } from "../src/PrintOne";
import { ICompany } from "../src/models/_interfaces/ICompany";

it("should return undefined emailVerifiedAt", async function () {
  // arrange
  const company = new Company(
    {} as unknown as Protected,
    {
      emailVerifiedAt: undefined,
    } as ICompany,
  );

  // act
  const result = company.emailVerifiedAt;

  // assert
  expect(result).toBeUndefined();
});
