module.exports = (sequelize, DataTypes) => {

    const seatPosition = sequelize.define("seatPosition", {

        row: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        col: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        class: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

    });

    seatPosition.associate = (models) => {
        seatPosition.hasMany(models.ticket, {
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };
    return seatPosition;

};