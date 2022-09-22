module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('users', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4,
    },
    first_name: {
      type: Sequelize.STRING
    },
    last_name: {
      type: Sequelize.STRING
    },
    mobile_number: {
      type: Sequelize.STRING
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: { args: true, msg: 'Account already exists with your email.' },
      validate: {
        isEmail: true
      }
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: { args: true, msg: 'Username is already taken. Please choose another one.' },
    },
    password: {
      type: Sequelize.STRING,
    },

    address1: {
      type: Sequelize.STRING
    },
    address2: {
      type: Sequelize.STRING
    },
    city: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    },
    country: {
      type: Sequelize.STRING
    },
    token: {
      type: Sequelize.UUID
    },
    status: {
      type: Sequelize.STRING,
      validate: {
        isIn: [['pending', 'active',]],
      }
    },
  },
    {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return User
}