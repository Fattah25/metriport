import {
  CreationAttributes,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  literal,
  Model,
  ModelAttributes,
  QueryInterface,
  Transaction,
} from "sequelize";

export const updateUpdatedAtFnName = "update_trigger_fn";

class BaseModel extends Model<
  InferAttributes<BaseModel>,
  InferCreationAttributes<BaseModel>
> {
  declare createdAt: Date;
  declare updatedAt: Date;
}

// default columns, don't change them here; if you need something different do it on the migration file
export const defaultColumnsDef = (): ModelAttributes<
  BaseModel,
  CreationAttributes<BaseModel>
> => ({
  createdAt: {
    field: "created_at",
    type: DataTypes.DATE(6),
    allowNull: false,
    defaultValue: literal("CURRENT_TIMESTAMP(6)"), // https://github.com/sequelize/sequelize/issues/4896
  },
  updatedAt: {
    field: "updated_at",
    type: DataTypes.DATE(6),
    allowNull: false,
    defaultValue: literal("CURRENT_TIMESTAMP(6)"), // https://github.com/sequelize/sequelize/issues/4896
  },
});

export const addUpdatedAtTrigger = (
  queryInterface: QueryInterface,
  transaction: Transaction,
  tableName: string
) =>
  queryInterface.createTrigger(
    tableName,
    `trg_update_${tableName}`,
    "before",
    //@ts-ignore - https://github.com/sequelize/sequelize/issues/11420
    { before: "update" },
    updateUpdatedAtFnName,
    [],
    ["FOR EACH ROW"],
    { transaction }
  );

export const createTable = async <M extends Model>(
  queryInterface: QueryInterface,
  transaction: Transaction,
  tableName: string,
  tableDefinitions: ModelAttributes<M, CreationAttributes<M>>
) => {
  await queryInterface.createTable(
    tableName,
    {
      ...tableDefinitions,
      ...defaultColumnsDef(),
    },
    { transaction }
  );
  await addUpdatedAtTrigger(queryInterface, transaction, tableName);
};
