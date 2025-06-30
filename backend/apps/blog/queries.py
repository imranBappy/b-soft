# backend/apps/blog/queries.py
import graphene
from graphene_django.filter import DjangoFilterConnectionField
from apps.blog.objectType import BlogCategoryType, BlogPostType, CommentType
from apps.blog.models import BlogCategory, BlogPost, Comment
from apps.blog.filters import BlogPostFilter # Import the filter

class Query(graphene.ObjectType):
    all_blog_categories = DjangoFilterConnectionField(BlogCategoryType)
    blog_category_by_slug = graphene.Field(BlogCategoryType, slug=graphene.String())

    all_blog_posts = DjangoFilterConnectionField(BlogPostType, filterset_class=BlogPostFilter)
    blog_post_by_slug = graphene.Field(BlogPostType, slug=graphene.String())

    comments_by_blog_post = graphene.List(CommentType, blog_post_slug=graphene.String())

    def resolve_all_blog_categories(self, info):
        return BlogCategory.objects.all()

    def resolve_blog_category_by_slug(self, info, slug):
        try:
            return BlogCategory.objects.get(slug=slug)
        except BlogCategory.DoesNotExist:
            return None

    def resolve_all_blog_posts(self, info, **kwargs):
        # The filterset_class handles filtering automatically
        return BlogPost.objects.all()

    def resolve_blog_post_by_slug(self, info, slug):
        try:
            blog_post = BlogPost.objects.get(slug=slug)
            blog_post.views_count += 1 # Increment view count on access
            blog_post.save(update_fields=['views_count'])
            return blog_post
        except BlogPost.DoesNotExist:
            return None

    def resolve_comments_by_blog_post(self, info, blog_post_slug):
        try:
            blog_post = BlogPost.objects.get(slug=blog_post_slug)
            return Comment.objects.filter(blog_post=blog_post, parent_comment__isnull=True).order_by('created_at')
        except BlogPost.DoesNotExist:
            return []