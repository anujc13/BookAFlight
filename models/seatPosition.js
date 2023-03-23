module.exports = (sequelize, DataTypes) => {

    const seatPosition = sequelize.define("seatPosition", {

        row: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        col: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        class: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    });

    seatPosition.associate = (models) => {
        seatPosition.hasMany(models.ticket, {
            foreignKey: "seatPositionId",
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };
    return seatPosition;

};