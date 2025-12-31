export const getAccountByUserId = async (userId) => {
  try {
    const account = await AccountModel.findOne({ userId });

    return account;
  } catch (error) {
    return null;
  }
};
