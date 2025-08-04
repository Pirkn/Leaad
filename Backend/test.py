# Backend/test.py - Fixed version
from src.utils.models import Model

def discover_lead_subreddits_for_product(product_data):
    """
    Uses AI to discover relevant subreddits based on:
    - product.target_audience (AI-generated)
    - product.problem_solved (AI-generated)  
    - product.description (AI-generated)
    """
    
    discovery_prompt = f"""
    Analyze this product and find the BEST subreddits for lead generation:
    
    Product: {product_data['name']}
    Target Audience: {product_data['target_audience']}
    Problem Solved: {product_data['problem_solved']}
    Description: {product_data['description']}
    
    Find subreddits where:
    1. The target audience actively seeks help
    2. People discuss the exact problem this product solves
    3. Community allows helpful recommendations (not anti-promotion)
    4. Active enough for regular lead opportunities
    
    Return top 10 subreddits with reasoning for each.
    Return in the following format:
    {{"subreddits": ["r\\subreddit1", "r\\subreddit2", "r\\subreddit3"]}}
    """
    
    model = Model()
    # Fix: Pass messages as a list, not a string
    messages = [{"role": "user", "content": discovery_prompt}]
    discovered = model.gemini_chat_completion(messages)
    return discovered

# print(discover_subreddits_for_product({
#     'name': 'Waitlistsnow',
#     'target_audience': 'Entrepreneurs, SaaS founders, and individuals launching new product ideas.',
#     'problem_solved': 'It addresses the challenge of validating new product or SaaS ideas and building an early audience without requiring coding skills or significant development time.',
#     'description': 'DWaitlistNow is a no-code platform designed for creating and launching professional waitlist pages. It enables users to quickly set up custom-branded pages with unique URLs and customizable templates to gather early sign-ups. The platform includes an advanced analytics dashboard for monitoring audience growth and collecting subscriber data. It supports unlimited waitlists and offers integration for email sending, providing a comprehensive solution for validating product ideas and building an initial audience.'
# }))

print(discover_subreddits_for_product({
    'name': 'ExcelExercises',
    'target_audience': ' Individuals across all skill levels, from beginners to experts, who aim to master Excel for career advancement in fields such as finance, accounting, consulting, and data science, or to prepare for job-related Excel assessments.',
    'problem_solved': 'Traditional Excel learning methods, such as lengthy videos or articles, are often boring, lead to zoning out, and result in poor retention because they lack immediate, hands-on application. This makes it difficult for users to internalize skills and build muscle memory. The form has been auto-filled with the generated data. You can now create the product!',
    'description': 'Excel Exercises is an online learning platform that provides interactive, hands-on practice for Microsoft Excel skills. It offers bite-sized lessons that require users to actively type formulas and practice keyboard shortcuts, designed to build muscle memory and improve retention. The platform features an online Excel simulator for in-browser practice, with options for downloadable spreadsheets. It employs a gamified approach, including points and levels, to maintain user engagement and gradually introduces concepts from basic to advanced Excel techniques.'
}))