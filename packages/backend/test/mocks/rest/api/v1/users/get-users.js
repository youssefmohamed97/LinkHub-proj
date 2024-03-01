const getUsersMock = async (users, roles) => {
  const data = users.map((user) => {
    const role = roles.find((r) => r.id === user.roleId);
    return {
      createdAt: user.createdAt.toISOString(),
      email: user.email,
      fullName: user.fullName,
      id: user.id,
      role: role
        ? {
            createdAt: role.createdAt.toISOString(),
            description: role.description,
            id: role.id,
            isAdmin: role.isAdmin,
            key: role.key,
            name: role.name,
            updatedAt: role.updatedAt.toISOString(),
          }
        : null, // Fallback to null if role not found
      roleId: user.roleId,
      trialExpiryDate: user.trialExpiryDate.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  });

  return {
    data: data,
    meta: {
      count: data.length,
      currentPage: 1,
      isArray: true,
      totalPages: 1,
      type: 'User',
    },
  };
};

export default getUsersMock;
