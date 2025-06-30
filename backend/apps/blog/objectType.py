# backend/apps/blog/objectType.py
import graphene
from graphene_django import DjangoObjectType

from apps.blog.filters import BlogCategoryFilter, BlogPostFilter
from backend.count_connection import CountConnection
from .models import BlogCategory, BlogPost, Comment, Like

class BlogCategoryType(DjangoObjectType):
    id = graphene.ID(required=True)
    class Meta:
        model = BlogCategory
        filterset_class = BlogCategoryFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection

class BlogPostType(DjangoObjectType):
    likes_count = graphene.Int()
    comments_count = graphene.Int()
    id = graphene.ID(required=True)
    class Meta:
        model = BlogPost
        filterset_class = BlogPostFilter
        interfaces = (graphene.relay.Node,)
        connection_class = CountConnection

    # Resolve methods remain the same
    def resolve_likes_count(self, info):
        return self.likes.count()

    def resolve_comments_count(self, info):
        return self.comments.count()

  


class CommentType(DjangoObjectType):
    class Meta:
        model = Comment
        fields = '__all__'
        # If you plan to use CommentType with DjangoFilterConnectionField as well,
        # you'll need to add interfaces = (graphene.relay.Node,) and a Connection class here too.
        # interfaces = (graphene.relay.Node,) # Uncomment if needed for comments pagination

    # class Connection(graphene.relay.Connection): # Uncomment if needed for comments pagination
    #     class Meta:
    #         node = CommentType


class LikeType(DjangoObjectType):
    class Meta:
        model = Like
        fields = '__all__'
        # If you plan to use LikeType with DjangoFilterConnectionField, add Node interface and Connection class.
        # interfaces = (graphene.relay.Node,)

    # class Connection(graphene.relay.Connection):
    #     class Meta:
    #         node = LikeType