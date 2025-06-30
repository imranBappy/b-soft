# backend/apps/blog/admin.py
from django.contrib import admin
from .models import BlogCategory, BlogPost, Comment, Like

@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'slug', 'created_at')
    search_fields = ('name',)
    prepopulated_fields = {'slug': ('name',)}

@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'slug', 'category', 'author', 'is_published', 'views_count', 'created_at')
    list_filter = ('category', 'author', 'is_published', 'created_at')
    search_fields = ('title', 'content')
    prepopulated_fields = {'slug': ('title',)}
    raw_id_fields = ('author',) # Use raw_id_fields for ForeignKey to improve admin performance
    # For rich text editor and image/video handling, you'll typically integrate a third-party Django app
    # (e.g., Django CKEditor, Django TinyMCE) and configure it here.
    # Example (requires installing a rich text editor library):
    # formfield_overrides = {
    #     models.TextField: {'widget': CKEditorUploadingWidget},
    # }

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'blog_post', 'parent_comment', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__email', 'blog_post__title', 'text')
    raw_id_fields = ('user', 'blog_post', 'parent_comment')
    actions = ['approve_comments'] # Example for comment moderation

    def approve_comments(self, request, queryset):
        queryset.update(is_approved=True) # You might add an `is_approved` field to Comment model
    approve_comments.short_description = "Mark selected comments as approved"

@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'blog_post', 'created_at')
    raw_id_fields = ('user', 'blog_post')