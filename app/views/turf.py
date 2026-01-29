from rest_framework.generics import CreateAPIView, ListAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from app.serializers.turf import TurfSerializer
from app.models.turf import Turf
from app.permission import IsOwner

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
    queryset = Turf.objects.filter(is_open=True)
    serializer_class = TurfSerializer
