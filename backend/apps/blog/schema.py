# backend/apps/blog/schema.py
import graphene
from .queries import Query as BlogQueries
from .mutations import Mutation as BlogMutations

class Query(BlogQueries, graphene.ObjectType):
    pass

class Mutation(BlogMutations, graphene.ObjectType):
    pass