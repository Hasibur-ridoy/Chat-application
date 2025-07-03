module.exports = (sequilize, Datatypes) => {
    const Login = sequilize.define('Login',{
        id: {
            type: Datatypes.UUID,
            defaultValue: Datatypes.UUIDV4,
            primaryKey: true
        },
        user_id: {
            type: Datatypes.UUID,
            allowNull: false,
        },
    },
    {
        tableName: 'logins',
        freezeTableName: true
    }
);

    Login.associate = (models) => {
        Login.belongsTo(models.User, {
            foreignKey: 'user_id',
            onDelete: 'CASCADE'
        });
    };
    return Login;
};