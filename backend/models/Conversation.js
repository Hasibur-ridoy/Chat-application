module.exports = (sequelize, DataTypes) => {
    const Conversation = sequelize.define('Conversation', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        user_one_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        user_two_id: {
            type: DataTypes.UUID,
            allowNull: false
        }
    },
    {
        tableName: 'conversations',
        freezeTableName: true
    });

    Conversation.associate = (models) => {
        Conversation.belongsTo(models.User, {foreignKey: 'user_one_id', onDelete: 'CASCADE'});
        Conversation.belongsTo(models.User, {foreignKey: 'user_two_id', onDelete: 'CASCADE'});
        Conversation.hasMany(models.Message, {foreignKey: 'conversation_id', onDelete: 'CASCADE'});
    }
    return Conversation;
};