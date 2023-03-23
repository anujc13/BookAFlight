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
        basePrice: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        numSold: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },

    });

    flight.associate = (models) => {
        flight.hasMany(models.ticket, {
            foreignKey: "flightId",
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };
    return flight;

};