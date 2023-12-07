export const wait = async (seconds: number) => {
  const timerId: NodeJS.Timeout = await new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      resolve(timeoutId);
    }, seconds * 1000);
  });
  clearInterval(timerId);
};
