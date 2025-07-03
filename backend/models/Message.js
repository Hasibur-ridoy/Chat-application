

module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        conversation_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        sender_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
        text: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        tableName: 'messages',
        freezeTableName: true
    });

    Message.associate = (models) => {
        Message.belongsTo(models.Conversation, {foreignKey: 'conversation_id', onDelete: 'CASCADE'});
        Message.belongsTo(models.User, {foreignKey: 'sender_id', onDelete: 'CASCADE'});
    };
    return Message;
};