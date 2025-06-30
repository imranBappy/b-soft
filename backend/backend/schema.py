# backend/backend/schema.py
from graphene import Schema
from apps.product import schema as product_schema
from apps.accounts import schema as accounts_schema
from apps.core import schema as core_schema
from apps.blog import schema as blog_schema # Import the new blog schema

class Query(
    product_schema.Query,
    accounts_schema.Query,
    core_schema.Query,
    blog_schema.Query # Add blog queries
):
    pass

class Mutation(
    product_schema.Mutation,
    accounts_schema.Mutation,
    core_schema.Mutation,
    blog_schema.Mutation # Add blog mutations
):
    pass

schema = Schema(query=Query, mutation=Mutation)