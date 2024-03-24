
import mongoose from "mongoose";

const formModel = new mongoose.Schema(
  {
    number: String,
    buildingNumber: String,
    userName: String,
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formModel);

export default Form;
