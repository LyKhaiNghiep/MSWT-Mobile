import {column, Schema, Table} from '@powersync/react-native';

const messages = new Table(
  {
    // id column (text) is automatically included
    sent_at: column.text,
    message: column.text,
    doctor_id: column.text,
    patient_id: column.text,
  },
  {indexes: {}},
);

export const AppSchema = new Schema({
  messages,
});

export type Database = (typeof AppSchema)['types'];
