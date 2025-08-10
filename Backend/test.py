import random
import datetime

leads = ['lead1', 'lead2', 'lead3', 'lead4', 'lead5']

base_interval_minutes = 120.0 / len(leads)
base_interval_minutes = max(5.0, min(45.0, base_interval_minutes))  # Min 5 min, max 45 min

schedule_time = datetime.datetime.now(datetime.timezone.utc)

print(schedule_time)
for i, lead in enumerate(leads):
    min_delay = base_interval_minutes * 0.7
    max_delay = base_interval_minutes * 1.3
    random_delay = random.uniform(min_delay, max_delay)

    # Add cumulative delay for this lead
    total_delay_minutes = (i * base_interval_minutes) + random_delay
    scheduled_time = schedule_time + datetime.timedelta(minutes=total_delay_minutes)
    
    # Format datetime for Supabase (ISO format)
    formatted_time = scheduled_time.strftime('%Y-%m-%dT%H:%M:%S')
    print(formatted_time)