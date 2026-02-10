from django.db.models import Count
from django.db.models import Avg
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from app.models.booking import Booking, BookingStatus
from app.models.court import Court
from app.models.turf import Turf
from app.pagination import TurfPagination
from app.permission import IsOwner
from app.serializers.turf import TurfSerializer
from app.utils.geo import haversine
from app.models.feedback import Feedback
class TurfCreateView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        serializer = TurfSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        turf = Turf.objects.create(
            business=request.user.business, **serializer.validated_data
        )

        return Response(TurfSerializer(turf).data,
            status=status.HTTP_201_CREATED,
        )

class TurfUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def patch(self, request, slug):
        try:
            turf = Turf.objects.get(id=slug, business__user=request.user)
        except Turf.DoesNotExist:
            return Response({"error": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = TurfSerializer(turf, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)

        for attr, value in serializer.validated_data.items():
            setattr(turf, attr, value)

        turf.save()

        return Response(TurfSerializer(turf).data,
            status=status.HTTP_200_OK,
        )

class TurfListView(APIView):
    pagination_class = TurfPagination

    def get(self, request):
        queryset = Turf.objects.filter(is_open=True)

        city = request.query_params.get("city")
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")
        sports_type = request.query_params.get("sports_type")
        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(name__icontains=search)
        if city:
            queryset = queryset.filter(city__iexact=city)

        if sports_type:
            queryset = queryset.filter(
                courts__sports_type__iexact=sports_type
            ).distinct()

        if min_price or max_price:
            court_filter = Court.objects.filter(turf__in=queryset)

            if min_price:
                court_filter = court_filter.filter(price__gte=min_price)
            
            if max_price:
                court_filter = court_filter.filter(price__lte=max_price)
        
            queryset = queryset.filter(id__in=court_filter.values("turf_id"))

        lat = request.query_params.get("lat")
        lon = request.query_params.get("lon")
        radius = float(request.query_params.get("radius", 10))
        sort = request.query_params.get("sort")

        results = []

        if lat and lon:
            lat = float(lat)
            lon = float(lon)

            for turf in queryset:
                distance = haversine(lat, lon, turf.latitude, turf.longitude)
        
                if distance <= radius:
                    data = TurfSerializer(turf).data
                    data["distance_km"] = round(distance, 2)
                    results.append(data)

            if sort == "distance":
                results.sort(key=lambda x: x["distance_km"])
        else:
            results = TurfSerializer(queryset, many=True).data

        for result in results:
            result['average_rating'] = 5
            continue;
            average_rating = Feedback.objects.filter(turf_id=result["id"]).aggregate(Avg('rating'))
            if average_rating['rating__avg']:
                result['average_rating'] = average_rating['rating__avg']
    
        paginator = self.pagination_class()
        page = paginator.paginate_queryset(results, request)

        return paginator.get_paginated_response(page)


class TurfDetailView(APIView):
    def get(self, request , slug):        
        try:
            turf = Turf.objects.get(slug=slug, is_open=True)
        except Turf.DoesNotExist:
            return Response({"error": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(TurfSerializer(turf).data,
            status=status.HTTP_200_OK,
        )


class MostBookedTurfView(APIView):
    """
    Public endpoint for normal users to see the most booked turf.

    Optional query params:
      - city: filter by city name (case-insensitive)
    """

    def get(self, request):
        qs = Booking.objects.filter(status=BookingStatus.CONFIRMED)

        city = request.query_params.get("city")
        if city:
            qs = qs.filter(court__turf__city__iexact=city)

        by_turf = (
            qs.values("court__turf_id")
            .annotate(
                total_bookings=Count("id"),
            )
            .order_by("-total_bookings")
        )

        top_list = list(by_turf[:4])
        if not top_list:
            return Response({"detail": "No bookings found."},
                status=status.HTTP_200_OK,
            )

        turf_ids = [row["court__turf_id"] for row in top_list]
        turfs = Turf.objects.filter(id__in=turf_ids, is_open=True)
        turf_map = {str(t.id): TurfSerializer(t).data for t in turfs}

        results = []
        for row in top_list:
            tid = row["court__turf_id"]
            turf_data = turf_map.get(str(tid))
            if not turf_data:
                continue
            results.append({
                    "turf": turf_data,
                    "total_bookings": row["total_bookings"],
                }
            )

        if not results:
            return Response(
                {"detail": "Most booked turfs are not available."},
                status=status.HTTP_200_OK,
            )

        return Response(results, status=status.HTTP_200_OK)