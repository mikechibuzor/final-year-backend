// import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";
// import { Optional } from "sequelize"
// import bcrypt from "bcryptjs"

// interface UserAttributes {
//   id: string;
//   email: string;
//   password: string
// }

// interface UserCreationAttributes extends Optional<UserAttributes, 'id'>

// @Table({hooks: {
//   beforeCreate: async (user, options) => {
//     const salt = await bcrypt.genSalt();
//     const hashedPsw = await bcrypt.hash(user.password, salt);
//     user.password = hashedPsw
//   },
//   beforeUpdate: async (user, options) => {
//     if (!user.changed('password')) return;
//     const salt = await bcrypt.genSalt();
//     const hashedPsw = await bcrypt.hash(user.password, salt);
//     user.password = hashedPsw
//   },
// }})
// class User extends Model<UserAttributes, UserCreationAttributes> {

//   @PrimaryKey
//   @Column(DataType.UUIDV4)
//   id: string;

//   @Column
//   email: string

//   @Column
//   password: string

//   @Column
//   role: string

//   @Column
//   isVerified: boolean

//   @Column
//   code: string

//   @Column
//   codeExpDate: Date


// }