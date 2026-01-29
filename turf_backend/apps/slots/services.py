from datetime import time
from .models import Slot

DEFAULT_TIME_WINDOWS = [
    (time(5, 0), time(6, 0)),
    (time(6, 0), time(7, 0)),
    (time(7, 0), time(8, 0)),
    (time(8, 0), time(9, 0)),
    (time(9, 0), time(10, 0)),
]

def generate_slots_for_date(turf, date):
    """
    Idempotent slot generation.
    Creates slots only if they do not exist.
    """  
    
    slots = []
    for start, end in DEFAULT_TIME_WINDOWS:
        slot, _ = Slot.objects.get_or_create(
            turf=turf,
            slot_date=date,
            start_time=start,
            end_time=end,
            defaults={'is_available': True}
        )
        
        slots.append(slot)
        
    return slots