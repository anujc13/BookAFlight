module.exports = (sequelize, DataTypes) => {

    const booking = sequelize.define("booking", {

        orderTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        price: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        reservationStatus: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },

    });

    booking.associate = (models) => {
        booking.hasMany(models.ticket, {
            foreignKey: "bookingId",
        });
    };
    return booking;

};