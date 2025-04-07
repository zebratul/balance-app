module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
      'SequelizeMeta',
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        tableName: 'SequelizeMeta',
        timestamps: false,
        freezeTableName: true,
      }
    );
  };