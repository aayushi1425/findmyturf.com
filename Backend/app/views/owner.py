from datetime import datetime, date
from django.db.models import Count, Sum, Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from app.models.booking import Booking, BookingStatus, PaymentStatus
from app.models.court import Court
from app.models.turf import Turf
from app.permission import IsOwner
from app.serializers.booking import OwnerBookingSerializer
from app.serializers.turf import TurfSerializer

class OwnerTurfsView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        turfs = Turf.objects.filter(
            business__user=request.user
        ).order_by("-created_at")

        serializer = TurfSerializer(turfs, many=True)
        return Response(serializer.data)

class OwnerTurfBookingsView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request, turf_id):
        try:
            turf = Turf.objects.get(id=turf_id,
                business__user=request.user,
            )
        except Turf.DoesNotExist:
            return Response({"error": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        courts = Court.objects.filter(turf=turf)
        bookings = Booking.objects.filter(
            court__in=courts
        ).select_related("court", "user").order_by(
            "-booking_date", "-start_time"
        )

        serializer = OwnerBookingSerializer(bookings, many=True)
        return Response(serializer.data)


class OwnerAnalyticsSummaryView(APIView):
    """
    High-level analytics for a business owner across all their turfs.
    Optional query params:
      - start_date (YYYY-MM-DD)
      - end_date   (YYYY-MM-DD)
    """

    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request):
        user = request.user
        qs = Booking.objects.filter(court__turf__business__user=user)

        start_date_str = request.query_params.get("start_date")
        end_date_str = request.query_params.get("end_date")

        def parse_date(value: str):
            try:
                return datetime.strptime(value, "%Y-%m-%d").date()
            except Exception:
                return None

        if start_date_str:
            start = parse_date(start_date_str)
            if start:
                qs = qs.filter(booking_date__gte=start)

        if end_date_str:
            end = parse_date(end_date_str)
            if end:
                qs = qs.filter(booking_date__lte=end)

        aggregates = qs.aggregate(
            total_bookings=Count("id"),
            confirmed_bookings=Count(
                "id", filter=Q(status=BookingStatus.CONFIRMED)
            ),
            cancelled_bookings=Count(
                "id", filter=Q(status=BookingStatus.CANCELLED)
            ),
            pending_bookings=Count(
                "id", filter=Q(status=BookingStatus.PENDING)
            ),
            total_revenue=Sum(
                "amount",
                filter=Q(
                    status=BookingStatus.CONFIRMED,
                    payment_status=PaymentStatus.SUCCESS,
                ),
            ),
        )

        by_turf = (
            qs.values(
                "court__turf_id",
                "court__turf__name",
                "court__turf__city",
                "court__turf__state",
            )
            .annotate(
                total_bookings=Count("id"),
                confirmed_bookings=Count(
                    "id", filter=Q(status=BookingStatus.CONFIRMED)
                ),
                cancelled_bookings=Count(
                    "id", filter=Q(status=BookingStatus.CANCELLED)
                ),
                pending_bookings=Count(
                    "id", filter=Q(status=BookingStatus.PENDING)
                ),
                total_revenue=Sum(
                    "amount",
                    filter=Q(
                        status=BookingStatus.CONFIRMED,
                        payment_status=PaymentStatus.SUCCESS,
                    ),
                )
            )
            .order_by("court__turf__name")
        )

        data = {
            "total_bookings": aggregates.get("total_bookings") or 0,
            "confirmed_bookings": aggregates.get("confirmed_bookings") or 0,
            "cancelled_bookings": aggregates.get("cancelled_bookings") or 0,
            "pending_bookings": aggregates.get("pending_bookings") or 0,
            "total_revenue": aggregates.get("total_revenue") or 0,
            "turfs": [{
                    "turf_id": item["court__turf_id"],
                    "turf_name": item["court__turf__name"],
                    "city": item["court__turf__city"],
                    "state": item["court__turf__state"],
                    "total_bookings": item["total_bookings"],
                    "confirmed_bookings": item["confirmed_bookings"],
                    "cancelled_bookings": item["cancelled_bookings"],
                    "pending_bookings": item["pending_bookings"],
                    "total_revenue": item["total_revenue"] or 0,
                }
                for item in by_turf
            ],
        }

        return Response(data)


class OwnerTurfAnalyticsView(APIView):
    """
    Analytics for a single turf owned by the current business owner.
    Optional query params:
      - start_date (YYYY-MM-DD)
      - end_date   (YYYY-MM-DD)
    """

    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request, turf_id):
        try:
            turf = Turf.objects.get(
                id=turf_id,
                business__user=request.user,
            )
        except Turf.DoesNotExist:
            return Response(
                {"error": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        qs = Booking.objects.filter(court__turf=turf)

        start_date_str = request.query_params.get("start_date")
        end_date_str = request.query_params.get("end_date")

        def parse_date(value: str):
            try:
                return datetime.strptime(value, "%Y-%m-%d").date()
            except Exception:
                return None

        if start_date_str:
            start = parse_date(start_date_str)
            if start:
                qs = qs.filter(booking_date__gte=start)

        if end_date_str:
            end = parse_date(end_date_str)
            if end:
                qs = qs.filter(booking_date__lte=end)

        aggregates = qs.aggregate(
            total_bookings=Count("id"),
            confirmed_bookings=Count(
                "id", filter=Q(status=BookingStatus.CONFIRMED)
            ),
            cancelled_bookings=Count(
                "id", filter=Q(status=BookingStatus.CANCELLED)
            ),
            pending_bookings=Count(
                "id", filter=Q(status=BookingStatus.PENDING)
            ),
            total_revenue=Sum(
                "amount",
                filter=Q(
                    status=BookingStatus.CONFIRMED,
                    payment_status=PaymentStatus.SUCCESS,
                ),
            ),
        )

        by_court = (
            qs.values("court_id", "court__sports_type")
            .annotate(
                total_bookings=Count("id"),
                confirmed_bookings=Count(
                    "id", filter=Q(status=BookingStatus.CONFIRMED)
                ),
                total_revenue=Sum(
                    "amount",
                    filter=Q(
                        status=BookingStatus.CONFIRMED,
                        payment_status=PaymentStatus.SUCCESS,
                    ),
                ),
            )
            .order_by("-total_bookings")
        )

        data = {
            "turf_id": str(turf.id),
            "turf_name": turf.name,
            "total_bookings": aggregates.get("total_bookings") or 0,
            "confirmed_bookings": aggregates.get("confirmed_bookings") or 0,
            "cancelled_bookings": aggregates.get("cancelled_bookings") or 0,
            "pending_bookings": aggregates.get("pending_bookings") or 0,
            "total_revenue": aggregates.get("total_revenue") or 0,
            "courts": [
                {
                    "court_id": item["court_id"],
                    "sports_type": item["court__sports_type"],
                    "total_bookings": item["total_bookings"],
                    "confirmed_bookings": item["confirmed_bookings"],
                    "total_revenue": item["total_revenue"] or 0,
                }
                for item in by_court
            ],
        }

        return Response(data)