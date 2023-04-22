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
        dob: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        rememberToken: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: "",
        },
        authorization: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        phone: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        points: {
            type: DataTypes.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        preferences: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        confirmEmail: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        confirmTel: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

    });

    customer.associate = (models) => {
        customer.hasMany(models.booking, {
            foreignKey: "customerId",
            onDelete: "cascade",
            onUpdate: "cascade",
        });
    };
    return customer;

};