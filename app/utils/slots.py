from datetime import datetime, timedelta


def generate_hour_slots(opening_time, closing_time):
    slots = []

    start = datetime.combine(datetime.today(), opening_time)
    end = datetime.combine(datetime.today(), closing_time)

    while start + timedelta(hours=1) <= end:
        slot_end = start + timedelta(hours=1)
        slots.append({"start_time": start.time(), "end_time": slot_end.time()})
        start = slot_end

    return slots