import { connect } from 'mongoose';

export async function connectDatabase() {
  const mongoUrl: string =
    'mongodb+srv://' +
    process.env.MONGODB_USER +
    ':' +
    process.env.MONGODB_PASSWORD +
    '@cluster0.qm37q.mongodb.net/' +
    process.env.MONGODB_DATABASE +
    '?retryWrites=true&w=majority';
  await connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
}
