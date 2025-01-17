import { nanoid } from "nanoid";
import { OmitProperties } from "ts-essentials";
import { Constants } from "../shared/constants";
import { Util } from "../shared/util";

export type UserTokenCreate = OmitProperties<
  Omit<UserToken, "token" | "expiryTime"> &
    Partial<Pick<UserToken, "token" | "expiryTime">>,
  Function
>;

export type UserTokenBuild = OmitProperties<UserToken, Function>;

export class UserToken {
  private constructor(
    public token: string,
    public cxId: string,
    public userId: string,
    public expiryTime: number,
    public oauthRequestToken?: string,
    public oauthRequestSecret?: string,
    public oauthUserAccessToken?: string,
    public oauthUserAccessSecret?: string
  ) {}

  static create = (v: UserTokenCreate): UserToken => {
    validate(v);
    return UserToken.build({
      ...v,
      token: v.token ?? nanoid(),
      expiryTime:
        v.expiryTime ??
        Util.curSecSinceEpoch() + Constants.DEFAULT_TOKEN_EXPIRY_SECONDS,
    });
  };

  static build({
    token,
    cxId,
    userId,
    expiryTime,
    oauthRequestToken,
    oauthRequestSecret,
    oauthUserAccessToken,
    oauthUserAccessSecret,
  }: UserTokenBuild): UserToken {
    return new UserToken(
      token,
      cxId,
      userId,
      expiryTime,
      oauthRequestToken,
      oauthRequestSecret,
      oauthUserAccessToken,
      oauthUserAccessSecret
    );
  }

  clone(): UserToken {
    return UserToken.build({
      token: this.token,
      cxId: this.cxId,
      userId: this.userId,
      expiryTime: this.expiryTime,
      oauthRequestToken: this.oauthRequestToken,
      oauthRequestSecret: this.oauthRequestSecret,
      oauthUserAccessToken: this.oauthUserAccessToken,
      oauthUserAccessSecret: this.oauthUserAccessSecret,
    });
  }
}

export const validate = (create: UserTokenCreate) => {};
