from PIL import Image
import io
import os
import uuid
from supabase import create_client, Client
from flask import current_app

def convert_to_webp(image_data, quality=100, optimize=True):
    # Open the image from bytes
    image = Image.open(io.BytesIO(image_data))

    # Convert to RGB if necessary (WebP doesn't support RGBA)
    if image.mode in ('RGBA', 'LA', 'P'):
        image = image.convert('RGB')

    # Convert to WebP with optimization
    webp_buffer = io.BytesIO()
    image.save(webp_buffer, format='WEBP', quality=quality, optimize=optimize)
    webp_data = webp_buffer.getvalue()

    return webp_data

def upload_image_to_storage(image_data, user_id, filename=None):
    try:
        # Initialize Supabase client
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Generate filename if not provided
        if not filename:
            file_extension = '.webp'
            filename = f"{uuid.uuid4()}{file_extension}"
        
        # Create storage path with user organization
        storage_path = f"{user_id}/{filename}"
        
        # Upload to Supabase storage
        result = supabase.storage.from_('photos').upload(
            path=storage_path,
            file=image_data,
            file_options={"content-type": "image/webp"}
        )
        
        if result:
            print(f"Successfully uploaded image to: {storage_path}")
            return storage_path
        else:
            raise Exception("Failed to upload image to storage")
            
    except Exception as e:
        print(f"Error uploading image to storage: {str(e)}")
        raise e

def get_signed_url(storage_path, expires_in=3600):
    try:
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Get signed URL
        result = supabase.storage.from_('photos').create_signed_url(
            path=storage_path,
            expires_in=expires_in
        )
        return result['signedURL']
        
    except Exception as e:
        print(f"Error getting signed URL: {str(e)}")
        raise e

def get_storage_url(storage_path):
    try:
        supabase_url = current_app.config['SUPABASE_URL']
        supabase_key = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY')
        supabase: Client = create_client(supabase_url, supabase_key)
        
        # Get public URL
        result = supabase.storage.from_('photos').get_public_url(storage_path)
        return result
        
    except Exception as e:
        print(f"Error getting storage URL: {str(e)}")
        raise e 

