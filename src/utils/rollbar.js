import Rollbar from 'rollbar';

import { isProdEnv, rollbarConfig, runtimeEnv } from '../config';

const rollbar = new Rollbar({ accessToken: rollbarConfig.accessToken });

const transformer = (payload) => {
  const body =
    payload.body && payload.body.message && payload.body.message.body;
  if (body) {
    payload.body.message.body = `[frontend] ` + body;
  }
  return payload;
};

rollbar.configure({
  enabled: isProdEnv,
  transform: transformer,
  environment: `${runtimeEnv}:frontend`
});

export default rollbar;
