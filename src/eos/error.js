export function parseError(obj, action) {
  try {
    const resourceExhaustedExc = /resource_exhausted_exception/gm;
    const overdrawnBalanceExc = /overdrawn balance/gm;
    const actionLimitExc = /Action limit exceeded/gm;
    // TODO: check for additional Yup specific errors

    const jsonStr = typeof obj === 'string' ? obj : JSON.stringify(obj);
    if (jsonStr.match(resourceExhaustedExc)) {
      return 'Exceeded resource limits for account';
    } else if (jsonStr.match(overdrawnBalanceExc)) {
      return 'Account balance is overdrawn';
    } else if (jsonStr.match(actionLimitExc)) {
      if (action === 'createcomment') {
        return "You've run out of comments for the day";
      }
      if (action === 'follow') {
        return "You've run out of follows for the day";
      }
      if (action === 'vote') {
        return "You've run out of likes for the day";
      }
      return 'Account has exceeded action limit for today';
    } else {
      return 'Something went wrong';
    }
  } catch (err) {
    return 'Something went wrong';
  }
}
