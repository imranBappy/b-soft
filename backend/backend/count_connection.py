import graphene
from graphene import Connection


class CountConnection(Connection):
    total_count = graphene.Int()
    class Meta:
        abstract = True

    def resolve_total_count(root, info, **kwargs):
        return root.length
