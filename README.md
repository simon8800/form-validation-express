# form-validation-express

Using `express-validator` module to sanitize and validate form submissions and search queries.

## Lessons learned

- Validation chaining makes validations super easy.
- - Think of validations as middleware, that's why we create an array of validations as `validateUser` and create a controller of array `[validateUser, (req,res) => {}]`.
