import { isEmail } from "validator";

const requiredField = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vemail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vpassword = (value, confirm_password) => {
  if (value.length < 5 || value.length > 100) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 5 and 100 characters.
      </div>
    );
  } else if (value && value !== confirm_password) {
    return (
      <div className="alert alert-danger" role="alert">
        Passwords do not match.
      </div>
    );
  }
};

const UserValidation = {
  requiredField,
  vemail,
  vpassword,
};

export default UserValidation;
