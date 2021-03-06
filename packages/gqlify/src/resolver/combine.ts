import {Plugin, Context} from '../plugins/interface';
import Model from '../dataModel/model';
import { IResolverObject } from 'graphql-tools';

export default (defaultResolvers: IResolverObject, plugins: Plugin[], models: Model[]) => {
  let resolvers: any = {
    Query: {},
    Mutation: {},
    ...defaultResolvers,
  };
  models.forEach(model => {
    plugins.forEach(plugin => {
      resolvers = {
        ...plugin.resolveInRoot && plugin.resolveInRoot({model, dataSource: model.getDataSource()}),
        ...resolvers,
        Query: {
          ...resolvers.Query,
          ...plugin.resolveInQuery && plugin.resolveInQuery({model, dataSource: model.getDataSource()}),
        },
        Mutation: {
          ...resolvers.Mutation,
          ...plugin.resolveInMutation && plugin.resolveInMutation({model, dataSource: model.getDataSource()}),
        },
      };
    });
  });
  return resolvers;
};
