import User from '../../models/user.js';
import Role from '../../models/role.js';

const createUser = async (_parent, params, context) => {
  context.currentUser.can('create', 'User');

  const { fullName, email, password } = params.input;

  const existingUser = await User.query().findOne({
    email: email.toLowerCase(),
  });

  if (existingUser) {
    throw new Error('User already exists!');
  }

  const userPayload = {
    fullName,
    email,
    password,
  };

  try {
    context.currentUser.can('update', 'Role');

    userPayload.roleId = params.input.role.id;
  } catch {
    // void
    const role = await Role.query().findOne({ key: 'admin' });
    userPayload.roleId = role.id;
  }

  const user = await User.query().insert(userPayload);

  return user;
};

export default createUser;
