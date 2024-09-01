const { Schema, model } = require('mongoose');

//Schema to create user model 
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,

        },
        email: {
            type: String,
            require: true,
            unique: true,
            match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: props => `${props.value} is not a valid email!`
        },
        thoughts: [
            {
            type: Schema.Types.ObjectId,
            ref: 'thought',
        },
        ],
        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'user'
            },
        ],
    },
    {
        toJSON: {
            virtuals: true,
        },
        id: false,
    }
);

userSchema
  .virtual('friendCount')
  // Getter
  .get(function () {
    return this.friends.length;
  });



const User = model('user', userSchema);

module.exports = User;