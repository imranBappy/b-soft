# backend/apps/blog/mutations.py
import graphene
from graphql_jwt.decorators import login_required

from apps.accounts.models import UserRole
from backend.authentication import isAuthenticated
from .objectType import BlogCategoryType, BlogPostType, CommentType
from .models import BlogCategory, BlogPost, Comment, Like
from django.utils.text import slugify

# Mutations for BlogCategory
class CreateBlogCategory(graphene.Mutation):
    class Arguments:
        name = graphene.String(required=True)
        description = graphene.String()

    blog_category = graphene.Field(BlogCategoryType)

    @login_required
    def mutate(self, info, name, description=None):
        if not info.context.user.is_staff: # Only staff can create categories
            raise Exception("Permission denied: You must be an admin to create categories.")
        blog_category = BlogCategory(name=name, description=description)
        blog_category.save()
        return CreateBlogCategory(blog_category=blog_category)

class UpdateBlogCategory(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        name = graphene.String()
        description = graphene.String()

    blog_category = graphene.Field(BlogCategoryType)

    @login_required
    def mutate(self, info, id, name=None, description=None):
        if not info.context.user.is_staff:
            raise Exception("Permission denied: You must be an admin to update categories.")
        try:
            blog_category = BlogCategory.objects.get(pk=id)
        except BlogCategory.DoesNotExist:
            raise Exception("Blog Category not found.")

        if name:
            blog_category.name = name
        if description is not None:
            blog_category.description = description
        blog_category.save()
        return UpdateBlogCategory(blog_category=blog_category)

class DeleteBlogCategory(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @isAuthenticated(UserRole.ADMIN)
    def mutate(self, info, id):
        # if not info.context.user.is_staff:
        #     raise Exception("Permission denied: You must be an admin to delete categories.")
        try:
            blog_category = BlogCategory.objects.get(pk=id)
            blog_category.delete()
            return DeleteBlogCategory(success=True)
        except BlogCategory.DoesNotExist:
            raise Exception("Blog Category not found.")

# Mutations for BlogPost
class CreateBlogPost(graphene.Mutation):
    class Arguments:
        categoryId = graphene.ID()
        title = graphene.String(required=True)
        coverImage = graphene.String()
        content = graphene.String(required=True)
        youtubeVideoUrl = graphene.String()
        isPublished = graphene.Boolean()

    blog_post = graphene.Field(BlogPostType)

    @isAuthenticated([UserRole.ADMIN])
    def mutate(self, info, categoryId=None, title=None, coverImage=None, content=None, youtubeVideoUrl=None, isPublished=True):
        category = None
        if categoryId:
            try:
                category =  BlogCategory.objects.get(id=categoryId)
            except Exception as e:
                print(" error ", e)
                raise Exception("Blog Category not found.")
    

        blog_post = BlogPost(
            category=category,
            author=info.context.User,
            title=title,
            cover_image=coverImage,
            content=content,
            youtube_video_url=youtubeVideoUrl,
            is_published=isPublished
        )
        blog_post.save()
        return CreateBlogPost(blog_post=blog_post)

class UpdateBlogPost(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        categoryId = graphene.ID()
        title = graphene.String()
        coverImage = graphene.String()
        content = graphene.String()
        youtubeVideoUrl = graphene.String()
        isPublished = graphene.Boolean()

    blog_post = graphene.Field(BlogPostType)

    @isAuthenticated([UserRole.ADMIN])
    def mutate(self, info, id, categoryId=None, title=None, coverImage=None, content=None, youtubeVideoUrl=None, isPublished=None):
        
        try:
            blog_post = BlogPost.objects.get(pk=id)
        except BlogPost.DoesNotExist:
            raise Exception("Blog Post not found.")

        category = None
        if categoryId:
            try:
                category = BlogCategory.objects.get(pk=categoryId)
            except BlogCategory.DoesNotExist:
                raise Exception("Blog Category not found.")
            blog_post.category = category

        if title:
            blog_post.title = title
            blog_post.slug = slugify(title) # Recalculate slug on title change
        if coverImage is not None:
            blog_post.cover_image = coverImage
        if content:
            blog_post.content = content
        if youtubeVideoUrl is not None:
            blog_post.youtube_video_url = youtubeVideoUrl
        if isPublished is not None:
            blog_post.is_published = isPublished
            
        blog_post.save()
        return UpdateBlogPost(blog_post=blog_post)

class DeleteBlogPost(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @isAuthenticated(UserRole.ADMIN)
    def mutate(self, info, id, **input):
        # if not info.context.user.is_staff:
        #     raise Exception("Permission denied: You must be an admin to delete blog posts.")
        try:
            blog_post = BlogPost.objects.get(pk=id)
            blog_post.delete()
            return DeleteBlogPost(success=True)
        except BlogPost.DoesNotExist:
            raise Exception("Blog Post not found.")

# Mutations for Comment
class CreateComment(graphene.Mutation):
    class Arguments:
        blogPostSlug = graphene.String(required=True)
        text = graphene.String(required=True)
        parentCommentId = graphene.ID()

    comment = graphene.Field(CommentType)

    @login_required
    def mutate(self, info, blogPostSlug, text, parentCommentId=None):
        try:
            blog_post = BlogPost.objects.get(slug=blogPostSlug)
        except BlogPost.DoesNotExist:
            raise Exception("Blog Post not found.")

        parent_comment = None
        if parentCommentId:
            try:
                parent_comment = Comment.objects.get(pk=parentCommentId)
            except Comment.DoesNotExist:
                raise Exception("Parent Comment not found.")
        
        comment = Comment(
            blog_post=blog_post,
            user=info.context.user,
            text=text,
            parent_comment=parent_comment
        )
        comment.save()
        return CreateComment(comment=comment)

class DeleteComment(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)

    success = graphene.Boolean()

    @login_required
    def mutate(self, info, id):
        try:
            comment = Comment.objects.get(pk=id)
        except Comment.DoesNotExist:
            raise Exception("Comment not found.")

        # Allow user to delete their own comment, or admin to delete any comment
        if comment.user != info.context.user and not info.context.user.is_staff:
            raise Exception("Permission denied: You can only delete your own comments or be an admin.")
        
        comment.delete()
        return DeleteComment(success=True)

# Mutations for Like
class ToggleLike(graphene.Mutation):
    class Arguments:
        blogPostSlug = graphene.String(required=True)

    blog_post = graphene.Field(BlogPostType)
    liked = graphene.Boolean() # Indicate if the post is now liked or unliked

    isAuthenticated()
    def mutate(self, info, blogPostSlug):
        print("hitted", blogPostSlug )
        try:
            blog_post = BlogPost.objects.get(slug=blogPostSlug)
        except BlogPost.DoesNotExist:
            raise Exception("Blog Post not found.")

        user = info.context.User
        liked = False
        try:
            like = Like.objects.get(blog_post=blog_post, user=user)
            like.delete() # User already liked, so unlike
            liked = False
        except Like.DoesNotExist:
            Like.objects.create(blog_post=blog_post, user=user) # User hasn't liked, so like
            liked = True
        
        # You might need to refresh the blog_post object if its related_name caching is an issue
        blog_post.refresh_from_db()
        return ToggleLike(blog_post=blog_post, liked=liked)

class Mutation(graphene.ObjectType):
    create_blog_category = CreateBlogCategory.Field()
    update_blog_category = UpdateBlogCategory.Field()
    delete_blog_category = DeleteBlogCategory.Field()

    create_blog_post = CreateBlogPost.Field()
    update_blog_post = UpdateBlogPost.Field()
    delete_blog_post = DeleteBlogPost.Field()

    create_comment = CreateComment.Field()
    delete_comment = DeleteComment.Field()

    toggle_like = ToggleLike.Field()