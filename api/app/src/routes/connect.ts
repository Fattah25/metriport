import { Request, Response } from "express";
import Router from "express-promise-router";
import z from "zod";
import status from "http-status";
import BadRequestError from "../errors/bad-request";
import UnauthorizedError from "../errors/unauthorized";
import { Config } from "../shared/config";
import {
  Constants,
  providerOAuth1OptionsSchema,
  providerOAuth2OptionsSchema,
} from "../shared/constants";
import { processOAuth1 } from "./middlewares/oauth1";
import { processOAuth2 } from "./middlewares/oauth2";
import { asyncHandler, getCxId, getCxIdFromHeaders, getUserIdFromHeaders } from "./util";
import { getUserToken } from "../command/cx-user/get-user-token";
import { getConnectedUserOrFail } from "../command/connected-user/get-connected-user";
import { ProviderMap } from "../models/connected-user";

const router = Router();

/** ---------------------------------------------------------------------------
 * Builds the success or error connect widget redirect URL based on the
 * specified session token.
 *
 * @param     {string}  success   True if the request was successful; false
 *                                otherwise.
 * @param     {string}  token     The connect widget's session token.
 * @returns   {string}  The connect error redirect URL.
 */
export const buildConnectErrorRedirectURL = (
  success: boolean,
  token: string
): string => {
  const redirectPath = success ? "success" : "error";
  const sandboxFlag = Config.isSandbox() ? "&sandbox=true" : "";
  return `${Config.CONNECT_WIDGET_URL}${redirectPath}?token=${token}${sandboxFlag}`;
};

/** ---------------------------------------------------------------------------------------
 * GET /connect/redirect
 *
 * Generates the auth url for the specified provider & token.
 *
 * @param   {string}  req.query.provider    The provider to get the redirect for.
 * @param   {string}  req.header.api-token  The auth token.
 *
 * @return  {{token: string}}   The generated token.
 */
router.get(
  "/redirect",
  asyncHandler(async (req: Request, res: Response) => {
    const token = req.header("api-token");
    if (!token) throw new UnauthorizedError();

    const providerOAuth2 = providerOAuth2OptionsSchema.safeParse(
      req.query.provider
    );
    if (providerOAuth2.success) {
      const providerUrl = await Constants.PROVIDER_OAUTH2_MAP[
        providerOAuth2.data
      ].getAuthUri(token);
      return res.send(providerUrl);
    }

    const providerOAuth1 = providerOAuth1OptionsSchema.safeParse(
      req.query.provider
    );
    if (providerOAuth1.success) {
      const providerUrl = await Constants.PROVIDER_OAUTH1_MAP[
        providerOAuth1.data
      ].processStep1(token);
      return res.send(providerUrl);
    }

    throw new BadRequestError(`Provider not supported: ${req.query.provider}`);
  })
);

const providerRequest = z.object({
  state: z.string(),
  // OAuth v2
  code: z.string().optional(),
  // OAuth v1
  oauth_token: z.string().optional(),
  oauth_verifier: z.string().optional(),
});

/** ---------------------------------------------------------------------------------------
 * GET /connect/:provider
 *
 * Gets and stores the auth token for the specified provider for future requests. If all is
 * well, will redirect to the Success page in the Connect widget.
 *
 * @param   {string}  req.params.provider       The provider for the request.
 * @param   {string}  req.query.authCode        The OAuth v2 authorization token.
 * @param   {string}  req.query.oauth_token     The OAuth v1 request token.
 * @param   {string}  req.query.oauth_verifier  The OAuth v1 request token verifier.
 *
 * @return  redirect to the Success page.
 */
router.get("/:provider", async (req: Request, res: Response) => {
  const {
    state,
    code: authCode,
    oauth_token,
    oauth_verifier,
  } = providerRequest.parse(req.query);

  try {
    // OAUTH 2
    const providerOAuth2 = providerOAuth2OptionsSchema.safeParse(
      req.params.provider
    );
    if (providerOAuth2.success) {
      const provider = providerOAuth2.data;
      let cxId = getCxIdFromHeaders(req);
      let userId = getUserIdFromHeaders(req);
      await processOAuth2(provider, state, authCode, cxId, userId);
      return res.redirect(`${buildConnectErrorRedirectURL(true, state)}`);
    }

    // OAUTH 1
    const providerOAuth1 = providerOAuth1OptionsSchema.safeParse(
      req.params.provider
    );
    if (providerOAuth1.success) {
      const provider = providerOAuth1.data;
      await processOAuth1(provider, state, oauth_token, oauth_verifier);
      return res.redirect(`${buildConnectErrorRedirectURL(true, state)}`);
    }
  } catch (err) {
    console.log(`Error on /connect/${req.params.provider}`, err);
    return res.redirect(buildConnectErrorRedirectURL(false, state));
  }
});

/** ---------------------------------------------------------------------------------------
 * GET /connect/user/providers
 *
 * Fetches a user's providers
 *
 * @param   {string}  req.header.api-token  The auth token.
 * @param   {string}  req.header.cxId  Passed via headers from the /token auth lambda.
 * @param   {string}  req.header.userId  Passed via headers from the /token auth lambda.
 *
 * @return  {string[]}  The user's connected providers
 */
router.get("/user/providers", async (req: Request, res: Response) => {
  const token = req.header("api-token");
  if (!token) throw new UnauthorizedError();

  let cxId;
  let userId;

  if (!Config.isProdEnv()) {
    const useToken = await getUserToken({ token });
    cxId = useToken.cxId;
    userId = useToken.userId;
  } else {
    cxId = getCxIdFromHeaders(req);
    userId = getUserIdFromHeaders(req);
  }

  if (!cxId || !userId) {
    throw new BadRequestError('Invalid headers')
  }

  const connectedUser = await getConnectedUserOrFail({ id: userId, cxId });

  const providers = Object.keys(connectedUser.providerMap!);

  return res.status(status.OK).send(providers);
});

export default router;
