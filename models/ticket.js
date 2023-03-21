module.exports = (sequelize, DataTypes) => {

    const ticket = sequelize.define("ticket", {

        price: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        extraBaggage: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        mealAvailable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        mealOption: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        purchased: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        
    });

    return ticket;

};