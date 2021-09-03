import { connect } from 'mongoose';

export async function connectDatabase() {
  const mongoUrl: string = process.env.MONGODB_URL as string;
  await connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
}
