import { env } from "./environment";

export const IS_PRODUCTION = env.APP_ENVIRONMENT_STATE === "production"
