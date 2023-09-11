export default (message: string, status?: number) => {
  const error = new Error(message);
  return {
    status: status || 500,
    message: error.message,
  };
};
