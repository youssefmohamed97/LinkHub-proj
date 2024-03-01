import appConfig from '../../config/app.js';
import User from '../../models/user.js';
import Role from '../../models/role.js';

const registerUser = async (_parent, params) => {
  if (!appConfig.isCloud) return;

  const { fullName, email, password } = params.input;

  const existingUser = await User.query().findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error('User already exists!');
  }

  const role = await Role.query().findOne({ key: 'user' });

  const user = await User.query().insert({
    fullName,
    email,
    password,
    roleId: role.id,
  });

  return user;
};

export default registerUser;
