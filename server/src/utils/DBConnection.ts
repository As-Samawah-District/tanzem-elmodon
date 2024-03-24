import mongoose from "mongoose";
export const conect = async () => {
  try {
    mongoose
      .connect(process.env.DB_URL!, {})
      .then(() => {
        console.log(`connected to database ${process.env.DB_URL}`);
      })
      .catch((error: any) => {
        console.log(error);
      });
  } catch (err) {
    console.log(err);
  }
};
