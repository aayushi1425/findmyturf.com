from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from app.pagination import TurfPagination
from app.serializers.turf import TurfSerializer
from app.models.turf import Turf
from app.permission import IsOwner
from app.utils.geo import haversine

class TurfCreateView(CreateAPIView):
    serializer_class = TurfSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def perform_create(self, serializer):
        serializer.save(business=self.request.user.business)

class TurfUpdateView(UpdateAPIView):
    queryset = Turf.objects.all()
    serializer_class = TurfSerializer
    permission_classes = [IsAuthenticated, IsOwner]
    http_method_names = ['patch']

class TurfListView(ListAPIView):
    serializer_class = TurfSerializer
    pagination_class = TurfPagination

    def get_queryset(self):
        queryset = Turf.objects.filter(is_open=True)

        city = self.request.query_params.get("city")
        min_price = self.request.query_params.get("min_price")
        max_price = self.request.query_params.get("max_price")

        if city:
            queryset = queryset.filter(city__iexact=city)

        if min_price:
            queryset = queryset.filter(price__gte=min_price)

        if max_price:
            queryset = queryset.filter(price__lte=max_price)

        return queryset

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        lat = request.query_params.get("lat")
        lon = request.query_params.get("lon")
        radius = float(request.query_params.get("radius", 10))
        sort = request.query_params.get("sort")

        if not lat or not lon:
            page = self.paginate_queryset(queryset)
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        lat = float(lat)
        lon = float(lon)

        filtered = []

        for turf in queryset:
            distance = haversine(lat , lon , turf.latitude , turf.longitude)

            if distance <= radius:
                data = self.get_serializer(turf).data
                data["distance_km"] = round(distance, 2)
                filtered.append(data)

        if sort == "distance":
            filtered.sort(key=lambda x: x["distance_km"])

        page = self.paginate_queryset(filtered)
        return self.get_paginated_response(page)