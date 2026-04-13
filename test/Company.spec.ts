import { Company } from "~/index";
import { ICompany } from "~/models/_interfaces/ICompany";
import { Protected } from "~/types";

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
