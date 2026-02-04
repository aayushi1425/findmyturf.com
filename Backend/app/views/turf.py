from app.models.turf import Turf
from app.models.court import Court
from app.permission import IsOwner
from app.utils.geo import get_lat_lng
from app.utils.dis import haversine

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from app.pagination import TurfPagination
from app.serializers.turf import TurfSerializer


class TurfCreateView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def post(self, request):
        serializer = TurfSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        turf = Turf.objects.create(
            business=request.user.business,
            **serializer.validated_data
        )

        return Response(
            TurfSerializer(turf).data,
            status=status.HTTP_201_CREATED
        )


class TurfUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsOwner]

    def patch(self, request, turf_id):
        try:
            turf = Turf.objects.get(
                id=turf_id,
                business__user=request.user
            )
        except Turf.DoesNotExist:
            return Response(
                {"error": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TurfSerializer(
            turf,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)

        for attr, value in serializer.validated_data.items():
            setattr(turf, attr, value)

        turf.save()

        return Response(
            TurfSerializer(turf).data,
            status=status.HTTP_200_OK
        )


class TurfListView(APIView):
    pagination_class = TurfPagination

    def get(self, request):
        queryset = Turf.objects.filter(is_open=True)

        city = request.query_params.get("city") or None
        min_price = request.query_params.get("min_price")
        max_price = request.query_params.get("max_price")
        if min_price == "":
            min_price = None
        if max_price == "":
            max_price = None

        if city:
            queryset = queryset.filter(city__iexact=city)

        if min_price is not None or max_price is not None:
            court_filter = Court.objects.filter(turf__in=queryset)

            if min_price is not None:
                court_filter = court_filter.filter(price__gte=float(min_price))

            if max_price is not None:
                court_filter = court_filter.filter(price__lte=float(max_price))

            queryset = queryset.filter(
                id__in=court_filter.values("turf_id")
            )

        location = request.query_params.get("location")
        lat = request.query_params.get("lat")
        lon = request.query_params.get("lon")
        radius_param = request.query_params.get("radius")
        radius = float(radius_param) if radius_param else 10.0
        sort = request.query_params.get("sort")

        results = []

        if location and not (lat and lon):
            lat, lon = get_lat_lng(location)

        if lat and lon:
            lat = float(lat)
            lon = float(lon)

            for turf in queryset:
                distance = haversine(
                    lat,
                    lon,
                    turf.latitude,
                    turf.longitude
                )

                if distance <= radius:
                    data = TurfSerializer(turf).data
                    data["distance_km"] = round(distance, 2)
                    results.append(data)

            if sort == "distance":
                results.sort(key=lambda x: x["distance_km"])
        else:
            results = TurfSerializer(
                queryset,
                many=True
            ).data

        paginator = self.pagination_class()
        page = paginator.paginate_queryset(results, request)

        return paginator.get_paginated_response(page)


class TurfDetailView(APIView):
    def get(self, request, turf_id):
        try:
            turf = Turf.objects.get(
                id=turf_id,
                is_open=True
            )
        except Turf.DoesNotExist:
            return Response(
                {"error": "Turf not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            TurfSerializer(turf).data,
            status=status.HTTP_200_OK
        )
