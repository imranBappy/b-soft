from django.db import models

class Slider(models.Model):
    title = models.CharField(max_length=255, blank=True, null=True)
    image = models.CharField(max_length=500)
    description = models.TextField(blank=True, null=True)
    link = models.URLField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.title or f"Slider {self.id}"

class WebsiteInfo(models.Model):
    phone = models.CharField(max_length=20, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    facebook = models.URLField(blank=True, null=True)
    instagram = models.URLField(blank=True, null=True)
    youtube = models.URLField(blank=True, null=True)
    x = models.URLField(blank=True, null=True, help_text="Twitter/X profile URL")
    linkedin = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    whatsapp_link =  models.URLField(blank=True, null=True)


    def __str__(self):
        return "Website Info"
    
class StaticPage(models.Model):
    PAGE_CHOICES = [
        ('contact', 'Contact Us'),
        ('privacy', 'Privacy Policy'),
        ('terms', 'Terms and Conditions'),
    ]
    page_type = models.CharField(max_length=20, choices=PAGE_CHOICES, unique=True)
    content = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return dict(self.PAGE_CHOICES).get(self.page_type, 'Static Page')
    

class ContactUs(models.Model):
    email = models.EmailField()
    name = models.CharField(max_length=255)
    message = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.name} - {self.email}"