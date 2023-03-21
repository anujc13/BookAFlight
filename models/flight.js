module.exports = (sequelize, DataTypes) => {

    const flight = sequelize.define("flight", {
        
        sourceAirport: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        destinationAirport: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        departureTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        arrivalTime: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        duration: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        airline: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        numSold: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

    });

    flight.associate = (models) => {
        flight.hasMany(models.ticket, {
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };
    return flight;

};