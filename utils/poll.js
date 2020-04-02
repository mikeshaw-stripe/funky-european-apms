const pollAPI = (fn, timeout, interval) => {
  const endTime = Number(new Date()) + (timeout || 2000);
  interval = interval || 100;

  const checkCondition = (resolve, reject) => {
    // If the condition is met
    const result = fn();

    if (result) {
      resolve(result);
    } else if (Number(new Date()) > endTime) {
      setTimeout(checkCondition, interval, resolve, reject);
    } else {
      reject(
        new Error(
          "Timed out calling API. Result not found. " + fn + ": " + arguments
        )
      );
    }
  };

  return new Promise(checkCondition);
};

export { pollAPI };
