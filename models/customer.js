module.exports = (sequelize, DataTypes) => {

    const customer = sequelize.define("customer", {
        
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        rememberToken: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        phone: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        points: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        preferences: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

    });

    customer.associate = (models) => {
        customer.hasMany(models.booking, {
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };
    return customer;

};