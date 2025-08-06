# 

response_data = {
    "comments": [
        {
            "1": "comment1",
        },
        {
            "2": "comment2",
        }
    ]
}

comments = response_data.get('comments', [])

# Proper way to iterate through comments array

# Alternative approach - if you want to process them into a structured format
processed_comments = []
for comment in comments:
    for key, value in comment.items():
        processed_comments.append({
            'post_id': key,
            'comment': value
        })

print(f"Processed comments: {processed_comments}")