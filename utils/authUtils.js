const isEmailValidator = ({ str }) => {
    const isEmail =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
        str
      );
    return isEmail;
  };

const userDataValidation = ({ name, email, username, password }) => {
    return new Promise((resolve, reject) => {
        if (!name || !email || !username || !password) {
            return reject(new Error('Missing user data'));
        }
        if (typeof name !== 'string') {
            return reject(new Error('Name is not a text'));
        }
        if (typeof email !== 'string') {
            return reject(new Error('Email is not a text'));
        }
        if (typeof username !== 'string') {
            return reject(new Error('Username is not a text'));
        }
        if (typeof password !== 'string') {
            return reject(new Error('Password is not a text'));
        }
        if (username.length < 3 || username.length > 50) {
            return reject(new Error('Username length should be between 3 to 50'));
        }

        resolve();
    });
};

module.exports = { userDataValidation, isEmailValidator };
