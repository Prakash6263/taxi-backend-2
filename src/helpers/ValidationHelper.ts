export const validate = async (body, res, schema) => {
  try {
    const validation = await schema.validate(body, { abortEarly: true });
    // console.log(validation);
    if (validation.error) {
      const error = validation.error.details.map((e) => (e = e.message));

      console.log(error, "error");
      res.status(400).json({
        status: 400,
        statusText: "VALIDATION_FAILED",
        message: "Validation Failed!",
        data: { error },
      });
      return false;
    } else {
      return true;
    }
  } catch (err) {
    console.log(err);
  }
};
