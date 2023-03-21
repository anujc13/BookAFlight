module.exports = (sequelize, DataTypes) => {

    const planeModel = sequelize.define("planeModel", {

        modelName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        totalOccupancy: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },

    });

    planeModel.associate = (models) => {
        planeModel.hasMany(models.seatPosition, {
            onDelete: "cascade",
            onUpdate: "cascade",
        });
        planeModel.hasMany(models.flight, {
            onDelete: "cascade",
            onUpdate: "cascade",
        })
    };
    return planeModel;

};