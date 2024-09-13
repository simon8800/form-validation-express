const usersStorage = require("../storages/usersStorage");
const { body, query, validationResult } = require("express-validator");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const alphanumErr = "must only contain alphanumeric characters."
const emailErr = "must be a valid email format. (e.g. example@example.com)"
const numErr = "must be a number.";
const ageRangeErr = "must be 18 to 20 years old.";
const bioLimitErr = "must be at most 200 characters.";

const validateUser = [
  body("firstName").trim()
    .isAlpha().withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
  body("lastName").trim()
    .isAlpha().withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
  body("email").trim()
    .isEmail().withMessage(`Email ${emailErr}`),
  body("age").optional({checkFalsy: true})
    .isNumeric().withMessage(`Age ${numErr}`)
    .isInt({min: 18, max: 20}).withMessage(`Age ${ageRangeErr}`),
  body("bio").optional().trim()
    .isLength({max: 200}).withMessage(`Bio ${bioLimitErr}`)
];

const sanitizeSearch = [
  query("searchName").optional({checkFalsy: true})
    .toLowerCase()
]

// We can pass an entire array of middleware validations to our controller.
exports.usersCreatePost = [
  validateUser,
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("createUser", {
        title: "Create user",
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    res.redirect("/");
  }
];

exports.usersListGet = (req, res) => {
  res.render("index", {
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

exports.usersCreateGet = (req, res) => {
  res.render("createUser", {
    title: "Create user",
  });
};

exports.usersUpdateGet = (req, res) => {
  const user = usersStorage.getUser(req.params.id);
  res.render("updateUser", {
    title: "Update user",
    user: user,
  });
};

exports.usersUpdatePost = [
  validateUser,
  (req, res) => {
    const user = usersStorage.getUser(req.params.id);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("updateUser", {
        title: "Update user",
        user: user,
        errors: errors.array(),
      });
    }
    const { firstName, lastName, email, age, bio } = req.body;
    usersStorage.updateUser(req.params.id, { firstName, lastName, email, age, bio });
    res.redirect("/");
  }
];

// Tell the server to delete a matching user, if any. Otherwise, respond with an error.
exports.usersDeletePost = (req, res) => {
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};

exports.usersSearchGet = [sanitizeSearch, (req, res) => {
  const {searchName} = req.query
  let [firstName] = searchName.split(" ");
  const user = usersStorage.getUserByName(firstName);
  if (user === -1) {
    return res.render("search", {title: "Search User", user: -1})
  }
  return res.render("search", {title: "Search User", user: user});
}]