/* eslint-disable no-useless-catch */
import model from '../models/index.ts';

class DBConnection {
  models: any;
  constructor() {
    this.models = null;
  }

  getModels() {
    return this.models;
  }

  handleInstanceAuth(instance) {
    return instance.authenticate();
  }

  authenticateInstances(instances) {
    return instances.map(this.handleInstanceAuth);
  }

  async connect() {
    try {
      const { sequelizeInstances, models } = model();

      this.models = models;

      const authInstances = this.authenticateInstances(sequelizeInstances);
      console.log(authInstances)
      await Promise.all(authInstances);

    } catch (error) {
      console.log(error)

      process.exit(1);
    }
  }
}

export default new DBConnection();
