export default (status: number, message: string) => {
  const error = new Error(message);
  return {
    status,
    message: error.message,
  };
};
