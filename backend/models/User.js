module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {isEmail: true}
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {len: [8, 100]}
        },
    },
    {
        tableName: 'users',
        freezeTableName: true
    }
);

    User.associate = (models) => {
        User.hasMany(models.Login, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    };

    return User;
};