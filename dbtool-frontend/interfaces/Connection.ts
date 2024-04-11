import ConnectionType from './ConnectionType';

interface Connection {
  uid: string;
  connectionType: ConnectionType;
  connectionName: string;
  connectionString: string;
}

export default Connection;
