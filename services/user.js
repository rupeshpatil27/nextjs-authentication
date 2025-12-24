import UserModel from "@/model/userModel";

export const getUserByEmail = async ({ email }) => {
  try {
    const user = await UserModel.findOne({ email });

    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async ({ id }) => {
  try {
    const user = await UserModel.findById(id);

    return user;
  } catch (error) {
    return null;
  }
};
