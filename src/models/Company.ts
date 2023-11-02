import { ICompany } from "./_interfaces/ICompany";
import { Protected } from "../PrintOne";

export class Company {
  constructor(
    private readonly _protected: Protected,
    private readonly _data: ICompany,
  ) {}

  public get id(): string {
    return this._data.id;
  }

  public get firstName(): string {
    return this._data.firstName;
  }

  public get lastName(): string {
    return this._data.lastName;
  }

  public get email(): string {
    return this._data.email;
  }

  public get invoiceEmail(): string {
    return this._data.invoiceEmail;
  }

  public get financialContactEmail(): string {
    return this._data.financialContactEmail;
  }

  public get financialContactName(): string {
    return this._data.financialContactName;
  }

  public get technicalContactEmail(): string {
    return this._data.technicalContactEmail;
  }

  public get technicalContactName(): string {
    return this._data.technicalContactName;
  }

  public get phoneNumber(): string {
    return this._data.phoneNumber;
  }

  public get companyName(): string {
    return this._data.companyName;
  }

  public get street(): string {
    return this._data.street;
  }

  public get houseNumber(): string {
    return this._data.houseNumber;
  }

  public get country(): string {
    return this._data.country;
  }

  public get postalCode(): string {
    return this._data.postalCode;
  }

  public get city(): string {
    return this._data.city;
  }

  public get cocNumber(): string {
    return this._data.cocNumber;
  }

  public get vatNumber(): string {
    return this._data.vatNumber;
  }

  public get iban(): string {
    return this._data.iban;
  }

  public get canBeBilled(): boolean {
    return this._data.canBeBilled;
  }

  public get createdAt(): Date {
    return new Date(this._data.createdAt);
  }

  public get updatedAt(): Date {
    return new Date(this._data.updatedAt);
  }

  public get emailVerifiedAt(): Date {
    return new Date(this._data.emailVerifiedAt);
  }
}
