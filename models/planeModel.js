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
            foreignKey: "planeModelId",
            allowNull: false,
            onDelete: "cascade",
            onUpdate: "cascade",
        });
        planeModel.hasMany(models.flight, {
            foreignKey: "planeModelId",
            allowNull: false,
            onDelete: "cascade",
            onUpdate: "cascade",
        })
    };
    return planeModel;

};