from decimal import Decimal
from apps.slots.models import Slot
from datetime import datetime, timedelta

def calculate_amount(start_time, end_time, price_per_hour):
    start_time = datetime.strptime(start_time, "%H:%M").time()
    end_time = datetime.strptime(end_time, "%H:%M").time()

    today = datetime.today().date()
    start_dt = datetime.combine(today, start_time)
    end_dt = datetime.combine(today, end_time)

    if end_dt <= start_dt:
        end_dt += timedelta(days=1)

    duration_seconds = (end_dt - start_dt).total_seconds()
    duration_hours = Decimal(duration_seconds) / Decimal(3600)
    return duration_hours * price_per_hour


def is_slot_overlapping(turf, slot_date, start_time, end_time):
    return Slot.objects.filter(
        turf=turf,
        slot_date=slot_date,
        start_time__lt=end_time,
        end_time__gt=start_time,
        is_available=False
    ).exists()